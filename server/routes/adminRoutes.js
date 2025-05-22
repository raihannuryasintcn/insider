const express = require('express');
const { adminAuth } = require('../middleware/auth');
const adminController = require('../controllers/adminController'); // We will create this controller

const router = express.Router();

// Get all users (Admin only)
router.get('/users', adminAuth, adminController.getAllUsers);

module.exports = router;