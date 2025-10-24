#!/bin/bash
# VeganHearts - Setup AWS SES for Email Sending
# Date: 2025-10-24
# Description: Configure AWS SES to send confirmation emails

set -e

echo "📧 Setting up AWS SES for email sending..."

# Verify the sender email address
SENDER_EMAIL="hello@vegan-hearts.org"

echo "📬 Verifying sender email: $SENDER_EMAIL"
aws ses verify-email-identity \
  --profile peterdonaghey \
  --region us-east-1 \
  --email-address "$SENDER_EMAIL"

echo ""
echo "✅ Verification email sent to $SENDER_EMAIL"
echo ""
echo "⚠️  IMPORTANT: Check your inbox and click the verification link!"
echo ""
echo "📊 SES Details:"
echo "  Region: us-east-1"
echo "  Sender: $SENDER_EMAIL"
echo "  Status: Pending verification"
echo ""
echo "🔍 Check verification status:"
echo "  aws ses get-identity-verification-attributes --profile peterdonaghey --region us-east-1 --identities $SENDER_EMAIL"
echo ""
echo "💡 Note: SES starts in sandbox mode (can only send to verified addresses)"
echo "   To send to anyone, request production access:"
echo "   https://console.aws.amazon.com/ses/home?region=us-east-1#/account"
echo ""
echo "💰 Cost: Free tier includes 62,000 emails/month"

