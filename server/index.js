const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const ispRoutes = require('./routes/isp');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/upload');
const statusRoutes = require('./routes/status');
const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;



// ? Middleware utama
app.use(cors({
  origin: ['https://insider.tif.co.id', 'http://localhost:5173','http://localhost:5174','http://10.212.1.212:4444', 'http://localhost:4242'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ?? Logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// ? Routes lama
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/isp', ispRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/status', statusRoutes);
app.use('/upload-excel', uploadRoutes);


// ? Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ? Error handler
app.use(errorHandler);

// ? Serve React frontend build (Vite output)
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// ? Global error handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

module.exports = app;
