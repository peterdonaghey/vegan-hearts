#!/bin/bash
# VeganHearts - Setup AWS Cognito User Pool
# Date: 2025-11-11
# Description: Create Cognito user pool for admin authentication

set -e

POOL_NAME="vegan-hearts-admins"
REGION="us-east-1"

echo "🔐 Creating Cognito User Pool for VeganHearts..."

# Create user pool
POOL_ID=$(aws cognito-idp create-user-pool \
  --profile peterdonaghey \
  --pool-name "$POOL_NAME" \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}" \
  --auto-verified-attributes email \
  --mfa-configuration OFF \
  --account-recovery-setting "RecoveryMechanisms=[{Priority=1,Name=verified_email}]" \
  --user-pool-tags Project=VeganHearts,Environment=Production \
  --region "$REGION" \
  --query 'UserPool.Id' \
  --output text)

echo "✅ User pool created: $POOL_ID"

# Create user pool client (app client)
CLIENT_ID=$(aws cognito-idp create-user-pool-client \
  --profile peterdonaghey \
  --user-pool-id "$POOL_ID" \
  --client-name "vegan-hearts-admin-web" \
  --no-generate-secret \
  --refresh-token-validity 30 \
  --access-token-validity 1 \
  --id-token-validity 1 \
  --token-validity-units "AccessToken=hours,IdToken=hours,RefreshToken=days" \
  --read-attributes "email" "email_verified" \
  --write-attributes "email" \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --prevent-user-existence-errors ENABLED \
  --region "$REGION" \
  --query 'UserPoolClient.ClientId' \
  --output text)

echo "✅ App client created: $CLIENT_ID"

# Save credentials
cat > /tmp/cognito-config.txt << EOF
# AWS Cognito Configuration
# Add these to Vercel environment variables

NEXT_PUBLIC_COGNITO_USER_POOL_ID=$POOL_ID
NEXT_PUBLIC_COGNITO_CLIENT_ID=$CLIENT_ID
NEXT_PUBLIC_COGNITO_REGION=$REGION
EOF

echo ""
echo "✅ Cognito Setup Complete!"
echo ""
echo "User Pool ID: $POOL_ID"
echo "Client ID: $CLIENT_ID"
echo "Region: $REGION"
echo ""
echo "Configuration saved to: /tmp/cognito-config.txt"
echo ""
echo "Next steps:"
echo "1. Add environment variables to Vercel"
echo "2. Create admin user with: ./.dev/scripts/14b_create_admin_user.sh"

