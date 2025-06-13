const { S3Client } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();
const multerS3 = require('multer-s3');

// Initialize AWS clients
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Your existing bucket name
const bucketName = process.env.AWS_BUCKET_NAME;

// Table names
const TABLES = {
  CERTIFICATES: 'Certificates',
  GALLERY: 'Gallery'
};

// S3 Upload Configuration
const s3UploadConfig = {
  s3: s3,
  bucket: bucketName,
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    const folder = req.path.includes('certificates') ? 'certificates' : 'gallery';
    const uniqueFileName = `${folder}/${Date.now()}-${file.originalname}`;
    cb(null, uniqueFileName);
  }
};

module.exports = {
  s3,
  dynamoDB,
  bucketName,
  TABLES,
  s3UploadConfig
}; 