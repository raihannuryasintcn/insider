// Admin controller functions will be defined here
const db = require('../config/db');
const { AppError } = require('../utils/errors');

const getAllUsers = async (req, res, next) => {
    try {
        // Implement logic to fetch all users from the database
        const users = await db.query('SELECT user_id, username, role FROM users');
        res.status(200).json(users.rows);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
};