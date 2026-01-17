import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { verifyAuthToken } from '@/lib/auth';

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = 'vegan-hearts-admin-users';

// POST - Update last login timestamp
export async function POST(request: Request) {
  const user = await verifyAuthToken(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Update lastLogin in DynamoDB
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userId: user.sub },
        UpdateExpression: 'SET lastLogin = :now',
        ExpressionAttributeValues: {
          ':now': new Date().toISOString(),
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Last login updated',
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    return NextResponse.json(
      { error: 'Failed to update last login' },
      { status: 500 }
    );
  }
}
