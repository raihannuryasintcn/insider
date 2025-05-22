const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');

const loginUser = async (username, password, ipAddress) => {
    try {
        const result = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        const user = result.rows[0];
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Log login activity
        await db.query(
            'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
            [user.user_id, 'LOGIN', 'User logged in successfully', ipAddress]
        );

        const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        return {
            token,
            user_id: {
                user_id: user.user_id,
                username: user.username,
                role: user.role
            }
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Get all users
 * @returns {Promise<Array>} - List of users
 */
const getAllUsers = async () => {
    try {
        const result = await db.query(
            'SELECT user_id, username, role, created_at FROM users ORDER BY created_at DESC'
        );
        return result.rows;
    } catch (error) {
        logger.error('Get all users error:', error);
        throw error;
    }
};

/**
 * Create a new user
 * @param {string} username - The username
 * @param {string} password - The password
 * @param {string} role - The user role
 * @param {number} adminId - The ID of the admin creating the user
 * @param {string} ipAddress - The IP address of the client
 * @returns {Promise<Object>} - The created user
 */
const createUser = async (username, password, role, adminId, ipAddress) => {
    try {
        // Validate input
        if (!username || !password || !role) {
            throw new AppError('Username, password, and role are required', 400);
        }
        
        if (username.length < 3) {
            throw new AppError('Username must be at least 3 characters long', 400);
        }
        
        if (password.length < 6) {
            throw new AppError('Password must be at least 6 characters long', 400);
        }
        
        if (!['user', 'administrator'].includes(role)) {
            throw new AppError('Invalid role. Must be either "user" or "administrator"', 400);
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create user
        const result = await db.query(
            'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING user_id, username, role, created_at',
            [username, hashedPassword, role]
        );

        // Log user creation
        await db.query(
            'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
            [adminId, 'CREATE_USER', `Created new user: ${username} with role: ${role}`, ipAddress]
        );

        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') { // Unique violation error code
            logger.warn(`Attempted to create user with existing username: "${username}"`, { ip: ipAddress, action: 'CREATE_USER_ATTEMPT' }); // Log a warning instead of error
            throw new AppError(`Username "${username}" already exists`, 409);
        }
        if (error instanceof AppError) {
            logger.error('Create user AppError:', error.message, { ip: ipAddress, action: 'CREATE_USER_FAILED' }); // Log AppError message
            throw error;
        }
        logger.error('Create user unexpected error:', error, { ip: ipAddress, action: 'CREATE_USER_FAILED' }); // Log unexpected errors
        throw new AppError('Failed to create user: ' + error.message, 500);
    }
};

/**
 * Update a user
 * @param {string} username - The username to update
 * @param {Object} userData - The user data to update (role and optional password)
 * @param {number} adminId - The ID of the admin updating the user
 * @param {string} ipAddress - The IP address of the client
 * @returns {Promise<Object>} - The updated user
 */
const updateUser = async (username, userData, adminId, ipAddress) => {
    try {
        // Validate input
        if (!username) {
            throw new AppError('Username is required', 400);
        }
        
        if (!userData.role) {
            throw new AppError('Role is required', 400);
        }
        
        if (!['user', 'administrator'].includes(userData.role)) {
            throw new AppError('Invalid role. Must be either "user" or "administrator"', 400);
        }
        
        if (userData.password && userData.password.length < 6) {
            throw new AppError('Password must be at least 6 characters long', 400);
        }
        
        let query = 'UPDATE users SET role = $1';
        const values = [userData.role];
        let paramCount = 1;

        // If password is provided, hash it and add to update
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);
            query += `, password = $${paramCount + 1}`;
            values.push(hashedPassword);
            paramCount++;
        }

        query += ` WHERE username = $${paramCount + 1} RETURNING user_id, username, role, created_at`;
        values.push(username);

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            throw new AppError(`User "${username}" not found`, 404);
        }

        // Log user update
        await db.query(
            'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
            [adminId, 'UPDATE_USER', `Updated user ${username} role to: ${userData.role}${userData.password ? ' and changed password' : ''}`, ipAddress]
        );

        return result.rows[0];
    } catch (error) {
        logger.error('Update user error:', error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to update user: ' + error.message, 500);
    }
};

/**
 * Delete a user
 * @param {string} username - The username to delete
 * @param {number} adminId - The ID of the admin deleting the user
 * @param {string} ipAddress - The IP address of the client
 * @returns {Promise<void>}
 */
const deleteUser = async (username, adminId, ipAddress) => {
    try {
        // Validate input
        if (!username) {
            throw new AppError('Username is required', 400);
        }
        
        const result = await db.query(
            'DELETE FROM users WHERE username = $1 RETURNING user_id, username',
            [username]
        );

        if (result.rows.length === 0) {
            throw new AppError(`User "${username}" not found`, 404);
        }

        // Log user deletion
        await db.query(
            'INSERT INTO activity_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
            [adminId, 'DELETE_USER', `Deleted user: ${username}`, ipAddress]
        );
    } catch (error) {
        logger.error('Delete user error:', error);
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('Failed to delete user: ' + error.message, 500);
    }
};

/**
 * Get activity logs
 * @returns {Promise<Array>} - List of activity logs
 */
const getActivityLogs = async () => {
    try {
        const result = await db.query(
            `SELECT al.*, u.username 
             FROM activity_logs al 
             JOIN users u ON al.user_id = u.user_id
             ORDER BY al.created_at DESC 
             LIMIT 100`
        );
        return result.rows;
    } catch (error) {
        logger.error('Get activity logs error:', error);
        throw error;
    }
};

module.exports = {
    loginUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getActivityLogs
};
