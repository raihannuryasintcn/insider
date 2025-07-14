const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new AppError('Authentication required', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await db.query(
            'SELECT user_id, username, role FROM users WHERE user_id = $1',
            [decoded.user_id]
        );

        if (!user.rows[0]) {
            throw new AppError('User not found', 401);
        }

        req.user = user.rows[0];
        req.token = token;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(401).json({ error: 'Please authenticate' });
    }
};

/**
 * Admin authorization middleware
 * Checks if the authenticated user is an administrator
 */
const adminAuth = (req, res, next) => {
    try {
        if (req.user.role !== 'administrator') {
            throw new AppError('Only administrators can perform this action', 403);
        }
        next();
    } catch (error) {
        logger.error('Admin authorization error:', error);
        res.status(403).json({ error: error.message });
    }
};

module.exports = {
    auth,
    adminAuth
}; 