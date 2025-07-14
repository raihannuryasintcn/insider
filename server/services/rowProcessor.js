const db = require('../db/index');
const { findExistingContract } = require('./contractChecker');
const { generateHashFromRow } = require('../utils/hash');
const {
    getOrCreateLocation,
    getOrCreateAccountManager,
    getOrCreateCompany,
    getOrCreateService
} = require('./masterHelpers');
const { logChange } = require('../logs/logChange');

async function processRow(row) {
  const results = [];

  const location = await getOrCreateLocation(row);
  const company = await getOrCreateCompany(row, location.id);
  const service = await getOrCreateService(row);

  results.push(location, company, service);

  const existing = await db.query(`
    SELECT c.*, f.previous_status, f.current_status
    FROM contracts c
    LEFT JOIN funnel_statuses f ON f.contract_id = c.id
    WHERE c.company_id = $1 AND c.service_id = $2 AND c.start_month = $3
    LIMIT 1
  `, [company.id, service.id, row.start_month]);

  const existingRow = existing.rows[0];

  if (!existingRow) {
    const contractAction = await insertContractAndStatus(row);
    results.push(contractAction);
    return results;
  }

  if (existingRow.data_hash !== row.row_hash) {
    const contractAction = await updateContractAndStatus(existingRow, row);
    results.push(contractAction);
    return results;
  }

  results.push({ table: 'contracts', action: 'skipped' });
  return results;
}

async function insertContractAndStatus(row) {
  const location = await getOrCreateLocation(row);
  const accountManager = await getOrCreateAccountManager(row, location.id);
  const company = await getOrCreateCompany(row, location.id);
  const service = await getOrCreateService(row);

  const results = [location, accountManager, company, service];

  const contractRes = await db.query(`
    INSERT INTO contracts (
      company_id, service_id, account_manager_id,
      start_month, quantity, unit_price, potential_revenue, notes, data_hash
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
  `, [
    company.id, service.id, accountManager.id,
    row.start_month, row.quantity, row.unit_price,
    row.potential_revenue, row.notes, row.row_hash
  ]);
  const contract = contractRes.rows[0];

  await db.query(`
    INSERT INTO funnel_statuses (
      contract_id, month, previous_status, current_status, detail_status
    ) VALUES ($1, $2, $3, $4, $5)
  `, [
    contract.id, row.start_month, row.status, row.status, row.detail_status
  ]);

  await db.query(`
    INSERT INTO contract_distributions (
      contract_id, quantity_q1, quantity_q2, quantity_q3, quantity_q4,
      quantity_jan, quantity_feb, quantity_mar, quantity_apr, quantity_may, quantity_jun,
      quantity_jul, quantity_aug, quantity_sep, quantity_oct, quantity_nov, quantity_dec
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
  `, [
    contract.id,
    row.quantity_q1, row.quantity_q2, row.quantity_q3, row.quantity_q4,
    row.quantity_jan, row.quantity_feb, row.quantity_mar,
    row.quantity_apr, row.quantity_may, row.quantity_jun,
    row.quantity_jul, row.quantity_aug, row.quantity_sep,
    row.quantity_oct, row.quantity_nov, row.quantity_dec
  ]);

  await db.query(`
    INSERT INTO revenues (
      contract_id, rev_q1, rev_q2, rev_q3, rev_q4,
      rev_jan, rev_feb, rev_mar, rev_apr, rev_may, rev_jun,
      rev_jul, rev_aug, rev_sep, rev_oct, rev_nov, rev_dec,
      full_year
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
              $12,$13,$14,$15,$16,$17,$18)
  `, [
    contract.id,
    row.rev_q1, row.rev_q2, row.rev_q3, row.rev_q4,
    row.rev_jan, row.rev_feb, row.rev_mar,
    row.rev_apr, row.rev_may, row.rev_jun,
    row.rev_jul, row.rev_agt, row.rev_sep,
    row.rev_okt, row.rev_nov, row.rev_des,
    row.full_year
  ]);

  await logChange({
    tableName: 'contracts',
    operation: 'INSERT',
    recordId: contract.id,
    oldData: null,
    newData: contract
  });

  results.push({ table: 'contracts', action: 'inserted' });
  return results;
}

