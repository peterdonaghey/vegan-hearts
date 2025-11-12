import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
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

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;
const TABLE_NAME = 'vegan-hearts-admin-users';
const TOKENS_TABLE = 'vegan-hearts-password-tokens';

// GET - Fetch all admin users
export async function GET(request: Request) {
  const user = await verifyAuthToken(request.headers.get('Authorization'));
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get all users from DynamoDB
    const scanResult = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
      })
    );

    const users = scanResult.Items || [];

    // Sort by creation date (newest first)
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate stats
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: users.length,
      active: users.filter((u) => u.status === 'active').length,
      disabled: users.filter((u) => u.status === 'disabled').length,
      recentlyAdded: users.filter(
        (u) => new Date(u.createdAt) >= thirtyDaysAgo
      ).length,
    };

    return NextResponse.json({
      users,
      stats,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new admin user
export async function POST(request: Request) {
  const currentUser = await verifyAuthToken(request.headers.get('Authorization'));
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { email, name, role, sendInvite = true, password } = body;

    // Validate inputs
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // If not sending invite, password is required
    if (!sendInvite && !password) {
      return NextResponse.json(
        { error: 'Password is required when not sending invite' },
        { status: 400 }
      );
    }

    // Create user in Cognito
    const createUserResponse = await cognitoClient.send(
      new AdminCreateUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        UserAttributes: [
          {
            Name: 'email',
            Value: email,
          },
          {
            Name: 'email_verified',
            Value: 'true',
          },
          {
            Name: 'name',
            Value: name,
          },
        ],
        MessageAction: 'SUPPRESS', // Don't send Cognito's default email
      })
    );

    const userId = createUserResponse.User?.Username!;

    // If password provided, set it directly and mark user as active
    if (!sendInvite && password) {
      await cognitoClient.send(
        new AdminSetUserPasswordCommand({
          UserPoolId: USER_POOL_ID,
          Username: userId,
          Password: password,
          Permanent: true,
        })
      );

      // Store profile as active
      const userProfile = {
        userId,
        email,
        name,
        role: role || 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.sub,
        lastLogin: null,
        metadata: {},
      };

      await docClient.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: userProfile,
        })
      );

      return NextResponse.json({
        success: true,
        user: userProfile,
      });
    }

    // Otherwise, generate token and send invite email
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

    // Store profile as pending
    const userProfile = {
      userId,
      email,
      name,
      role: role || 'admin',
      status: 'pending', // Status is pending until password is set
      createdAt: new Date().toISOString(),
      createdBy: currentUser.sub,
      lastLogin: null,
      metadata: {},
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: userProfile,
      })
    );

    // Send invitation email via SES
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
    const setupUrl = `${baseUrl}/admin/setup-password?token=${token}`;
    
    try {
      await sesClient.send(
        new SendEmailCommand({
          Source: 'hello@vegan-hearts.org',
          Destination: {
            ToAddresses: [email],
          },
          Message: {
            Subject: {
              Data: '🌱 Welcome to VeganHearts Admin',
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
                                <h1 style="color: white; font-size: 32px; margin: 0; font-weight: bold;">Welcome to VeganHearts! 🌱</h1>
                              </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                              <td style="padding: 40px;">
                                <p style="font-size: 18px; color: #333; margin: 0 0 20px 0;">Hi ${name},</p>
                                
                                <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 20px 0;">
                                  You've been invited to join the VeganHearts admin team! We're excited to have you on board. 🎉
                                </p>
                                
                                <p style="font-size: 16px; color: #555; line-height: 1.6; margin: 0 0 30px 0;">
                                  To get started, please click the button below to set up your password. This link will expire in 24 hours.
                                </p>
                                
                                <!-- Button -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td align="center" style="padding: 20px 0;">
                                      <a href="${setupUrl}" style="display: inline-block; background-color: #7BA05B; color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 12px rgba(123, 160, 91, 0.3);">
                                        Set Up Your Password
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                                
                                <p style="font-size: 14px; color: #888; line-height: 1.6; margin: 30px 0 0 0; padding-top: 30px; border-top: 1px solid #eee;">
                                  If the button doesn't work, copy and paste this link into your browser:<br>
                                  <a href="${setupUrl}" style="color: #7BA05B; word-break: break-all;">${setupUrl}</a>
                                </p>
                                
                                <p style="font-size: 14px; color: #888; line-height: 1.6; margin: 20px 0 0 0;">
                                  If you didn't expect this email, please ignore it or contact us.
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
      console.error('Error sending invitation email:', emailError);
      // Don't fail the user creation if email fails
    }

    return NextResponse.json({
      success: true,
      user: userProfile,
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.name === 'UsernameExistsException') {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT - Update admin user
export async function PUT(request: Request) {
  const currentUser = await verifyAuthToken(request.headers.get('Authorization'));
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, name, role, status } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get current user data to check status change
    const scanResult = await docClient.send(
      new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
    );

    const currentUserData = scanResult.Items?.[0];
    if (!currentUserData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update DynamoDB
    const updateExpression: string[] = [];
    const expressionAttributeValues: any = {};
    const expressionAttributeNames: any = {};

    if (name !== undefined) {
      updateExpression.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = name;
    }

    if (role !== undefined) {
      updateExpression.push('#role = :role');
      expressionAttributeNames['#role'] = 'role';
      expressionAttributeValues[':role'] = role;
    }

    if (status !== undefined) {
      updateExpression.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = status;

      // Update Cognito status if changed
      if (status !== currentUserData.status) {
        if (status === 'disabled') {
          await cognitoClient.send(
            new AdminDisableUserCommand({
              UserPoolId: USER_POOL_ID,
              Username: userId,
            })
          );
        } else if (status === 'active') {
          await cognitoClient.send(
            new AdminEnableUserCommand({
              UserPoolId: USER_POOL_ID,
              Username: userId,
            })
          );
        }
      }
    }

    if (updateExpression.length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    await docClient.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { userId },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
    );

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE - Remove admin user
export async function DELETE(request: Request) {
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

    // Cannot delete yourself
    if (userId === currentUser.sub) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete from Cognito
    await cognitoClient.send(
      new AdminDeleteUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: userId,
      })
    );

    // Delete from DynamoDB
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { userId },
      })
    );

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

