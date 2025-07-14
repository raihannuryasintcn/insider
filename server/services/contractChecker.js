const db = require('../db/index');

async function findExistingContract({ company_name, scope_of_work, start_month }) {
  const sql = `
    SELECT contracts.*, funnel_statuses.previous_status, funnel_statuses.current_status
    FROM contracts
    LEFT JOIN funnel_statuses ON funnel_statuses.contract_id = contracts.id
    WHERE company_name = $1 AND scope_of_work = $2 AND start_month = $3
    LIMIT 1
  `;
  const values = [company_name, scope_of_work, start_month];
  const result = await db.query(sql, values);
  return result.rows[0]; // bisa undefined kalau belum ada
}

module.exports = { findExistingContract };
