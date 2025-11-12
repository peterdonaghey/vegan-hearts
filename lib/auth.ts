// Cognito JWT verification utility
import { CognitoJwtVerifier } from 'aws-jwt-verify';

let verifier: ReturnType<typeof CognitoJwtVerifier.create> | null = null;

function getVerifier() {
  if (!verifier) {
    if (!process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID) {
      throw new Error('NEXT_PUBLIC_COGNITO_USER_POOL_ID is required');
    }

    if (!process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID) {
      throw new Error('NEXT_PUBLIC_COGNITO_CLIENT_ID is required');
    }

    verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      tokenUse: 'access',
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
    });
  }
  return verifier;
}

export async function verifyAuthToken(authHeader: string | null): Promise<{ sub: string; email: string } | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const payload = await getVerifier().verify(token);
    return {
      sub: payload.sub,
      email: (payload.email as string) || (payload.username as string) || '',
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

