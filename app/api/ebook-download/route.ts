import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { SESv2Client, CreateContactCommand } from '@aws-sdk/client-sesv2';

export async function POST(request: Request) {
  console.log('Ebook download API called');
  
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
    const { name, email } = body;
    console.log('Processing ebook download:', { name, email });

    // Validate inputs
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide your name' },
        { status: 400 }
      );
    }

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
          name,
          timestamp,
          signupDate: new Date().toISOString(),
          source: 'ebook-download',
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
      if (contactError.name !== 'AlreadyExistsException') {
        console.error('Error adding to contact list:', contactError);
      }
    }

    // Send ebook download email
    try {
      await sesClient.send(
        new SendEmailCommand({
          Source: 'hello@vegan-hearts.org',
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Subject: {
              Data: '🌱 Your Free Ebook: Awakening Your Vegan Heart in 21 Days',
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
    .download-box {
      background: linear-gradient(135deg, #39713b 0%, #2d5a30 100%);
      border-radius: 16px;
      padding: 30px;
      margin: 30px 0;
      text-align: center;
    }
    .download-box h3 {
      color: white;
      font-size: 24px;
      margin: 0 0 20px 0;
    }
    .button-wrapper {
      text-align: center;
      margin: 25px 0;
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
        <h1>Your Journey Begins! 🌱</h1>
      </div>
      
      <div class="content">
        <p class="greeting">Hello ${name}! 💚</p>
        
        <p>Thank you for downloading <strong>Awakening Your Vegan Heart in 21 Days</strong>!</p>
        
        <div class="highlight">
          <p>This gentle, inspiring program will guide you day by day with simple practices, reflections, and heart-opening tools.</p>
        </div>
        
        <div class="download-box">
          <h3>📖 Download Your Free Ebook</h3>
          <div class="button-wrapper">
            <a href="https://vegan-hearts-public-files.s3.us-east-1.amazonaws.com/ebooks/awakening-your-vegan-heart-21-days.pdf" class="button">Download Ebook Now</a>
          </div>
          <p style="color: white; margin-top: 15px; opacity: 0.9;">Begin your 21-day transformation at your own pace</p>
        </div>
        
        <p>No pressure, no perfection — simply a warm, supportive path into a kinder, more conscious way of living.</p>
        
        <div class="heart-divider">❤️</div>
        
        <div class="signature">
          <p>With love and compassion,</p>
          <p class="team">The VeganHearts Team</p>
        </div>
      </div>
      
      <div class="footer">
        <p class="footer-tagline">💚 For the animals. For the planet. For each other. 🌍</p>
        <p class="footer-small">
          You're receiving this because you requested our free ebook at <a href="https://vegan-hearts.org" class="footer-link">vegan-hearts.org</a>
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
Hello ${name}!

Thank you for downloading Awakening Your Vegan Heart in 21 Days!

Download your free ebook here:
https://vegan-hearts-public-files.s3.us-east-1.amazonaws.com/ebooks/awakening-your-vegan-heart-21-days.pdf

This gentle, inspiring program will guide you day by day with simple practices, reflections, and heart-opening tools.

No pressure, no perfection — simply a warm, supportive path into a kinder, more conscious way of living.

With love and compassion,
The VeganHearts Team

For the animals. For the planet. For each other.

---
You're receiving this because you requested our free ebook at vegan-hearts.org
Unsubscribe: https://vegan-hearts.org/api/unsubscribe?email=${encodeURIComponent(email)}
VeganHearts © 2025
                `,
              },
            },
          },
        })
      );
    } catch (sesError) {
      console.error('SES Error:', sesError);
    }

    return NextResponse.json({
      success: true,
      message: 'Check your email for the download link!',
    });
  } catch (error) {
    console.error('Ebook download error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process your request. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    );
  }
}

