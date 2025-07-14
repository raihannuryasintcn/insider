// src/services/parser.js
const fs = require('fs');
const xlsx = require('xlsx');
const { generateHashFromRow } = require('../utils/hash');
const { processRow } = require('./rowProcessor');

function parseNumber(value) {
  if (typeof value === 'string') {
    if (value.trim() === '-' || value.trim() === '') return 0;
    return parseInt(value.replace(/\./g, ''), 10);
  }
  if (typeof value === 'number') return value;
  return 0;
}

function parseStatus(value) {
  return typeof value === 'string' ? value.trim() : '';
}

module.exports = {
  async processExcel(filePath) {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = xlsx.utils.sheet_to_json(sheet, {
        defval: null,
        raw: true
      });

      const mappedData = jsonData
        .filter(row => row && typeof row === 'object')
        .map((row, index) => {
          const safe = (key) => row.hasOwnProperty(key) ? row[key] : null;

          return {
            row_number: index + 2,
            territory: safe('Territory'),
            brand_name: safe('Merek Usaha'),
            company_name: safe('Nama Perusahaan'),
            scope_of_work: safe('Scope Of Work'),
            service_group: safe('Kelompok Layanan'),
            service_name: safe('Layanan'),
            unit: safe('Satuan'),
            quantity: safe('Jumlah'),
            start_month: safe('Bulan Mulai'),
            unit_price: safe('Harga Satuan'),
            potential_revenue: safe('Potensi Revenue'),
            location: safe('Lokasi'),
            district: safe('Distrik'),
            am: safe('AM'),
            pic_district: safe('PIC Distrik'),
            status: parseStatus(safe('STATUS')),
            detail_status: safe('Detail Status'),
            notes: safe('Challenge/ SN/ Notes'),
            quantity_q1: parseNumber(safe('Q1')),
            quantity_q2: parseNumber(safe('Q2')),
            quantity_q3: parseNumber(safe('Q3')),
            quantity_q4: parseNumber(safe('Q4')),
            quantity_jan: parseNumber(safe('Jan')),
            quantity_feb: parseNumber(safe('Feb')),
            quantity_mar: parseNumber(safe('Mar')),
            quantity_apr: parseNumber(safe('Apr')),
            quantity_may: parseNumber(safe('May')),
            quantity_jun: parseNumber(safe('Jun')),
            quantity_jul: parseNumber(safe('Jul')),
            quantity_aug: parseNumber(safe('Aug')),
            quantity_sep: parseNumber(safe('Sep')),
            quantity_oct: parseNumber(safe('Oct')),
            quantity_nov: parseNumber(safe('Nov')),
            quantity_dec: parseNumber(safe('Dec')),
            rev_q1: parseNumber(safe('Rev Q1')),
            rev_q2: parseNumber(safe('Rev Q2')),
            rev_q3: parseNumber(safe('Rev Q3')),
            rev_q4: parseNumber(safe('Rev Q4')),
            rev_jan: parseNumber(safe('Rev Jan')),
            rev_feb: parseNumber(safe('Rev Feb')),
            rev_mar: parseNumber(safe('Rev Mar')),
            rev_apr: parseNumber(safe('Rev Apr')),
            rev_may: parseNumber(safe('Rev Mei')),
            rev_jun: parseNumber(safe('Rev Jun')),
            rev_jul: parseNumber(safe('Rev Juli')),
            rev_agt: parseNumber(safe('Rev Agt')),
            rev_sep: parseNumber(safe('Rev Sep')),
            rev_okt: parseNumber(safe('Rev Okt')),
            rev_nov: parseNumber(safe('Rev Nov')),
            rev_des: parseNumber(safe('Rev Des')),
            full_year: parseNumber(safe('Full Year')),
            row_hash: generateHashFromRow(row)
          };
        });

      const results = {
        inserted: {},
        updated: {},
        skipped: {}
      };

      for (const row of mappedData) {
        const rowActions = await processRow(row);

        for (const { table, action } of rowActions) {
          if (!results[action][table]) results[action][table] = 0;
          results[action][table]++;
        }
      }

      return {
        status: 'ok',
        totalRows: mappedData.length,
        ...results
      };
    } catch (err) {
      console.error('Gagal parsing Excel:', err);
      return {
        status: 'error',
        message: 'Gagal membaca file Excel',
        error: err.message
      };
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
};
