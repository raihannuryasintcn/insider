// controllers/ispController.js
const pool = require('../config/db');

exports.getIspSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        province,
        COUNT(*) AS total_isp,
        COUNT(CASE WHEN is_jartup = 'yes' THEN 1 END) AS total_jartup,
        COUNT(CASE WHEN is_jartaplok = 'yes' THEN 1 END) AS total_jartaplok
      FROM data_isp
      WHERE province IS NOT NULL
      GROUP BY province
    `);

    const summary = {};
    result.rows.forEach(row => {
      summary[row.province] = {
        total_isp: parseInt(row.total_isp, 10),
        total_jartup: parseInt(row.total_jartup, 10),
        total_jartaplok: parseInt(row.total_jartaplok, 10)
      };
    });

    res.json(summary);
  } catch (err) {
    console.error('Error fetching ISP summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
