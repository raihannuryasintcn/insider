const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const { 
  validateUserCreate, 
  validateUserUpdate 
} = require('../middleware/validators');
const { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  getActivityLogs 
} = require('../services/userService');
const { logger } = require('../utils/logger');

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', auth, adminAuth, async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    logger.error('Get users error:', error);
    next(error);
  }
});

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Private/Admin
 */
router.post('/', auth, adminAuth, validateUserCreate, async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const adminId = req.user.user_id;
    const ipAddress = req.ip;
    
    const newUser = await createUser(username, password, role, adminId, ipAddress);
    res.status(201).json(newUser);
  } catch (error) {
    logger.error('Create user error:', error);
    next(error);
  }
});

/**
 * @route   PUT /api/users/:username
 * @desc    Update a user
 * @access  Private/Admin
 */
router.put('/:username', auth, adminAuth, validateUserUpdate, async (req, res, next) => {
  try {
    const { username } = req.params;
    const userData = {
      role: req.body.role
    };
    
    // Only include password if provided
    if (req.body.password) {
      userData.password = req.body.password;
    }
    
    const adminId = req.user.user_id;
    const ipAddress = req.ip;
    
    const updatedUser = await updateUser(username, userData, adminId, ipAddress);
    res.json(updatedUser);
  } catch (error) {
    logger.error('Update user error:', error);
    next(error);
  }
});

/**
 * @route   DELETE /api/users/:username
 * @desc    Delete a user
 * @access  Private/Admin
 */
router.delete('/:username', auth, adminAuth, async (req, res, next) => {
  try {
    const { username } = req.params;
    const adminId = req.user.user_id;
    const ipAddress = req.ip;
    
    // Don't allow deleting the current user
    if (username === req.user.username) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await deleteUser(username, adminId, ipAddress);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    next(error);
  }
});

/**
 * @route   GET /api/users/logs
 * @desc    Get activity logs
 * @access  Private/Admin
 */
router.get('/logs', auth, adminAuth, async (req, res, next) => {
  try {
    const logs = await getActivityLogs();
    res.json(logs);
  } catch (error) {
    logger.error('Get logs error:', error);
    next(error);
  }
});

module.exports = router; 