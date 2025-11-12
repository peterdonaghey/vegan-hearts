import { NextResponse } from 'next/server';
import {
  CognitoIdentityProviderClient,
  AdminResetUserPasswordCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { verifyAuthToken } from '@/lib/auth';

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!;

// POST - Force password reset for user
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

    // Cannot reset your own password (use normal password change flow)
    if (userId === currentUser.sub) {
      return NextResponse.json(
        { error: 'Use the password change feature to reset your own password' },
        { status: 400 }
      );
    }

    // Reset password in Cognito - sends email to user
    await cognitoClient.send(
      new AdminResetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: userId,
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent to user',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

