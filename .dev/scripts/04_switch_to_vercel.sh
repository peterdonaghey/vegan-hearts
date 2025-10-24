#!/bin/bash
# VeganHearts - Switch to Vercel
# Date: 2025-10-24
# Description: Deploy to Vercel (10x faster than Amplify)

set -e

echo "🚀 Switching VeganHearts to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (will open browser if not logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Deploy to production
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo ""
echo "✅ Deployed to Vercel!"
echo ""
echo "🌐 Next step: Add custom domain"
echo "Run this command:"
echo "  vercel domains add vegan-hearts.org"
echo ""
echo "📊 Check deployment:"
echo "  vercel ls"
echo ""
echo "🔄 Future deploys:"
echo "  Just push to GitHub - Vercel auto-deploys!"
echo "  Or run: vercel --prod"
echo ""
echo "⚡ Vercel deploys in 10-20 seconds vs Amplify's 2-3 minutes"

