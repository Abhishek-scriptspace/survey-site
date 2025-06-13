const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

// Initialize AWS clients
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
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPEG, JPG, and PNG files are allowed.'));
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
  const key = `certificates/${uuidv4()}${fileExtension}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: fileType
  };

  try {
    console.log('Uploading to S3 with params:', {
      Bucket: params.Bucket,
      Key: params.Key,
      ContentType: params.ContentType,
      BodySize: file.buffer.length
    });

    await s3Client.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    console.error('S3 Upload Error Details:', {
      message: error.message,
      code: error.code,
      requestId: error.$metadata?.requestId,
      bucket: process.env.AWS_S3_BUCKET,
      region: process.env.AWS_REGION
    });
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

// Get all certificates
router.get('/', async (req, res) => {
  try {
    const { Items } = await docClient.send(new ScanCommand({
      TableName: 'Certificates'
    }));
    res.json(Items || []);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Add new certificate
router.post('/', upload.single('file'), async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);

    const { title, description, date, sourceType, url, fileType } = req.body;
    const id = uuidv4();
    const timestamp = new Date().toISOString();

    let fileUrl = '';
    if (sourceType === 'file' && req.file) {
      fileUrl = await uploadToS3(req.file, req.file.mimetype);
    } else if (sourceType === 'url') {
      fileUrl = url;
    }

    const certificate = {
      id,
      title,
      description,
      date: date || timestamp,
      sourceType,
      fileUrl,
      fileType: fileType || (req.file ? req.file.mimetype : ''),
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await docClient.send(new PutCommand({
      TableName: 'Certificates',
      Item: certificate
    }));

    res.status(201).json(certificate);
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(500).json({ error: error.message || 'Failed to add certificate' });
  }
});

// Delete certificate
router.delete('/:id', async (req, res) => {
  try {
    await docClient.send(new DeleteCommand({
      TableName: 'Certificates',
      Key: { id: req.params.id }
    }));
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

module.exports = router; 