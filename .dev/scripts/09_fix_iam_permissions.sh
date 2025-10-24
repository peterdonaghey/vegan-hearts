#!/bin/bash
# VeganHearts - Fix IAM Permissions
# Date: 2025-10-24
# Description: Update IAM policy to include all necessary DynamoDB permissions

set -e

echo "🔧 Fixing IAM permissions for vegan-hearts-api..."

# Get the policy ARN
POLICY_ARN=$(aws iam list-attached-user-policies \
  --profile peterdonaghey \
  --user-name vegan-hearts-api \
  --query 'AttachedPolicies[0].PolicyArn' \
  --output text)

echo "📋 Current policy: $POLICY_ARN"

# Create new policy version with all required permissions
cat > /tmp/vegan-hearts-api-policy-v2.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:DescribeTable",
        "dynamodb:BatchWriteItem",
        "dynamodb:BatchGetItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/vegan-hearts-email-signups",
        "arn:aws:dynamodb:us-east-1:*:table/vegan-hearts-email-signups/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "ses:GetSendQuota",
        "ses:GetIdentityVerificationAttributes"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Create new policy version
aws iam create-policy-version \
  --profile peterdonaghey \
  --policy-arn "$POLICY_ARN" \
  --policy-document file:///tmp/vegan-hearts-api-policy-v2.json \
  --set-as-default

echo ""
echo "✅ IAM permissions updated!"
echo ""
echo "📊 New permissions include:"
echo "  - Full DynamoDB access to vegan-hearts-email-signups table"
echo "  - SES email sending permissions"
echo ""
echo "🔍 Verify permissions:"
echo "  Use the credentials stored in Vercel environment variables"
echo "  or test with: aws dynamodb describe-table --profile peterdonaghey --table-name vegan-hearts-email-signups"

