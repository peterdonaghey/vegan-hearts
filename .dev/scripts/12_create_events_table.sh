#!/bin/bash
# VeganHearts - Create Events DynamoDB Table
# Date: 2025-11-11
# Description: Create DynamoDB table for events with GSI for date sorting

set -e

echo "📅 Creating DynamoDB table for VeganHearts Events..."

# Create events table
aws dynamodb create-table \
  --profile peterdonaghey \
  --table-name vegan-hearts-events \
  --attribute-definitions \
    AttributeName=eventId,AttributeType=S \
    AttributeName=date,AttributeType=S \
    AttributeName=isActive,AttributeType=S \
  --key-schema \
    AttributeName=eventId,KeyType=HASH \
  --global-secondary-indexes \
    "[
      {
        \"IndexName\": \"DateIndex\",
        \"KeySchema\": [
          {\"AttributeName\": \"isActive\", \"KeyType\": \"HASH\"},
          {\"AttributeName\": \"date\", \"KeyType\": \"RANGE\"}
        ],
        \"Projection\": {
          \"ProjectionType\": \"ALL\"
        }
      }
    ]" \
  --billing-mode PAY_PER_REQUEST \
  --tags \
    Key=Project,Value=VeganHearts \
    Key=Environment,Value=Production \
  --region us-east-1

echo "✅ Events table created: vegan-hearts-events"
echo ""
echo "Table Schema:"
echo "- Primary Key: eventId (String)"
echo "- GSI: DateIndex (isActive + date for sorting)"
echo "- Billing: Pay per request"
echo ""
echo "Table will be ready in ~10 seconds..."
sleep 10

# Verify table exists
aws dynamodb describe-table \
  --profile peterdonaghey \
  --table-name vegan-hearts-events \
  --region us-east-1 \
  --query 'Table.TableStatus' \
  --output text

echo ""
echo "✅ Events table is ready!"

