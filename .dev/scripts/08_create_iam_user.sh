#!/bin/bash
# VeganHearts - Create IAM User for API Access
# Date: 2025-10-24
# Description: Create IAM user with permissions for DynamoDB and SES

set -e

echo "👤 Creating IAM user for VeganHearts API..."

# Create IAM user
aws iam create-user \
  --profile peterdonaghey \
  --user-name vegan-hearts-api \
  --tags Key=Project,Value=VeganHearts Key=Environment,Value=Production

echo "✅ IAM user created: vegan-hearts-api"

# Create policy document
cat > /tmp/vegan-hearts-api-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:*:table/vegan-hearts-email-signups"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Create policy
POLICY_ARN=$(aws iam create-policy \
  --profile peterdonaghey \
  --policy-name vegan-hearts-api-policy \
  --policy-document file:///tmp/vegan-hearts-api-policy.json \
  --query 'Policy.Arn' \
  --output text)

echo "✅ IAM policy created: $POLICY_ARN"

# Attach policy to user
aws iam attach-user-policy \
  --profile peterdonaghey \
  --user-name vegan-hearts-api \
  --policy-arn "$POLICY_ARN"

echo "✅ Policy attached to user"

# Create access key
ACCESS_KEY_OUTPUT=$(aws iam create-access-key \
  --profile peterdonaghey \
  --user-name vegan-hearts-api \
  --output json)

ACCESS_KEY_ID=$(echo "$ACCESS_KEY_OUTPUT" | grep -o '"AccessKeyId": "[^"]*' | cut -d'"' -f4)
SECRET_ACCESS_KEY=$(echo "$ACCESS_KEY_OUTPUT" | grep -o '"SecretAccessKey": "[^"]*' | cut -d'"' -f4)

# Save to .env.local (gitignored)
cat > /tmp/vegan-hearts-env.txt << EOF
# AWS Credentials for VeganHearts API
AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY
AWS_REGION=us-east-1
EOF

echo ""
echo "✅ Access keys created and saved!"
echo ""
echo "🔑 Add these to Vercel environment variables:"
echo ""
cat /tmp/vegan-hearts-env.txt
echo ""
echo "🚀 To add to Vercel:"
echo "  vercel env add AWS_ACCESS_KEY_ID"
echo "  vercel env add AWS_SECRET_ACCESS_KEY"
echo "  vercel env add AWS_REGION"
echo ""
echo "💾 Credentials also saved to: /tmp/vegan-hearts-env.txt"
echo "⚠️  Keep these credentials secure! They grant access to DynamoDB and SES."

