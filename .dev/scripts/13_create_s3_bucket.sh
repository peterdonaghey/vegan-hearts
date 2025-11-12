#!/bin/bash
# VeganHearts - Create S3 Bucket for Event Assets
# Date: 2025-11-11
# Description: Create S3 bucket for event posters with CloudFront distribution

set -e

BUCKET_NAME="vegan-hearts-assets"
REGION="us-east-1"

echo "🪣 Creating S3 bucket for VeganHearts assets..."

# Create S3 bucket
aws s3api create-bucket \
  --profile peterdonaghey \
  --bucket "$BUCKET_NAME" \
  --region "$REGION"

echo "✅ S3 bucket created: $BUCKET_NAME"

# Enable versioning
aws s3api put-bucket-versioning \
  --profile peterdonaghey \
  --bucket "$BUCKET_NAME" \
  --versioning-configuration Status=Enabled

echo "✅ Versioning enabled"

# Block public access (we'll use CloudFront)
aws s3api put-public-access-block \
  --profile peterdonaghey \
  --bucket "$BUCKET_NAME" \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

echo "✅ Public access configured"

# Create bucket policy for public read
cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --profile peterdonaghey \
  --bucket "$BUCKET_NAME" \
  --policy file:///tmp/bucket-policy.json

echo "✅ Bucket policy applied (public read)"

# Enable CORS for browser uploads
cat > /tmp/cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedOrigins": ["https://vegan-hearts.org", "http://localhost:3000"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --profile peterdonaghey \
  --bucket "$BUCKET_NAME" \
  --cors-configuration file:///tmp/cors-config.json

echo "✅ CORS configured"

# Add tags
aws s3api put-bucket-tagging \
  --profile peterdonaghey \
  --bucket "$BUCKET_NAME" \
  --tagging "TagSet=[{Key=Project,Value=VeganHearts},{Key=Environment,Value=Production}]"

echo "✅ Tags added"

echo ""
echo "📦 S3 Bucket Setup Complete!"
echo "Bucket Name: $BUCKET_NAME"
echo "Region: $REGION"
echo "URL Format: https://$BUCKET_NAME.s3.$REGION.amazonaws.com/[key]"
echo ""
echo "Note: CloudFront distribution can be added later for CDN performance"
echo "(Currently using direct S3 URLs for simplicity)"

