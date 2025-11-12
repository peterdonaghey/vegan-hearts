#!/bin/bash
# VeganHearts - Update IAM Permissions for Cognito Admin Operations
# Date: 2025-11-12
# Description: Add Cognito admin permissions to vegan-hearts-api IAM user

set -e

echo "🔐 Updating IAM permissions for Cognito admin operations..."

# Get the existing policy
POLICY_ARN="arn:aws:iam::525020012122:policy/vegan-hearts-api-policy"

# Create new policy version with Cognito admin permissions
aws iam create-policy-version \
  --profile peterdonaghey \
  --policy-arn "$POLICY_ARN" \
  --policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "DynamoDBAccess",
        "Effect": "Allow",
        "Action": [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ],
        "Resource": [
          "arn:aws:dynamodb:us-east-1:525020012122:table/vegan-hearts-email-signups",
          "arn:aws:dynamodb:us-east-1:525020012122:table/vegan-hearts-events",
          "arn:aws:dynamodb:us-east-1:525020012122:table/vegan-hearts-events/index/*",
          "arn:aws:dynamodb:us-east-1:525020012122:table/vegan-hearts-admin-users",
          "arn:aws:dynamodb:us-east-1:525020012122:table/vegan-hearts-admin-users/index/*",
          "arn:aws:dynamodb:us-east-1:525020012122:table/vegan-hearts-password-tokens"
        ]
      },
      {
        "Sid": "S3Access",
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
        "Sid": "SESAccess",
        "Effect": "Allow",
        "Action": [
          "ses:SendEmail",
          "ses:SendRawEmail",
          "sesv2:SendEmail",
          "sesv2:CreateContact",
          "sesv2:DeleteContact"
        ],
        "Resource": "*"
      },
      {
        "Sid": "CognitoAdminAccess",
        "Effect": "Allow",
        "Action": [
          "cognito-idp:AdminCreateUser",
          "cognito-idp:AdminSetUserPassword",
          "cognito-idp:AdminDisableUser",
          "cognito-idp:AdminEnableUser",
          "cognito-idp:AdminDeleteUser",
          "cognito-idp:AdminResetUserPassword",
          "cognito-idp:AdminGetUser",
          "cognito-idp:ListUsers"
        ],
        "Resource": "arn:aws:cognito-idp:us-east-1:525020012122:userpool/us-east-1_Us0AwdnIH"
      }
    ]
  }' \
  --set-as-default

echo ""
echo "✅ IAM permissions updated!"
echo ""
echo "📝 Added Cognito Admin Permissions:"
echo "  - AdminCreateUser"
echo "  - AdminSetUserPassword"
echo "  - AdminDisableUser"
echo "  - AdminEnableUser"
echo "  - AdminDeleteUser"
echo "  - AdminResetUserPassword"
echo "  - AdminGetUser"
echo "  - ListUsers"
echo ""
echo "📝 Added DynamoDB Access:"
echo "  - vegan-hearts-admin-users table"
echo ""

