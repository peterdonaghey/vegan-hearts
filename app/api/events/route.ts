import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
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
const TABLE_NAME = 'vegan-hearts-events';

interface Event {
  eventId: string;
  title: string;
  description: string;
  date: string; // ISO timestamp
  endTime?: string; // ISO timestamp
  location: string;
  country?: string;
  isOnline: boolean;
  posterUrl: string;
  registrationUrl?: string;
  registrationMethod?: string;
  isActive: string; // 'true' or 'false' for GSI
  createdAt: string;
  updatedAt: string;
}

// GET - List all events (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'upcoming', 'past', 'all'
    const location = searchParams.get('location'); // country code or 'online'

    const now = new Date().toISOString();
    
    // Query active events using GSI
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'DateIndex',
        KeyConditionExpression: 'isActive = :isActive',
        ExpressionAttributeValues: {
          ':isActive': 'true',
        },
      })
    );

    let events = (result.Items || []) as Event[];

    // Filter by location if specified
    if (location) {
      if (location === 'online') {
        events = events.filter(e => e.isOnline);
      } else {
        events = events.filter(e => e.country?.toLowerCase() === location.toLowerCase());
      }
    }

    // Filter by status
    if (status === 'upcoming') {
      events = events.filter(e => e.date >= now);
      events.sort((a, b) => a.date.localeCompare(b.date)); // chronological
    } else if (status === 'past') {
      events = events.filter(e => e.date < now);
      events.sort((a, b) => b.date.localeCompare(a.date)); // reverse chronological
    } else {
      // All events
      events.sort((a, b) => b.date.localeCompare(a.date)); // most recent first
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create event (admin only)
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
      description,
      date,
      endTime,
      location,
      country,
      isOnline,
      posterUrl,
      registrationUrl,
      registrationMethod,
    } = body;

    // Validation
    if (!title || !date || !location || !posterUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: title, date, location, posterUrl' },
        { status: 400 }
      );
    }

    const eventId = randomUUID();
    const now = new Date().toISOString();

    const event: Event = {
      eventId,
      title,
      description: description || '',
      date,
      endTime,
      location,
      country,
      isOnline: !!isOnline,
      posterUrl,
      registrationUrl,
      registrationMethod,
      isActive: 'true',
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: event,
      })
    );

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

// PUT - Update event (admin only)
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
    const { eventId, ...updates } = body;

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId' },
        { status: 400 }
      );
    }

    // Build update expression
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'eventId' && key !== 'createdAt') {
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
        Key: { eventId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Event updated',
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete event (admin only)
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
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json(
        { error: 'Missing eventId' },
        { status: 400 }
      );
    }

    // Soft delete by setting isActive to false
    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { eventId },
        UpdateExpression: 'SET isActive = :isActive, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':isActive': 'false',
          ':updatedAt': new Date().toISOString(),
        },
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Event deleted',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

