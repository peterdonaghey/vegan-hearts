#!/bin/bash
# VeganHearts - GitHub Repository Creation
# Date: 2025-10-24
# Description: Creates GitHub repo under peterdonaghey org and pushes initial code

set -e

echo "🌱 Creating VeganHearts GitHub Repository..."

# Create repo under peterdonaghey account
gh repo create peterdonaghey/vegan-hearts \
  --public \
  --description "Building a compassionate world through vegan education, community, and advocacy" \
  --homepage "https://vegan-hearts.org"

echo "✅ Repository created!"

# Add remote (using HTTPS)
git remote add origin https://github.com/peterdonaghey/vegan-hearts.git

# Rename branch to main
git branch -M main

# Initial commit (if not already done)
if [ -z "$(git log --oneline 2>/dev/null)" ]; then
  git add -A
  git commit -m "Initial commit: VeganHearts landing page

- Next.js 15 with TypeScript
- Tailwind CSS with earth-tone palette
- Responsive landing page
- Email signup UI (backend pending)
- AWS deployment ready
- Domain: vegan-hearts.org"
fi

# Push to GitHub
git push -u origin main

echo "🚀 Code pushed to GitHub!"
echo "📍 Repository: https://github.com/peterdonaghey/vegan-hearts"

