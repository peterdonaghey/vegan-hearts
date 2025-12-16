#!/bin/bash
# VeganHearts - Restore Production Site
# Date: 2025-11-08
# Description: Re-add custom domain to Vercel and verify DNS

set -e

AWS_PROFILE="peterdonaghey"
DOMAIN="vegan-hearts.org"

echo "🔄 Restoring VeganHearts production site..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not installed"
    echo "📦 Install with: npm install -g vercel"
    exit 1
fi

# Add domain back to Vercel
echo "📍 Adding domain to Vercel..."
vercel domains add "$DOMAIN"

echo ""
echo "🔍 Verifying DNS configuration in Route53..."

# Get hosted zone ID
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --profile "$AWS_PROFILE" \
  --dns-name "$DOMAIN" \
  --query 'HostedZones[0].Id' \
  --output text 2>/dev/null | cut -d'/' -f3 || echo "")

if [ -n "$HOSTED_ZONE_ID" ]; then
  echo "✅ Hosted Zone ID: $HOSTED_ZONE_ID"
  
  # Check if DNS records are still pointing to Vercel
  A_RECORD=$(aws route53 list-resource-record-sets \
    --profile "$AWS_PROFILE" \
    --hosted-zone-id "$HOSTED_ZONE_ID" \
    --query "ResourceRecordSets[?Name=='$DOMAIN.' && Type=='A'].ResourceRecords[0].Value" \
    --output text)
  
  if [ "$A_RECORD" == "76.76.21.21" ]; then
    echo "✅ DNS A record correctly points to Vercel: $A_RECORD"
  else
    echo "⚠️  DNS A record may need updating: $A_RECORD"
    echo "📝 Expected: 76.76.21.21"
    echo ""
    echo "🔧 To update DNS, run:"
    echo "   ./.dev/scripts/05_update_dns_for_vercel.sh"
  fi
else
  echo "⚠️  Could not verify Route53 hosted zone"
fi

echo ""
echo "✅ Production restoration initiated!"
echo ""
echo "📊 Status:"
echo "   🌐 Domain added back to Vercel"
echo "   ⏳ DNS propagation: 1-5 minutes"
echo "   🔗 Site will be live at: https://$DOMAIN"
echo ""
echo "🧪 Test when ready:"
echo "   curl -I https://$DOMAIN"
echo ""
echo "💡 If site doesn't load after 5 minutes, check:"
echo "   1. Vercel dashboard: vercel.com"
echo "   2. DNS settings: vercel domains ls"
echo "   3. Route53 records in AWS Console"



