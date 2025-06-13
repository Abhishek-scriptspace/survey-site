const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

// Load environment variables
dotenv.config();

// Log environment variables (excluding sensitive data)
console.log('Environment Variables:');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET);
console.log('PORT:', process.env.PORT);

// Configure AWS credentials
const awsConfig = {
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: fromIni()
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Make AWS config available to routes
app.locals.awsConfig = awsConfig;

// Routes
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/gallery', require('./routes/gallery'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 