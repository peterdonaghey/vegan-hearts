import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { SESv2Client, CreateContactCommand, DeleteContactCommand } from '@aws-sdk/client-sesv2';
import { verifyAuthToken } from '@/lib/auth';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(client);

const sesClient = new SESv2Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const TABLE_NAME = 'vegan-hearts-email-signups';
const CONTACT_LIST_NAME = 'veganhearts-subscribers';

// GET - Fetch subscribers with pagination and filtering
export async function GET(request: Request) {
  const user = await verifyAuthToken(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const source = searchParams.get('source') || '';
    const status = searchParams.get('status') || '';

    // Scan the entire table
    const scanResult = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    let items = scanResult.Items || [];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.email?.toLowerCase().includes(searchLower) ||
          item.name?.toLowerCase().includes(searchLower)
      );
    }

    if (source) {
      items = items.filter((item) => item.source === source);
    }

    if (status) {
      const isUnsubscribed = status === 'unsubscribed';
      items = items.filter((item) => !!item.unsubscribed === isUnsubscribed);
    }

    // Sort by timestamp descending (most recent first)
    items.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // Calculate stats
    const stats = {
      total: items.length,
      active: items.filter((item) => !item.unsubscribed).length,
      unsubscribed: items.filter((item) => item.unsubscribed).length,
      bySource: {
        'landing-page': items.filter((item) => item.source === 'landing-page').length,
        'ebook-download': items.filter((item) => item.source === 'ebook-download').length,
        manual: items.filter((item) => item.source === 'manual').length,
      },
    };

    return NextResponse.json({
      subscribers: items,
      stats,
      total: items.length,
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  }
}

// POST - Manually add new subscriber
export async function POST(request: Request) {
  const user = await verifyAuthToken(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const item = {
      email,
      name: name || '',
      timestamp,
      signupDate: new Date().toISOString(),
      source: 'manual',
      unsubscribed: false,
    };

    // Add to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );

    // Add to SES contact list
    try {
      await sesClient.send(
        new CreateContactCommand({
          ContactListName: CONTACT_LIST_NAME,
          EmailAddress: email,
        })
      );
    } catch (contactError: any) {
      // If contact already exists, that's fine
      if (contactError.name !== 'AlreadyExistsException') {
        console.error('Error adding to SES contact list:', contactError);
      }
    }

    return NextResponse.json({
      success: true,
      subscriber: item,
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to add subscriber' },
      { status: 500 }
    );
  }
}

// PUT - Update subscriber (toggle unsubscribe status)
export async function PUT(request: Request) {
  const user = await verifyAuthToken(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, timestamp, unsubscribed } = body;

    if (!email || timestamp === undefined) {
      return NextResponse.json(
        { error: 'Email and timestamp are required' },
        { status: 400 }
      );
    }

    // Update in DynamoDB
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { email, timestamp },
        UpdateExpression: 'SET unsubscribed = :unsubscribed',
        ExpressionAttributeValues: {
          ':unsubscribed': unsubscribed,
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: `Subscriber ${unsubscribed ? 'unsubscribed' : 'resubscribed'} successfully`,
    });
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to update subscriber' },
      { status: 500 }
    );
  }
}

// DELETE - Remove subscriber(s)
export async function DELETE(request: Request) {
  const user = await verifyAuthToken(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { subscribers } = body;

    if (!subscribers || !Array.isArray(subscribers) || subscribers.length === 0) {
      return NextResponse.json(
        { error: 'Subscribers array is required' },
        { status: 400 }
      );
    }

    // Delete each subscriber
    const deletePromises = subscribers.map(async (sub: { email: string; timestamp: number }) => {
      // Delete from DynamoDB
      await docClient.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: {
            email: sub.email,
            timestamp: sub.timestamp,
          },
        })
      );

      // Try to delete from SES contact list
      try {
        await sesClient.send(
          new DeleteContactCommand({
            ContactListName: CONTACT_LIST_NAME,
            EmailAddress: sub.email,
          })
        );
      } catch (sesError: any) {
        // If contact doesn't exist in SES, that's fine
        if (sesError.name !== 'NotFoundException') {
          console.error('Error removing from SES contact list:', sesError);
        }
      }
    });

    await Promise.all(deletePromises);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${subscribers.length} subscriber(s)`,
    });
  } catch (error) {
    console.error('Error deleting subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscribers' },
      { status: 500 }
    );
  }
}

