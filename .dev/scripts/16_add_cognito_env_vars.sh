#!/bin/bash
# VeganHearts - Add Cognito Environment Variables to Vercel
# Date: 2025-11-11

set -e

echo "📝 Adding Cognito environment variables to Vercel..."
echo ""

# User Pool ID
echo "Adding NEXT_PUBLIC_COGNITO_USER_POOL_ID..."
vercel env add NEXT_PUBLIC_COGNITO_USER_POOL_ID production
vercel env add NEXT_PUBLIC_COGNITO_USER_POOL_ID preview  
vercel env add NEXT_PUBLIC_COGNITO_USER_POOL_ID development

# Client ID
echo "Adding NEXT_PUBLIC_COGNITO_CLIENT_ID..."
vercel env add NEXT_PUBLIC_COGNITO_CLIENT_ID production
vercel env add NEXT_PUBLIC_COGNITO_CLIENT_ID preview
vercel env add NEXT_PUBLIC_COGNITO_CLIENT_ID development

# Region
echo "Adding NEXT_PUBLIC_COGNITO_REGION..."
vercel env add NEXT_PUBLIC_COGNITO_REGION production
vercel env add NEXT_PUBLIC_COGNITO_REGION preview
vercel env add NEXT_PUBLIC_COGNITO_REGION development

echo ""
echo "✅ Environment variables added!"
echo ""
echo "Values to paste when prompted:"
echo "NEXT_PUBLIC_COGNITO_USER_POOL_ID: us-east-1_Us0AwdnIH"
echo "NEXT_PUBLIC_COGNITO_CLIENT_ID: 710osr70m6arhlp3jsrbaqbtpr"
echo "NEXT_PUBLIC_COGNITO_REGION: us-east-1"

