import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { verifyAuthToken } from '@/lib/auth';
import { randomUUID } from 'crypto';

const region = (process.env.AWS_REGION || 'us-east-1').trim();
const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || '').trim();
const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();

const dynamoClient = new DynamoDBClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

// S3 configuration
const S3_BUCKET = 'vegan-hearts-assets';
const AWS_REGION = region;
const TABLE_NAME = 'vegan-hearts-news';

interface NewsArticle {
  newsId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string; // ISO timestamp
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
  isActive: string; // 'true' or 'false' for GSI
  createdAt: string;
  updatedAt: string;
}

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// GET - List all news articles (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const slug = searchParams.get('slug');

    // If requesting a specific article by slug
    if (slug) {
      const result = await docClient.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: 'PublishDateIndex',
          KeyConditionExpression: 'isActive = :isActive',
          FilterExpression: 'slug = :slug',
          ExpressionAttributeValues: {
            ':isActive': 'true',
            ':slug': slug,
          },
          Limit: 1,
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
    }

    // Query active articles using GSI, sorted by publishDate (newest first)
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'PublishDateIndex',
        KeyConditionExpression: 'isActive = :isActive',
        ExpressionAttributeValues: {
          ':isActive': 'true',
        },
        ScanIndexForward: false, // Sort descending (newest first)
        Limit: limit ? parseInt(limit) : undefined,
      })
    );

    const articles = (result.Items || []) as NewsArticle[];

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

// POST - Create news article (admin only)
export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    const user = await verifyAuthToken(authHeader);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      author,
      publishDate,
      imageUrl,
      videoUrl,
      tags,
    } = body;

    // Validation
    if (!title || !excerpt || !content || !author || !publishDate) {
      return NextResponse.json(
        { error: 'Missing required fields: title, excerpt, content, author, publishDate' },
        { status: 400 }
      );
    }

    const newsId = randomUUID();
    const slug = generateSlug(title);
    const now = new Date().toISOString();

    const article: NewsArticle = {
      newsId,
      title,
      slug,
      excerpt,
      content,
      author,
      publishDate,
      imageUrl,
      videoUrl,
      tags: tags || [],
      isActive: 'true',
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: article,
      })
    );

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}

// PUT - Update news article (admin only)
export async function PUT(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    const user = await verifyAuthToken(authHeader);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { newsId, ...updates } = body;

    if (!newsId) {
      return NextResponse.json(
        { error: 'Missing newsId' },
        { status: 400 }
      );
    }

    // If title is being updated, regenerate slug
    if (updates.title) {
      updates.slug = generateSlug(updates.title);
    }

    // Build update expression
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'newsId' && key !== 'createdAt') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    // Always update the updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { newsId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return NextResponse.json({
      success: true,
      message: 'News article updated',
    });
  } catch (error) {
    console.error('Error updating news article:', error);
    return NextResponse.json(
      { error: 'Failed to update news article' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete news article (admin only)
export async function DELETE(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    const user = await verifyAuthToken(authHeader);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get('newsId');

    if (!newsId) {
      return NextResponse.json(
        { error: 'Missing newsId' },
        { status: 400 }
      );
    }

    // First, get the article to find all associated S3 assets
    const getResult = await docClient.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { newsId },
      })
    );

    const article = getResult.Item as NewsArticle | undefined;

    if (article) {
      // Collect all S3 URLs to delete
      const urlsToDelete: string[] = [];

      // Add featured image if exists
      if (article.imageUrl) {
        urlsToDelete.push(article.imageUrl);
      }

      // Add video if exists
      if (article.videoUrl) {
        urlsToDelete.push(article.videoUrl);
      }

      // Extract inline images from content (images uploaded via rich text editor)
      if (article.content) {
        const imgRegex = /<img[^>]+src="(https:\/\/vegan-hearts-assets\.s3\.us-east-1\.amazonaws\.com\/[^"]+)"/g;
        let match;
        while ((match = imgRegex.exec(article.content)) !== null) {
          urlsToDelete.push(match[1]);
        }
      }

      // Delete all S3 objects
      if (urlsToDelete.length > 0) {
        const s3Client = new S3Client({
          region: AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        });

        // Delete each object from S3
        for (const url of urlsToDelete) {
          try {
            // Extract the key from the URL
            const urlObj = new URL(url);
            const key = urlObj.pathname.substring(1); // Remove leading slash

            await s3Client.send(
              new DeleteObjectCommand({
                Bucket: S3_BUCKET,
                Key: key,
              })
            );
          } catch (s3Error) {
            console.error(`Failed to delete S3 object ${url}:`, s3Error);
            // Continue with other deletions even if one fails
          }
        }
      }
    }

    // Soft delete by setting isActive to false
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { newsId },
        UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':isActive': 'false',
          ':updatedAt': new Date().toISOString(),
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: 'News article and associated assets deleted',
    });
  } catch (error) {
    console.error('Error deleting news article:', error);
    return NextResponse.json(
      { error: 'Failed to delete news article' },
      { status: 500 }
    );
  }
}

