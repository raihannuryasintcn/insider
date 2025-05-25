// controllers/ispController.js
const pool = require('../config/database');

exports.getIspSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT province, COUNT(*) AS total_isp
      FROM data_isp
      WHERE province IS NOT NULL
      GROUP BY province
    `);

    const summary = {};
    result.rows.forEach(row => {
      summary[row.province] = {
        total_isp: parseInt(row.total_isp, 10)
      };
    });

    res.json(summary);
  } catch (err) {
    console.error('Error fetching ISP summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
