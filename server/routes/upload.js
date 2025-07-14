const express = require('express');
const router = express.Router();
const multer = require('multer');
const parser = require('../services/parser');

// Setup multer (file upload handler)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST /upload-excel
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await parser.processExcel(filePath);
    res.json(result);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error });
  }
});

module.exports = router;
