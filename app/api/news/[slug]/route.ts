import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const region = (process.env.AWS_REGION || 'us-east-1').trim();
const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || '').trim();
const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();

if (!accessKeyId || !secretAccessKey) {
  throw new Error('AWS credentials are not configured');
}

const dynamoClient = new DynamoDBClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);
const TABLE_NAME = 'vegan-hearts-news';

interface NewsArticle {
  newsId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
  isActive: string;
  createdAt: string;
  updatedAt: string;
}

// GET - Get single news article by slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Scan table to find article by slug
    const result = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'slug = :slug AND isActive = :isActive',
        ExpressionAttributeValues: {
          ':slug': slug,
          ':isActive': 'true',
        },
      })
    );

    const article = result.Items?.[0] as NewsArticle | undefined;

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

