const { S3Client, ListBucketsCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

// Log environment variables
console.log('Environment Variables:');
console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('AWS_S3_BUCKET:', process.env.AWS_S3_BUCKET);

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

async function testAWSConnection() {
  try {
    // Test S3 connection
    console.log('\nTesting S3 connection...');
    const s3Response = await s3Client.send(new ListBucketsCommand({}));
    console.log('S3 Buckets:', s3Response.Buckets.map(bucket => bucket.Name));

    // Test DynamoDB connection
    console.log('\nTesting DynamoDB connection...');
    const dynamoResponse = await dynamoClient.send(new ListTablesCommand({}));
    console.log('DynamoDB Tables:', dynamoResponse.TableNames);

    console.log('\nAWS connection test completed successfully!');
  } catch (error) {
    console.error('Error testing AWS connection:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      requestId: error.$metadata?.requestId
    });
  }
}

testAWSConnection(); 