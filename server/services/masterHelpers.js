const db = require('../db/index');
const { logChange } = require('../logs/logChange');

// Generic helper: get or insert-or-update, return id + action + table
async function getOrInsertId({ table, lookupFields, insertFields }) {
  const where = Object.keys(lookupFields)
    .map((key, i) => `${key} = $${i + 1}`)
    .join(' AND ');
  const whereValues = Object.values(lookupFields);

  const selectQuery = `SELECT * FROM ${table} WHERE ${where} LIMIT 1`;
  const selectRes = await db.query(selectQuery, whereValues);

  if (selectRes.rows.length > 0) {
    const existing = selectRes.rows[0];
    const updates = {};
    let changed = false;

    for (const key of Object.keys(insertFields)) {
      if (existing[key] !== insertFields[key]) {
        updates[key] = insertFields[key];
        changed = true;
      }
    }

    if (changed) {
      const updateCols = Object.keys(updates);
      const updateVals = Object.values(updates);
      const setClause = updateCols.map((col, i) => `${col} = $${i + 1}`).join(', ');
      const updateQuery = `UPDATE ${table} SET ${setClause} WHERE id = $${updateCols.length + 1}`;
      await db.query(updateQuery, [...updateVals, existing.id]);

      await logChange({
        tableName: table,
        operation: 'UPDATE',
        recordId: existing.id,
        oldData: existing,
        newData: { ...existing, ...updates }
      });

      return { id: existing.id, action: 'updated', table };
    }

    return { id: existing.id, action: 'skipped', table };
  }

  // Insert baru
  const insertCols = Object.keys(insertFields);
  const insertVals = Object.values(insertFields);
  const placeholders = insertVals.map((_, i) => `$${i + 1}`).join(', ');

  const insertQuery = `
    INSERT INTO ${table} (${insertCols.join(', ')})
    VALUES (${placeholders}) RETURNING *
  `;
  const insertRes = await db.query(insertQuery, insertVals);
  const inserted = insertRes.rows[0];

  await logChange({
    tableName: table,
    operation: 'INSERT',
    recordId: inserted.id,
    oldData: null,
    newData: inserted
  });

  return { id: inserted.id, action: 'inserted', table };
}

// Helper khusus sesuai struktur
async function getOrCreateLocation(row) {
  return await getOrInsertId({
    table: 'locations',
    lookupFields: {
      territory_name: row.territory,
      district_name: row.district,
      location_name: row.location
    },
    insertFields: {
      territory_name: row.territory,
      district_name: row.district,
      location_name: row.location
    }
  });
}

async function getOrCreateAccountManager(row, locationId) {
  return await getOrInsertId({
    table: 'account_managers',
    lookupFields: {
      am_name: row.am,
      pic_district_name: row.pic_district,
      location_id: locationId
    },
    insertFields: {
      am_name: row.am,
      pic_district_name: row.pic_district,
      location_id: locationId
    }
  });
}

async function getOrCreateCompany(row, locationId) {
  return await getOrInsertId({
    table: 'companies',
    lookupFields: {
      brand_name: row.brand_name,
      company_name: row.company_name,
      location_id: locationId
    },
    insertFields: {
      brand_name: row.brand_name,
      company_name: row.company_name,
      location_id: locationId
    }
  });
}

async function getOrCreateService(row) {
  return await getOrInsertId({
    table: 'services',
    lookupFields: {
      scope_of_work: row.scope_of_work,
      service_group: row.service_group,
      service_name: row.service_name,
      unit: row.unit
    },
    insertFields: {
      scope_of_work: row.scope_of_work,
      service_group: row.service_group,
      service_name: row.service_name,
      unit: row.unit
    }
  });
}

module.exports = {
  getOrCreateLocation,
  getOrCreateAccountManager,
  getOrCreateCompany,
  getOrCreateService
};
