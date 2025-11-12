#!/bin/bash
# VeganHearts - Create DynamoDB Table for Admin Users
# Date: 2025-11-12
# Description: Create DynamoDB table to store admin user profile data

set -e

echo "📦 Creating DynamoDB table for admin users..."

# Create the DynamoDB table
aws dynamodb create-table \
  --profile peterdonaghey \
  --region us-east-1 \
  --table-name vegan-hearts-admin-users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=email,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --global-secondary-indexes \
    "[
      {
        \"IndexName\": \"email-index\",
        \"KeySchema\": [
          {\"AttributeName\": \"email\", \"KeyType\": \"HASH\"}
        ],
        \"Projection\": {
          \"ProjectionType\": \"ALL\"
        }
      }
    ]" \
  --billing-mode PAY_PER_REQUEST \
  --tags \
    Key=Project,Value=VeganHearts \
    Key=Environment,Value=Production

echo ""
echo "✅ DynamoDB table created!"
echo ""
echo "📊 Table Details:"
echo "  Name: vegan-hearts-admin-users"
echo "  Region: us-east-1"
echo "  Billing: Pay per request (free tier eligible)"
echo "  Primary Key: userId (Hash)"
echo "  GSI: email-index for email lookups"
echo ""
echo "💰 Cost: ~$0/month (free tier covers typical usage)"
echo ""
echo "🔍 View table:"
echo "  aws dynamodb describe-table --profile peterdonaghey --region us-east-1 --table-name vegan-hearts-admin-users"

