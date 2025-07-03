const { logger } = require('../utils/logger');
const { AppError } = require('../utils/errors');


const errorHandler = (err, req, res, next) => {
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });

    // Default error status and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let error = 'Server Error';

    // Handle specific error types
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        error = err.name;
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
        error = 'Validation Error';
    } else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        error = 'Authentication Error';
        message = 'Invalid token';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        error = 'Authentication Error';
        message = 'Token expired';
    } else if (err.code === '23505') { // PostgreSQL unique violation
        statusCode = 409;
        error = 'Conflict';
        message = 'Resource already exists';
    } else if (err.code === '23503') { // PostgreSQL foreign key violation
        statusCode = 400;
        error = 'Bad Request';
        message = 'Referenced resource does not exist';
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        error,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { errorHandler }; 