const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');

/**
 * Login a user and return a JWT token
 * @param {string} username - The username
 * @param {string} password - The password
 * @param {string} ipAddress - The IP address of the client
 * @returns {Promise<Object>} - The user and token
 */
const loginUser = async (username, password, ipAddress) => {
  try {
    // Find user by username
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    const user = result.rows[0];
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    // Log login activity
    await db.query(
      'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
      [user.user_id, 'LOGIN', 'User logged in successfully', ipAddress]
    );

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return user data and token
    return {
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        role: user.role
      }
    };
  } catch (error) {
    logger.error('Login error:', error);
    throw error;
  }
};

/**
 * Get current user by ID
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} - The user data
 */
const getCurrentUser = async (userId) => {
  try {
    const result = await db.query(
      'SELECT user_id, username, role FROM users WHERE user_id = $1',
      [userId]
    );

    if (!result.rows[0]) {
      throw new AppError('User not found', 404);
    }

    return result.rows[0];
  } catch (error) {
    logger.error('Get current user error:', error);
    throw error;
  }
};

module.exports = {
  loginUser,
  getCurrentUser
};
