// src/db/test.js
const { query } = require('./index');

(async () => {
  const res = await query('SELECT NOW()');
  console.log('Koneksi sukses:', res.rows[0]);
})();
