const crypto = require('crypto');

/**
 * Generate MD5 hash dari seluruh kolom penting dalam 1 baris Excel
 * @param {Object} row - satu baris hasil parsing Excel
 * @returns {String} - string hash (md5)
 */
function generateHashFromRow(row) {
  // Ambil semua nilai kolom sebagai string dan gabungkan
  const rowString = Object.values(row)
    .map(val => (val === null || val === undefined ? '' : String(val).trim()))
    .join('|');

  // Generate hash md5
  return crypto.createHash('md5').update(rowString).digest('hex');
}

module.exports = { generateHashFromRow };
