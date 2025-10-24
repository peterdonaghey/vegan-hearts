#!/bin/bash
# VeganHearts - AWS Amplify Deployment
# Date: 2025-10-24
# Description: Creates Amplify app and connects to GitHub repo

set -e

AWS_PROFILE="peterdonaghey"
AWS_REGION="us-east-1"
APP_NAME="vegan-hearts"
REPO_URL="https://github.com/peterdonaghey/vegan-hearts"
BRANCH="main"

echo "🚀 Deploying VeganHearts to AWS Amplify..."

# Note: You'll need a GitHub token for this
# Get one from: https://github.com/settings/tokens
# Needs repo scope

if [ -z "$GITHUB_TOKEN" ]; then
  echo "⚠️  GITHUB_TOKEN not set"
  echo "📝 Please run: export GITHUB_TOKEN=your_token_here"
  echo "   Get token from: https://github.com/settings/tokens"
  echo ""
  echo "🌐 Or use AWS Console (recommended for first-time setup):"
  echo "   1. Go to: https://console.aws.amazon.com/amplify/"
  echo "   2. Click 'New app' → 'Host web app'"
  echo "   3. Select 'GitHub'"
  echo "   4. Authorize and select repo: peterdonaghey/vegan-hearts"
  echo "   5. Branch: main"
  echo "   6. Amplify auto-detects Next.js settings"
  echo "   7. Click 'Save and deploy'"
  exit 1
fi

# Create Amplify app
echo "📦 Creating Amplify app..."
APP_ID=$(aws amplify create-app \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  --name "$APP_NAME" \
  --repository "$REPO_URL" \
  --platform WEB \
  --oauth-token "$GITHUB_TOKEN" \
  --build-spec "$(cat amplify.yml)" \
  --query 'app.appId' \
  --output text)

echo "✅ Amplify app created: $APP_ID"

# Create branch connection
echo "🔗 Connecting to GitHub branch..."
aws amplify create-branch \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH"

echo "✅ Branch connected!"

# Start deployment
echo "🏗️  Starting deployment..."
JOB_ID=$(aws amplify start-job \
  --profile "$AWS_PROFILE" \
  --region "$AWS_REGION" \
  --app-id "$APP_ID" \
  --branch-name "$BRANCH" \
  --job-type RELEASE \
  --query 'jobSummary.jobId' \
  --output text)

echo "✅ Deployment started! Job ID: $JOB_ID"

# Save app ID for later use
echo "$APP_ID" > .dev/.amplify_app_id

echo ""
echo "📊 Monitor deployment at:"
echo "   https://console.aws.amazon.com/amplify/home?region=$AWS_REGION#/$APP_ID"
echo ""
echo "🌐 Default URL (after deployment):"
echo "   https://main.$APP_ID.amplifyapp.com"
echo ""
echo "⏳ Deployment takes ~5 minutes"
echo "💡 Next: Connect custom domain vegan-hearts.org"

