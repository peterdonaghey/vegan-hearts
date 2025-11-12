import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, QueryCommand, UpdateCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SESv2Client, CreateContactCommand } from '@aws-sdk/client-sesv2';

export async function POST(request: Request) {
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

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingRecords = await docClient.send(
      new QueryCommand({
        TableName: 'vegan-hearts-email-signups',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
        ScanIndexForward: false, // Get most recent first
        Limit: 1,
      })
    );

    const timestamp = Date.now();
    let isNewSubscriber = false;

    if (existingRecords.Items && existingRecords.Items.length > 0) {
      const existingRecord = existingRecords.Items[0];
      
      // If they're currently unsubscribed, reactivate them
      if (existingRecord.unsubscribed) {
        await docClient.send(
          new UpdateCommand({
            TableName: 'vegan-hearts-email-signups',
            Key: {
              email: existingRecord.email,
              timestamp: existingRecord.timestamp,
            },
            UpdateExpression: 'SET unsubscribed = :false REMOVE unsubscribedAt',
            ExpressionAttributeValues: {
              ':false': false,
            },
          })
        );
        isNewSubscriber = true; // Treat as new for welcome email
      }
      // If already active, just send welcome email, don't create duplicate
    } else {
      // New subscriber - create record
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
      isNewSubscriber = true;
    }

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
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    }
    .header { 
      background: linear-gradient(135deg, #39713b 0%, #2d5a30 100%);
      color: white; 
      padding: 60px 40px 50px;
      text-align: center;
    }
    .logo-wrapper {
      width: 180px;
      height: 180px;
      margin: 0 auto 25px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    .logo {
      width: 150px;
      height: 150px;
    }
    .header h1 {
      margin: 0;
      font-size: 34px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .content { 
      background: white;
      padding: 40px;
      color: #333;
    }
    .content p {
      margin: 0 0 20px 0;
      font-size: 17px;
      line-height: 1.7;
    }
    .content .greeting {
      font-size: 22px;
      font-weight: 600;
      color: #39713b;
      margin-bottom: 24px;
    }
    .highlight {
      background: linear-gradient(120deg, #fef3e6 0%, #fff9ed 100%);
      border-left: 4px solid #ed8329;
      padding: 24px;
      margin: 30px 0;
      border-radius: 12px;
    }
    .highlight p {
      margin: 0;
      font-size: 18px;
      color: #444;
      font-weight: 500;
    }
    .features-list {
      background: #f8f9fa;
      border-radius: 16px;
      padding: 30px;
      margin: 30px 0;
    }
    .features-list h3 {
      margin: 0 0 20px 0;
      font-size: 20px;
      color: #39713b;
      font-weight: 600;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      margin: 16px 0;
      padding: 12px;
      background: white;
      border-radius: 10px;
      transition: transform 0.2s;
    }
    .feature-emoji {
      font-size: 24px;
      margin-right: 12px;
      flex-shrink: 0;
    }
    .feature-text {
      font-size: 16px;
      color: #555;
      line-height: 1.5;
    }
    .feature-text strong {
      color: #39713b;
      font-weight: 600;
    }
    .button-wrapper {
      text-align: center;
      margin: 35px 0;
    }
    .button { 
      display: inline-block;
      background: linear-gradient(135deg, #ed8329 0%, #e07420 100%);
      color: white !important;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 17px;
      box-shadow: 0 4px 15px rgba(237, 131, 41, 0.3);
      transition: transform 0.2s;
    }
    .signature {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #f0f0f0;
    }
    .signature p {
      margin: 8px 0;
      font-size: 17px;
      color: #555;
    }
    .signature .team {
      color: #39713b;
      font-weight: 600;
    }
    .footer { 
      background: #FFFAF1;
      text-align: center;
      padding: 40px 30px;
      color: #666;
    }
    .footer-tagline {
      font-style: italic;
      color: #39713b;
      font-size: 18px;
      margin: 0 0 30px 0;
      font-weight: 500;
    }
    .footer-small {
      font-size: 14px;
      color: #999;
      margin: 8px 0;
      line-height: 1.6;
    }
    .footer-link {
      color: #ed8329;
      text-decoration: none;
      font-weight: 500;
    }
    .heart-divider {
      text-align: center;
      margin: 30px 0;
      font-size: 24px;
      color: #ed8329;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-wrapper">
          <img src="https://vegan-hearts.org/logo.png" alt="VeganHearts Logo" class="logo" width="150" height="150">
        </div>
        <h1>Welcome to VeganHearts! 🌱</h1>
      </div>
      
      <div class="content">
        <p class="greeting">Thank you for joining us! 💚</p>
        
        <p>Your journey toward a more compassionate world starts here. We're excited to have you as part of our community.</p>
        
        <div class="highlight">
          <p>You'll be the first to know about our courses, events, and resources as we build this movement together - directly from the heart.</p>
        </div>
        
        <div class="features-list">
          <h3>You'll be the first to know when we launch:</h3>
          
          <div class="feature-item">
            <span class="feature-emoji">🎓</span>
            <span class="feature-text"><strong>Opening Your Vegan Heart in 21 Days</strong> - A transformative course</span>
          </div>
          
          <div class="feature-item">
            <span class="feature-emoji">🤝</span>
            <span class="feature-text"><strong>Community Platform</strong> - Connect with like-minded people</span>
          </div>
          
          <div class="feature-item">
            <span class="feature-emoji">📚</span>
            <span class="feature-text"><strong>Resource Library</strong> - Recipes, guides, and educational content</span>
          </div>
          
          <div class="feature-item">
            <span class="feature-emoji">🌿</span>
            <span class="feature-text"><strong>Events & Retreats</strong> - Worldwide gatherings and experiences</span>
          </div>
        </div>
        
        <p style="text-align: center; font-size: 18px; color: #39713b; font-weight: 600; margin: 30px 0;">Let's veganize the world - because we care!</p>
        
        <div class="button-wrapper">
          <a href="https://vegan-hearts.org" class="button">Explore VeganHearts.org</a>
        </div>
        
        <div class="heart-divider">❤️</div>
        
        <div class="signature">
          <p>With love and compassion,</p>
          <p class="team">The VeganHearts Team</p>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-tagline">💚 For the animals. For the planet. For each other. 🌍</p>
        <p class="footer-small">
          You're receiving this because you signed up at <a href="https://vegan-hearts.org" class="footer-link">vegan-hearts.org</a>
        </p>
        <p class="footer-small">
          <a href="https://vegan-hearts.org/api/unsubscribe?email=${encodeURIComponent(email)}" class="footer-link">Unsubscribe</a>
        </p>
        <p class="footer-small">VeganHearts © 2025</p>
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

