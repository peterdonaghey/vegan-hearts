#!/bin/bash
# VeganHearts - Create Initial Admin User
# Date: 2025-11-11
# Description: Create the first admin user in Cognito

set -e

# Load config
if [ ! -f /tmp/cognito-config.txt ]; then
  echo "❌ Error: Run 14_setup_cognito.sh first"
  exit 1
fi

source /tmp/cognito-config.txt

echo "👤 Creating admin user in Cognito..."
echo ""
read -p "Admin email address: " ADMIN_EMAIL
read -sp "Temporary password (min 8 chars, uppercase, lowercase, number): " TEMP_PASSWORD
echo ""

# Create user
aws cognito-idp admin-create-user \
  --profile peterdonaghey \
  --user-pool-id "$NEXT_PUBLIC_COGNITO_USER_POOL_ID" \
  --username "$ADMIN_EMAIL" \
  --user-attributes Name=email,Value="$ADMIN_EMAIL" Name=email_verified,Value=true \
  --temporary-password "$TEMP_PASSWORD" \
  --message-action SUPPRESS \
  --region "$NEXT_PUBLIC_COGNITO_REGION"

echo ""
echo "✅ Admin user created!"
echo ""
echo "Email: $ADMIN_EMAIL"
echo "Temporary Password: $TEMP_PASSWORD"
echo ""
echo "⚠️  User will be prompted to change password on first login"
echo ""
echo "Save these credentials securely!"

