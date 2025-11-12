#!/bin/bash
# VeganHearts - Create DynamoDB Table for Password Setup Tokens
# Date: 2025-11-12
# Description: Create DynamoDB table to store password setup tokens

set -e

echo "📦 Creating DynamoDB table for password setup tokens..."

# Create the DynamoDB table
aws dynamodb create-table \
  --profile peterdonaghey \
  --region us-east-1 \
  --table-name vegan-hearts-password-tokens \
  --attribute-definitions \
    AttributeName=token,AttributeType=S \
  --key-schema \
    AttributeName=token,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --tags \
    Key=Project,Value=VeganHearts \
    Key=Environment,Value=Production

echo ""
echo "✅ DynamoDB table created!"
echo ""
echo "📊 Table Details:"
echo "  Name: vegan-hearts-password-tokens"
echo "  Region: us-east-1"
echo "  Billing: Pay per request (free tier eligible)"
echo "  Primary Key: token (Hash)"
echo ""

