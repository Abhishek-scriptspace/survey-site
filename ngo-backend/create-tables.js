const { DynamoDBClient, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
const { fromIni } = require('@aws-sdk/credential-provider-ini');

// Initialize DynamoDB client with AWS CLI credentials
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: fromIni()
});

const createTable = async (tableName, keySchema, attributeDefinitions) => {
  const params = {
    TableName: tableName,
    KeySchema: keySchema,
    AttributeDefinitions: attributeDefinitions,
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  try {
    console.log(`Creating table ${tableName}...`);
    await dynamoClient.send(new CreateTableCommand(params));
    console.log(`Table ${tableName} created successfully`);
  } catch (error) {
    if (error.name === 'ResourceInUseException') {
      console.log(`Table ${tableName} already exists`);
    } else {
      console.error(`Error creating table ${tableName}:`, error);
      throw error;
    }
  }
};

const createTables = async () => {
  try {
    // Create Certificates table
    await createTable(
      'Certificates',
      [{ AttributeName: 'id', KeyType: 'HASH' }],
      [{ AttributeName: 'id', AttributeType: 'S' }]
    );

    // Create Gallery table
    await createTable(
      'Gallery',
      [{ AttributeName: 'id', KeyType: 'HASH' }],
      [{ AttributeName: 'id', AttributeType: 'S' }]
    );

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
};

createTables(); 