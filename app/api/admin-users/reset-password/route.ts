import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { verifyAuthToken } from '@/lib/auth';
import crypto from 'crypto';

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

const TABLE_NAME = 'vegan-hearts-admin-users';
const TOKENS_TABLE = 'vegan-hearts-password-tokens';

// POST - Send password reset link
export async function POST(request: Request) {
  const currentUser = await verifyAuthToken(request.headers.get('Authorization'));
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user details from DynamoDB
    const scanResult = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    const user = scanResult.Items?.[0];
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { email, name } = user;

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Valid for 24 hours

    // Store token in DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: TOKENS_TABLE,
        Item: {
          token,
          userId,
          email,
          expiresAt: tokenExpiry.toISOString(),
          used: false,
          createdAt: new Date().toISOString(),
        },
      })
    );

    // Send password reset email via SES
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/admin/setup-password?token=${token}`;
    
    try {
      await sesClient.send(
        new SendEmailCommand({
          Source: 'hello@vegan-hearts.org',
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Subject: {
              Data: '🔐 Password Reset Request - VeganHearts Admin',
              Charset: 'UTF-8',
            },
            Body: {
              Html: {
                Data: `
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #FFFAF1;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFAF1; padding: 40px 20px;">
                      <tr>
                        <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            
                            <!-- Header -->
                            <tr>
                              <td style="background: linear-gradient(135deg, #7BA05B 0%, #E97730 100%); padding: 40px; text-align: center;">
                                <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">Password Reset Request 🔐</h1>
                              </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                              <td style="padding: 40px;">
                                <p style="font-size: 18px; color: #333; margin: 0 0 20px 0;">Hi ${name},</p>
                                
                                <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 20px 0;">
                                  We received a request to reset your VeganHearts admin account password.
                                </p>
                                
                                <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 30px 0;">
                                  Click the button below to set a new password. This link will expire in 24 hours.
                                </p>
                                
                                <!-- Button -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td align="center" style="padding: 20px 0;">
                                      <a href="${resetUrl}" style="display: inline-block; background-color: #7BA05B; color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 12px rgba(123, 160, 91, 0.3);">
                                        Reset Your Password
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                                
                                <p style="font-size: 14px; color: #888; line-height: 1.6; margin: 30px 0 0 0; padding-top: 30px; border-top: 1px solid #eee;">
                                  If the button doesn't work, copy and paste this link into your browser:<br>
                                  <a href="${resetUrl}" style="color: #7BA05B; word-break: break-all;">${resetUrl}</a>
                                </p>
                                
                                <p style="font-size: 14px; color: #888; line-height: 1.6; margin: 20px 0 0 0;">
                                  If you didn't request this password reset, please ignore this email or contact us if you have concerns.
                                </p>
                              </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                              <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                                <p style="font-size: 14px; color: #999; margin: 0 0 10px 0;">
                                  With compassion,<br>
                                  <strong style="color: #7BA05B;">The VeganHearts Team</strong>
                                </p>
                                <p style="font-size: 12px; color: #aaa; margin: 0;">
                                  © ${new Date().getFullYear()} VeganHearts. All rights reserved.
                                </p>
                              </td>
                            </tr>
                            
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                  </html>
                `,
                Charset: 'UTF-8',
              },
            },
          },
        })
      );
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to user',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

