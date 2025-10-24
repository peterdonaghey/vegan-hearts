import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SESv2Client, CreateContactCommand } from '@aws-sdk/client-sesv2';

export async function POST(request: Request) {
  console.log('API called - Environment check:', {
    hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    hasRegion: !!process.env.AWS_REGION,
    region: process.env.AWS_REGION,
  });
  
  // Initialize AWS clients inside the function
  // Trim all environment variables to remove newlines
  const region = (process.env.AWS_REGION || 'us-east-1').trim();
  const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || '').trim();
  const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();
  
  const dynamoClient = new DynamoDBClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const docClient = DynamoDBDocumentClient.from(dynamoClient);

  const sesClient = new SESClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const sesV2Client = new SESv2Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  
  try {
    const body = await request.json();
    const { email } = body;
    console.log('Processing email:', email);

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
          unsubscribed: false,
        },
      })
    );

    // Add to SES contact list
    try {
      await sesV2Client.send(
        new CreateContactCommand({
          ContactListName: 'veganhearts-subscribers',
          EmailAddress: email,
        })
      );
    } catch (contactError: any) {
      // If contact already exists, that's fine
      if (contactError.name !== 'AlreadyExistsException') {
        console.error('Error adding to contact list:', contactError);
      }
    }

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
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #333;
      background-color: #FFFAF1;
      margin: 0;
      padding: 0;
    }
    .email-wrapper {
      background-color: #FFFAF1;
      padding: 40px 20px;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: #346c39;
      color: white; 
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content { 
      background: white;
      padding: 40px 30px;
      color: #333;
    }
    .content p {
      margin: 0 0 16px 0;
      font-size: 16px;
      line-height: 1.6;
    }
    .content ul {
      margin: 20px 0;
      padding-left: 20px;
    }
    .content li {
      margin: 10px 0;
      font-size: 16px;
    }
    .content strong {
      color: #346c39;
    }
    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }
    .button { 
      display: inline-block;
      background: #f0822a;
      color: white !important;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: background 0.3s;
    }
    .button:hover {
      background: #d97324;
    }
    .signature {
      margin-top: 30px;
      font-size: 16px;
    }
    .footer { 
      background: #FFFAF1;
      text-align: center;
      padding: 30px;
      color: #666;
    }
    .footer-tagline {
      font-style: italic;
      color: #2a5530;
      font-size: 16px;
      margin: 0 0 20px 0;
    }
    .footer-small {
      font-size: 13px;
      color: #999;
      margin: 5px 0;
    }
    .footer-link {
      color: #346c39;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <img src="https://vegan-hearts.org/logo.png" alt="VeganHearts Logo" class="logo" width="120" height="120">
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
        
        <div class="button-wrapper">
          <a href="https://vegan-hearts.org" class="button">Visit VeganHearts.org</a>
        </div>
        
        <div class="signature">
          <p>With love and compassion,<br>The VeganHearts Team</p>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-tagline">For the animals. For the planet. For each other.</p>
        <p class="footer-small">
          You're receiving this because you signed up at <a href="https://vegan-hearts.org" class="footer-link">vegan-hearts.org</a>
        </p>
        <p class="footer-small">
          <a href="https://vegan-hearts.org/api/unsubscribe?email=${encodeURIComponent(email)}" class="footer-link">Unsubscribe</a>
        </p>
        <p class="footer-small">VeganHearts &copy; 2025</p>
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

---
You're receiving this because you signed up at vegan-hearts.org
Unsubscribe: https://vegan-hearts.org/api/unsubscribe?email=${encodeURIComponent(email)}
VeganHearts © 2025
                `,
              },
            },
          },
        })
      );
    } catch (sesError) {
      // Log SES error but don't fail the signup
      console.error('SES Error:', sesError);
      // Email saved to DB even if SES fails
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing!',
    });
  } catch (error) {
    console.error('Subscription error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json(
      { 
        error: 'Failed to subscribe. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

