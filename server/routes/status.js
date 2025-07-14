const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/status
router.get('/', async (req, res) => {
  try {
    // Total count
    const totalCountResult = await db.query('SELECT COUNT(*) FROM funnel_statuses');
    const totalCount = parseInt(totalCountResult.rows[0].count, 10);

    // Count by current_status
    const currentStatusCountsResult = await db.query(
      'SELECT current_status, COUNT(*) FROM funnel_statuses GROUP BY current_status'
    );
    const currentStatusCounts = currentStatusCountsResult.rows.map(row => ({
      current_status: row.current_status,
      count: parseInt(row.count, 10)
    }));

    // Count by detail_status
    const detailStatusCountsResult = await db.query(
      'SELECT detail_status, COUNT(*) FROM funnel_statuses GROUP BY detail_status'
    );
    const detailStatusCounts = detailStatusCountsResult.rows.map(row => ({
      detail_status: row.detail_status,
      count: parseInt(row.count, 10)
    }));

    res.json({
      total_funnel: totalCount,
      current_status_summary: currentStatusCounts,
      detail_status_summary: detailStatusCounts
    });
  } catch (error) {
    console.error('Error fetching status data:', error);
    res.status(500).json({ message: 'Failed to fetch status data', error: error.message });
  }
});

module.exports = router;