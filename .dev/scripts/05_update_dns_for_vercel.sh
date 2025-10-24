#!/bin/bash
# VeganHearts - Update Route 53 DNS to point to Vercel
# Date: 2025-10-24
# Description: Update DNS records to point vegan-hearts.org to Vercel

set -e

echo "🌐 Updating Route 53 DNS to point to Vercel..."

# Get the hosted zone ID
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name \
  --profile peterdonaghey \
  --dns-name vegan-hearts.org \
  --query 'HostedZones[0].Id' \
  --output text | cut -d'/' -f3)

echo "📍 Hosted Zone ID: $HOSTED_ZONE_ID"

# Create change batch to update A record to Vercel's IP
cat > /tmp/vercel-dns-change.json << 'EOF'
{
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "vegan-hearts.org",
        "Type": "A",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "76.76.21.21"
          }
        ]
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "www.vegan-hearts.org",
        "Type": "CNAME",
        "TTL": 300,
        "ResourceRecords": [
          {
            "Value": "cname.vercel-dns.com"
          }
        ]
      }
    }
  ]
}
EOF

# Apply the DNS changes
aws route53 change-resource-record-sets \
  --profile peterdonaghey \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --change-batch file:///tmp/vercel-dns-change.json

echo ""
echo "✅ DNS updated to point to Vercel!"
echo "🔄 DNS propagation can take 1-5 minutes"
echo ""
echo "🌐 Your site will be live at:"
echo "   https://vegan-hearts.org"
echo ""
echo "⚡ Future deploys: npm run deploy (10-20 seconds!)"

