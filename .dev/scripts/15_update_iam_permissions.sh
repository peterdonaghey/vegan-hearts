#!/bin/bash
# VeganHearts - Update IAM Permissions
# Date: 2025-11-11
# Description: Extend IAM user permissions for S3, Cognito, and events table

set -e

echo "🔑 Updating IAM permissions for vegan-hearts-api..."

# Load Cognito config
source /tmp/cognito-config.txt

# Create updated policy document
cat > /tmp/vegan-hearts-api-policy-v2.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DynamoDBEmailSignups",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:*:table/vegan-hearts-email-signups"
    },
    {
      "Sid": "DynamoDBEvents",
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:*:table/vegan-hearts-events",
        "arn:aws:dynamodb:us-east-1:*:table/vegan-hearts-events/index/*"
      ]
    },
    {
      "Sid": "SESEmail",
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail",
        "sesv2:CreateContact",
        "sesv2:GetContact"
      ],
      "Resource": "*"
    },
    {
      "Sid": "S3Assets",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::vegan-hearts-assets",
        "arn:aws:s3:::vegan-hearts-assets/*"
      ]
    },
    {
      "Sid": "CognitoAdmin",
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminListGroupsForUser"
      ],
      "Resource": "arn:aws:cognito-idp:us-east-1:*:userpool/$NEXT_PUBLIC_COGNITO_USER_POOL_ID"
    }
  ]
}
EOF

# Get existing policy ARN
POLICY_ARN=$(aws iam list-policies \
  --profile peterdonaghey \
  --scope Local \
  --query "Policies[?PolicyName=='vegan-hearts-api-policy'].Arn" \
  --output text)

echo "Found existing policy: $POLICY_ARN"

# Create new policy version
NEW_VERSION=$(aws iam create-policy-version \
  --profile peterdonaghey \
  --policy-arn "$POLICY_ARN" \
  --policy-document file:///tmp/vegan-hearts-api-policy-v2.json \
  --set-as-default \
  --query 'PolicyVersion.VersionId' \
  --output text)

echo "✅ Policy updated to version: $NEW_VERSION"

# Delete old versions (keep only 2 most recent)
OLD_VERSIONS=$(aws iam list-policy-versions \
  --profile peterdonaghey \
  --policy-arn "$POLICY_ARN" \
  --query 'Versions[?!IsDefaultVersion]|[:-1].VersionId' \
  --output text)

if [ ! -z "$OLD_VERSIONS" ]; then
  for VERSION in $OLD_VERSIONS; do
    aws iam delete-policy-version \
      --profile peterdonaghey \
      --policy-arn "$POLICY_ARN" \
      --version-id "$VERSION" 2>/dev/null || true
    echo "  Cleaned up old version: $VERSION"
  done
fi

echo ""
echo "✅ IAM Permissions Updated!"
echo ""
echo "New permissions added:"
echo "  - DynamoDB: vegan-hearts-events table access"
echo "  - S3: vegan-hearts-assets bucket access"
echo "  - Cognito: User verification"
echo ""

