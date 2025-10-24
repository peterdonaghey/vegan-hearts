import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize AWS clients
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const timestamp = Date.now();

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: 'vegan-hearts-email-signups',
        Item: {
          email,
          timestamp,
          signupDate: new Date().toISOString(),
          source: 'landing-page',
        },
      })
    );

    // Send confirmation email via SES
    try {
      await sesClient.send(
        new SendEmailCommand({
          Source: 'hello@vegan-hearts.org',
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Subject: {
              Data: '🌱 Welcome to VeganHearts!',
            },
            Body: {
              Html: {
                Data: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #346c39; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; background: #f0822a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌱 Welcome to VeganHearts!</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      
      <p>Thank you for joining the VeganHearts community! We're thrilled to have you with us on this journey toward a more compassionate world.</p>
      
      <p>You'll be the first to know when we launch our:</p>
      <ul>
        <li><strong>Opening Your Vegan Heart in 21 Days</strong> course</li>
        <li>Community platform for connecting with like-minded people</li>
        <li>Resource library with recipes, guides, and educational content</li>
        <li>Events and retreats worldwide</li>
      </ul>
      
      <p>In the meantime, follow our journey:</p>
      <p style="text-align: center;">
        <a href="https://vegan-hearts.org" class="button">Visit VeganHearts.org</a>
      </p>
      
      <p>With love and compassion,<br>The VeganHearts Team</p>
      
      <div class="footer">
        <p><em>For the animals. For the planet. For each other.</em></p>
        <p style="font-size: 12px; color: #999;">
          You're receiving this because you signed up at vegan-hearts.org<br>
          VeganHearts &copy; 2025
        </p>
      </div>
    </div>
  </div>
</body>
</html>
                `,
              },
              Text: {
                Data: `
Welcome to VeganHearts!

Thank you for joining our community! We're thrilled to have you with us.

You'll be the first to know when we launch our course, community platform, resource library, and events.

Visit us at: https://vegan-hearts.org

With love and compassion,
The VeganHearts Team

For the animals. For the planet. For each other.
                `,
              },
            },
          },
        })
      );
    } catch (sesError) {
      // Log SES error but don't fail the signup
      console.error('SES Error:', sesError);
      // Email saved to DB even if SES fails (might not be verified yet)
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing!',
    });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

