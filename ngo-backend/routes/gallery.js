const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

// Initialize AWS clients with credentials from AWS CLI
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: fromIni()
});

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: fromIni()
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-matroska'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, MP4, AVI, MOV, WMV, and MKV files are allowed.'));
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 10MB' });
    }
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

// Apply multer error handling middleware
router.use(handleMulterError);

// Helper function to upload file to S3
const uploadToS3 = async (file, fileType) => {
  if (!process.env.AWS_S3_BUCKET) {
    throw new Error('AWS_S3_BUCKET environment variable is not set');
  }

  const fileExtension = path.extname(file.originalname);
  const key = `gallery/${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: fileType
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    console.log('Fetching gallery items...');
    const { Items } = await docClient.send(new ScanCommand({
      TableName: 'Gallery'
    }));
    console.log('Gallery items fetched:', Items);
    res.json(Items || []);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ error: 'Failed to fetch gallery items', details: error.message });
  }
});

// Add new gallery item
router.post('/', upload.single('file'), async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);

    const { title, description, type, sourceType, url } = req.body;
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    let fileUrl = url;
    if (sourceType === 'file' && req.file) {
      fileUrl = await uploadToS3(req.file, req.file.mimetype);
    }

    const galleryItem = {
      id,
      title,
      description,
      type,
      sourceType,
      fileUrl,
      fileType: req.file ? req.file.mimetype : null,
      uploadDate: timestamp,
      updatedAt: timestamp
    };

    await docClient.send(new PutCommand({
      TableName: 'Gallery',
      Item: galleryItem
    }));

    res.status(201).json(galleryItem);
  } catch (error) {
    console.error('Error adding gallery item:', error);
    res.status(500).json({ error: error.message || 'Failed to add gallery item' });
  }
});

// Delete gallery item
router.delete('/:id', async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: 'Gallery',
      Key: { id: req.params.id }
    }));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

module.exports = router; 