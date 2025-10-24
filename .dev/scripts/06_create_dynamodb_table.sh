#!/bin/bash
# VeganHearts - Create DynamoDB Table for Email Signups
# Date: 2025-10-24
# Description: Create DynamoDB table to store mailing list signups

set -e

echo "📦 Creating DynamoDB table for email signups..."

# Create the DynamoDB table
aws dynamodb create-table \
  --profile peterdonaghey \
  --region us-east-1 \
  --table-name vegan-hearts-email-signups \
  --attribute-definitions \
    AttributeName=email,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=email,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --tags \
    Key=Project,Value=VeganHearts \
    Key=Environment,Value=Production

echo ""
echo "✅ DynamoDB table created!"
echo ""
echo "📊 Table Details:"
echo "  Name: vegan-hearts-email-signups"
echo "  Region: us-east-1"
echo "  Billing: Pay per request (free tier eligible)"
echo "  Primary Key: email (Hash) + timestamp (Range)"
echo ""
echo "💰 Cost: ~$0/month (free tier covers typical usage)"
echo ""
echo "🔍 View table:"
echo "  aws dynamodb describe-table --profile peterdonaghey --region us-east-1 --table-name vegan-hearts-email-signups"

