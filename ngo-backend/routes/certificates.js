const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/certificates/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM certificates ORDER BY date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a certificate (file upload or URL)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, description, date, sourceType, url } = req.body;
    let file_url = url;
    let file_type = req.body.fileType || '';

    if (sourceType === 'file' && req.file) {
      file_url = `/uploads/certificates/${req.file.filename}`;
      file_type = req.file.mimetype;
    }

    const [result] = await pool.query(
      'INSERT INTO certificates (title, description, file_url, file_type, source_type, date) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, file_url, file_type, sourceType, date]
    );
    res.json({ id: result.insertId, title, description, file_url, file_type, sourceType, date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a certificate
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 