async function updateContractAndStatus(existing, row) {
  const contractId = existing.id;
  const results = [];

  const oldContract = { ...existing };
  const updatedFields = {
    quantity: row.quantity,
    unit_price: row.unit_price,
    potential_revenue: row.potential_revenue,
    notes: row.notes,
    data_hash: row.row_hash
  };

  await db.query(`
    UPDATE contracts SET
      quantity = $1,
      unit_price = $2,
      potential_revenue = $3,
      notes = $4,
      data_hash = $5
    WHERE id = $6
  `, [
    row.quantity,
    row.unit_price,
    row.potential_revenue,
    row.notes,
    row.row_hash,
    contractId
  ]);

  await logChange({
    tableName: 'contracts',
    operation: 'UPDATE',
    recordId: contractId,
    oldData: oldContract,
    newData: { ...oldContract, ...updatedFields }
  });
  results.push({ table: 'contracts', action: 'updated' });

  await db.query(`
    UPDATE funnel_statuses SET
      month = $1,
      previous_status = current_status,
      current_status = $2,
      detail_status = $3
    WHERE contract_id = $4
  `, [
    row.start_month,
    row.status,
    row.detail_status,
    contractId
  ]);

  await logChange({
    tableName: 'funnel_statuses',
    operation: 'UPDATE',
    recordId: contractId,
    oldData: {
      previous_status: existing.previous_status,
      current_status: existing.current_status
    },
    newData: {
      previous_status: existing.current_status,
      current_status: row.status
    }
  });
  results.push({ table: 'funnel_statuses', action: 'updated' });

  await db.query(`
    UPDATE contract_distributions SET
      quantity_q1=$2, quantity_q2=$3, quantity_q3=$4, quantity_q4=$5,
      quantity_jan=$6, quantity_feb=$7, quantity_mar=$8, quantity_apr=$9,
      quantity_may=$10, quantity_jun=$11, quantity_jul=$12, quantity_aug=$13,
      quantity_sep=$14, quantity_oct=$15, quantity_nov=$16, quantity_dec=$17
    WHERE contract_id=$1
  `, [
    contractId,
    row.quantity_q1, row.quantity_q2, row.quantity_q3, row.quantity_q4,
    row.quantity_jan, row.quantity_feb, row.quantity_mar, row.quantity_apr,
    row.quantity_may, row.quantity_jun, row.quantity_jul, row.quantity_aug,
    row.quantity_sep, row.quantity_oct, row.quantity_nov, row.quantity_dec
  ]);

  await logChange({
    tableName: 'contract_distributions',
    operation: 'UPDATE',
    recordId: contractId,
    oldData: null,
    newData: { ...row }
  });
  results.push({ table: 'contract_distributions', action: 'updated' });

  await db.query(`
    UPDATE revenues SET
      rev_q1=$2, rev_q2=$3, rev_q3=$4, rev_q4=$5,
      rev_jan=$6, rev_feb=$7, rev_mar=$8, rev_apr=$9, rev_may=$10, rev_jun=$11,
      rev_jul=$12, rev_aug=$13, rev_sep=$14, rev_oct=$15, rev_nov=$16, rev_dec=$17,
      full_year=$18
    WHERE contract_id=$1
  `, [
    contractId,
    row.rev_q1, row.rev_q2, row.rev_q3, row.rev_q4,
    row.rev_jan, row.rev_feb, row.rev_mar, row.rev_apr, row.rev_may, row.rev_jun,
    row.rev_jul, row.rev_agt, row.rev_sep, row.rev_okt, row.rev_nov, row.rev_des,
    row.full_year
  ]);

  await logChange({
    tableName: 'revenues',
    operation: 'UPDATE',
    recordId: contractId,
    oldData: null,
    newData: { ...row }
  });
  results.push({ table: 'revenues', action: 'updated' });

  return results;
}

module.exports = {
  processRow
};
