const express = require('express');
const { loginUser, getCurrentUser } = require('../services/authService');
const { auth } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validators');
const { logger } = require('../utils/logger');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', validateLogin, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const ipAddress = req.ip;
    
    const result = await loginUser(username, password, ipAddress);
    res.json(result);
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', auth, async (req, res, next) => {
  try {
    const user = await getCurrentUser(req.user.user_id);
    res.json(user);
  } catch (error) {
    logger.error('Get current user error:', error);
    next(error);
  }
});

module.exports = router; 