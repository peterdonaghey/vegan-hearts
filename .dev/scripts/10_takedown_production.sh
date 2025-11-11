#!/bin/bash
# VeganHearts - Takedown Production Site
# Date: 2025-11-08
# Description: Remove custom domain from Vercel (keeps dev deployments working)

set -e

AWS_PROFILE="peterdonaghey"
DOMAIN="vegan-hearts.org"
STATE_FILE=".dev/scripts/.production_state.txt"

echo "📋 Documenting current production state..."

# Save timestamp
echo "=== Production Takedown ===" > "$STATE_FILE"
echo "Date: $(date)" >> "$STATE_FILE"
echo "" >> "$STATE_FILE"

# Document Vercel domain configuration
echo "🔍 Checking Vercel domain configuration..."
echo "=== Vercel Domains ===" >> "$STATE_FILE"
vercel domains ls >> "$STATE_FILE" 2>&1 || echo "No domains or vercel CLI not authenticated" >> "$STATE_FILE"
echo "" >> "$STATE_FILE"

# Document Route53 DNS settings
echo "🔍 Checking Route53 DNS configuration..."
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --profile "$AWS_PROFILE" \
  --dns-name "$DOMAIN" \
  --query 'HostedZones[0].Id' \
  --output text 2>/dev/null | cut -d'/' -f3 || echo "")

if [ -n "$HOSTED_ZONE_ID" ]; then
  echo "=== Route53 DNS Records ===" >> "$STATE_FILE"
  echo "Hosted Zone ID: $HOSTED_ZONE_ID" >> "$STATE_FILE"
  aws route53 list-resource-record-sets \
    --profile "$AWS_PROFILE" \
    --hosted-zone-id "$HOSTED_ZONE_ID" \
    --query "ResourceRecordSets[?Name=='$DOMAIN.' || Name=='www.$DOMAIN.']" \
    --output json >> "$STATE_FILE" 2>&1
  echo "" >> "$STATE_FILE"
fi

echo "✅ State documented in $STATE_FILE"

# Remove domain from Vercel
echo ""
echo "🔥 Removing domain from Vercel production..."
echo "⚠️  This will make $DOMAIN unreachable"
echo "⏳ Proceeding in 3 seconds... (Ctrl+C to cancel)"
sleep 3

vercel domains rm "$DOMAIN" --yes || echo "⚠️  Domain may not be configured or already removed"

echo ""
echo "✅ Production site taken down!"
echo ""
echo "📊 Status:"
echo "   ❌ https://$DOMAIN - UNREACHABLE"
echo "   ✅ Vercel project - STILL ACTIVE (dev deployments work)"
echo "   ✅ AWS resources - UNCHANGED"
echo ""
echo "🔄 To restore production:"
echo "   ./.dev/scripts/11_restore_production.sh"
echo ""
echo "💾 Current state saved in: $STATE_FILE"


