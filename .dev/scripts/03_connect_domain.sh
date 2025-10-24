#!/bin/bash
# VeganHearts - Connect Custom Domain
# Date: 2025-10-24
# Description: Connects vegan-hearts.org to Amplify app

set -e

AWS_PROFILE="peterdonaghey"
AWS_REGION="us-east-1"
DOMAIN_NAME="vegan-hearts.org"

echo "🌍 Connecting custom domain to Amplify..."

# Get app ID from saved file
if [ ! -f .dev/.amplify_app_id ]; then
  echo "❌ Amplify app ID not found"
  echo "💡 Run 02_deploy_amplify.sh first, or manually set APP_ID:"
  echo "   export APP_ID=your_app_id"
  exit 1
fi

APP_ID=$(cat .dev/.amplify_app_id)
echo "📦 Using Amplify App ID: $APP_ID"

# Connect domain
echo "🔗 Connecting $DOMAIN_NAME..."
aws amplify create-domain-association \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  --app-id "$APP_ID" \
  --domain-name "$DOMAIN_NAME" \
  --sub-domain-settings prefix=,branchName=main \
  --enable-auto-sub-domain

echo "✅ Domain connection initiated!"
echo ""
echo "⏳ DNS configuration takes ~15 minutes"
echo "🔒 SSL certificate provisioning takes ~15-60 minutes"
echo ""
echo "📊 Check status at:"
echo "   https://console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID/settings/domains"
echo ""
echo "✨ Once complete, your site will be live at:"
echo "   https://vegan-hearts.org"

