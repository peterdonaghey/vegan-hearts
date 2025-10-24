import { NextResponse } from 'next/server';
import { SESv2Client, DeleteContactCommand } from '@aws-sdk/client-sesv2';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { QueryCommand, UpdateCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background: #FFFAF1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
    }
    h1 { color: #346c39; margin: 0 0 20px; }
    p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <img src="/logo.png" alt="VeganHearts" class="logo">
    <h1>Invalid Link</h1>
    <p>This unsubscribe link is missing required information.</p>
  </div>
</body>
</html>`,
      { 
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }

  try {
    const region = (process.env.AWS_REGION || 'us-east-1').trim();
    const accessKeyId = (process.env.AWS_ACCESS_KEY_ID || '').trim();
    const secretAccessKey = (process.env.AWS_SECRET_ACCESS_KEY || '').trim();

    // Remove from SES contact list
    const sesClient = new SESv2Client({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    try {
      await sesClient.send(
        new DeleteContactCommand({
          ContactListName: 'veganhearts-subscribers',
          EmailAddress: email,
        })
      );
    } catch (sesError) {
      console.error('SES DeleteContact error:', sesError);
      console.error('SES Error details:', {
        message: sesError instanceof Error ? sesError.message : 'Unknown',
        name: sesError instanceof Error ? sesError.name : 'Unknown',
      });
      throw sesError; // Re-throw to trigger main error handler
    }

    // Mark as unsubscribed in DynamoDB (query for all entries with this email)
    try {
      const dynamoClient = new DynamoDBClient({
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
      const docClient = DynamoDBDocumentClient.from(dynamoClient);

      // Query all items with this email
      const queryResult = await docClient.send(
        new QueryCommand({
          TableName: 'vegan-hearts-email-signups',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': email,
          },
        })
      );

      // Update each item to mark as unsubscribed
      if (queryResult.Items && queryResult.Items.length > 0) {
        for (const item of queryResult.Items) {
          await docClient.send(
            new UpdateCommand({
              TableName: 'vegan-hearts-email-signups',
              Key: {
                email: item.email,
                timestamp: item.timestamp,
              },
              UpdateExpression: 'SET unsubscribed = :true, unsubscribedAt = :timestamp',
              ExpressionAttributeValues: {
                ':true': true,
                ':timestamp': new Date().toISOString(),
              },
            })
          );
        }
      }
    } catch (dbError) {
      // Log but don't fail - SES contact list is source of truth
      console.error('DynamoDB update failed (non-critical):', dbError);
    }

    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background: #FFFAF1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
    }
    h1 { color: #346c39; margin: 0 0 20px; }
    p { color: #666; line-height: 1.6; margin: 10px 0; }
    .email { color: #346c39; font-weight: 600; }
    a { color: #f0822a; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <img src="/logo.png" alt="VeganHearts" class="logo">
    <h1>✓ Successfully Unsubscribed</h1>
    <p>We've removed <span class="email">${email}</span> from our mailing list.</p>
    <p>You won't receive any more emails from VeganHearts.</p>
    <p style="margin-top: 30px;">
      Changed your mind? You can always <a href="https://vegan-hearts.org">resubscribe</a> on our website.
    </p>
  </div>
</body>
</html>`,
      { 
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background: #FFFAF1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
    }
    h1 { color: #346c39; margin: 0 0 20px; }
    p { color: #666; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="container">
    <img src="/logo.png" alt="VeganHearts" class="logo">
    <h1>Unsubscribe Error</h1>
    <p>There was a problem processing your unsubscribe request.</p>
    <p>Please contact us directly at hello@vegan-hearts.org</p>
  </div>
</body>
</html>`,
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

