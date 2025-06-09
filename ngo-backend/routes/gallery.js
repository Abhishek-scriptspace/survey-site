const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/gallery/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM gallery ORDER BY upload_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a gallery item (file upload or URL)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { type, title, description, uploadDate, sourceType, url } = req.body;
    let file_url = url;
    if (sourceType === 'file' && req.file) {
      file_url = `/uploads/gallery/${req.file.filename}`;
    }

    const [result] = await pool.query(
      'INSERT INTO gallery (type, title, description, file_url, source_type, upload_date) VALUES (?, ?, ?, ?, ?, ?)',
      [type, title, description, file_url, sourceType, uploadDate]
    );
    res.json({ id: result.insertId, type, title, description, file_url, sourceType, uploadDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a gallery item
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 