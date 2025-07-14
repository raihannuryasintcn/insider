const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { getIspSummary } = require('../controllers/ispController');

// Get all ISP data
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM data_isp');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching ISP data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unique values for a specific field
router.get('/unique/:field', async (req, res) => {
  try {
    const { field } = req.params;
    const result = await pool.query(`SELECT DISTINCT ${field} FROM data_isp WHERE ${field} IS NOT NULL`);
    res.json(result.rows.map(row => row[field]));
  } catch (err) {
    console.error('Error fetching unique values:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/summary', getIspSummary);

module.exports = router;