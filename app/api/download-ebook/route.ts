import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UpdateCommand, GetCommand, PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const S3_PDF_URL =
  'https://vegan-hearts-public-files.s3.us-east-1.amazonaws.com/ebooks/awakening-your-vegan-heart-21-days.pdf';

const COUNTER_EMAIL = '__download_counter__';
const COUNTER_TIMESTAMP = 0;
const TABLE_NAME = 'vegan-hearts-email-signups';

export async function GET(request: NextRequest) {
  const region = (process.env.AWS_REGION || 'us-east-1').trim();
  const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();

  const dynamoClient = new DynamoDBClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
  const docClient = DynamoDBDocumentClient.from(dynamoClient);

  const { searchParams } = new URL(request.url);

  // If ?count: just return current count (no increment)
  if (searchParams.has('count')) {
    return NextResponse.json({ count: await getCount(docClient) });
  }

  // Increment counter
  const newCount = await incrementCount(docClient);

  // If ?increment: return new count as JSON (fire-and-forget from UI)
  if (searchParams.has('increment')) {
    return NextResponse.json({ count: newCount });
  }

  // Default: redirect to the PDF
  return NextResponse.redirect(S3_PDF_URL);
}

async function getCount(docClient: DynamoDBDocumentClient): Promise<number> {
  try {
    const result = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { email: COUNTER_EMAIL, timestamp: COUNTER_TIMESTAMP },
      })
    );
    return result.Item?.count ?? 0;
  } catch {
    return 0;
  }
}

async function incrementCount(docClient: DynamoDBDocumentClient): Promise<number> {
  try {
    const result = await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { email: COUNTER_EMAIL, timestamp: COUNTER_TIMESTAMP },
        UpdateExpression: 'ADD #count :inc',
        ExpressionAttributeNames: { '#count': 'count' },
        ExpressionAttributeValues: { ':inc': 1 },
        ReturnValues: 'UPDATED_NEW',
      })
    );
    return result.Attributes?.count ?? 0;
  } catch (error: any) {
    // If item doesn't exist yet, create it with count = 1
    if (error.name === 'ValidationException') {
      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            email: COUNTER_EMAIL,
            timestamp: COUNTER_TIMESTAMP,
            count: 1,
          },
        })
      );
      return 1;
    }
    console.error('Error incrementing download count:', error);
    return 0;
  }
}
