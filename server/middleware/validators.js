const { AppError } = require('../utils/errors');

/**
 * Validate login request
 */
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password must be strings' });
  }

  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: 'Username must be between 3 and 50 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  next();
};

/**
 * Validate user creation request
 */
const validateUserCreate = (req, res, next) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required' });
  }

  if (typeof username !== 'string' || typeof password !== 'string' || typeof role !== 'string') {
    return res.status(400).json({ error: 'Username, password, and role must be strings' });
  }

  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({ error: 'Username must be between 3 and 50 characters' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (!['administrator', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role must be either "administrator" or "user"' });
  }

  next();
};

/**
 * Validate user update request
 */
const validateUserUpdate = (req, res, next) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ error: 'Role is required' });
  }

  if (typeof role !== 'string') {
    return res.status(400).json({ error: 'Role must be a string' });
  }

  if (!['administrator', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role must be either "administrator" or "user"' });
  }

  next();
};

module.exports = {
  validateLogin,
  validateUserCreate,
  validateUserUpdate
}; 