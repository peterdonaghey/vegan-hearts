# VeganHearts Deployment Guide

**Date:** October 24, 2025  
**Target:** AWS (Route 53 + Amplify)

---

## Prerequisites

✅ AWS CLI installed and configured  
✅ Git repository initialized  
✅ Next.js app built and tested locally  
✅ Node.js 22+ via nvm

---

## Step 1: Domain Registration (Manual - Costs ~$12/year)

### Check Domain Availability
```bash
aws route53domains check-domain-availability \
  --profile peterdonaghey \
  --domain-name vegan-hearts.org \
  --region us-east-1
```

### Register Domain

**⚠️ WARNING: This command will charge your AWS account ~$12/year**

First, create a contact information file:

```bash
cat > /tmp/domain-contact.json << 'EOF'
{
  "FirstName": "YOUR_FIRST_NAME",
  "LastName": "YOUR_LAST_NAME",
  "ContactType": "PERSON",
  "OrganizationName": "VeganHearts",
  "AddressLine1": "YOUR_ADDRESS",
  "City": "YOUR_CITY",
  "State": "YOUR_STATE",
  "CountryCode": "YOUR_COUNTRY_CODE",
  "ZipCode": "YOUR_ZIP",
  "PhoneNumber": "+YOUR_PHONE_NUMBER",
  "Email": "YOUR_EMAIL"
}
EOF
```

Then register:

```bash
aws route53domains register-domain \
  --profile peterdonaghey \
  --region us-east-1 \
  --domain-name vegan-hearts.org \
  --duration-in-years 1 \
  --admin-contact file:///tmp/domain-contact.json \
  --registrant-contact file:///tmp/domain-contact.json \
  --tech-contact file:///tmp/domain-contact.json \
  --privacy-protect-admin-contact \
  --privacy-protect-registrant-contact \
  --privacy-protect-tech-contact \
  --auto-renew
```

### Check Registration Status
```bash
aws route53domains get-domain-detail \
  --profile peterdonaghey \
  --domain-name vegan-hearts.org \
  --region us-east-1
```

---

## Step 2: Create GitHub Repository (Required for Amplify)

```bash
# On GitHub, create a new repository: vegan-hearts

# Then locally:
git remote add origin git@github.com:YOUR_USERNAME/vegan-hearts.git
git branch -M main
git commit -m "Initial commit: VeganHearts landing page"
git push -u origin main
```

---

## Step 3: Deploy to AWS Amplify

### Option A: Using AWS Console (Recommended for First Time)

1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
2. Click "New app" → "Host web app"
3. Select "GitHub" as source
4. Authorize AWS Amplify to access your GitHub
5. Select repository: `vegan-hearts`
6. Select branch: `main`
7. Amplify will auto-detect Next.js settings
8. Review and click "Save and deploy"

### Option B: Using AWS CLI

```bash
# Create Amplify app
aws amplify create-app \
  --profile peterdonaghey \
  --name vegan-hearts \
  --repository https://github.com/YOUR_USERNAME/vegan-hearts \
  --platform WEB \
  --oauth-token YOUR_GITHUB_TOKEN \
  --region us-east-1

# Create branch connection
aws amplify create-branch \
  --profile peterdonaghey \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --region us-east-1

# Start deployment
aws amplify start-job \
  --profile peterdonaghey \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --region us-east-1
```

---

## Step 4: Connect Custom Domain

### In Amplify Console

1. Go to your Amplify app
2. Click "Domain management"
3. Click "Add domain"
4. Enter: `vegan-hearts.org`
5. Amplify will automatically configure Route 53 DNS
6. Wait for SSL certificate provisioning (~15 minutes)

### Using CLI

```bash
aws amplify create-domain-association \
  --profile peterdonaghey \
  --app-id YOUR_APP_ID \
  --domain-name vegan-hearts.org \
  --sub-domain-settings prefix=,branchName=main \
  --region us-east-1
```

---

## Step 5: Configure Environment Variables (Future)

When you add backend functionality:

```bash
aws amplify update-app \
  --profile peterdonaghey \
  --app-id YOUR_APP_ID \
  --environment-variables \
    NEXT_PUBLIC_AWS_REGION=us-east-1 \
    AWS_SES_FROM_EMAIL=hello@vegan-hearts.org \
  --region us-east-1
```

---

## Step 6: Set Up Automated Deployments

Amplify automatically deploys on every push to `main` branch.

### Build Settings (Auto-detected)

Amplify will use this configuration:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm use 22
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## Step 7: Verify Deployment

### Check Deployment Status
```bash
aws amplify list-apps --profile peterdonaghey --region us-east-1
```

### Test URLs
- **Amplify Default:** `https://main.YOUR_APP_ID.amplifyapp.com`
- **Custom Domain:** `https://vegan-hearts.org` (after DNS propagation)

### DNS Propagation Check
```bash
dig vegan-hearts.org
nslookup vegan-hearts.org
```

---

## Monitoring & Maintenance

### View Deployment Logs
```bash
aws amplify list-jobs \
  --profile peterdonaghey \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --region us-east-1
```

### Redeploy Manually
```bash
aws amplify start-job \
  --profile peterdonaghey \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --region us-east-1
```

---

## Cost Breakdown

### Monthly Costs
- **Route 53 Domain:** $1/month (after initial $12/year registration)
- **Route 53 Hosted Zone:** $0.50/month
- **Amplify Hosting:** Free tier covers up to 5GB storage + 15GB served/month
- **Amplify Build Minutes:** Free tier covers 1000 build minutes/month

**Total: ~$1.50/month** (well within free tier limits for Phase 1)

---

## Rollback Procedure

If deployment fails or introduces bugs:

### Via Console
1. Go to Amplify app
2. Click on "Deployments"
3. Find previous working deployment
4. Click "Redeploy this version"

### Via CLI
```bash
# List previous jobs
aws amplify list-jobs --profile peterdonaghey --app-id YOUR_APP_ID --branch-name main --region us-east-1

# Redeploy specific commit
aws amplify start-job \
  --profile peterdonaghey \
  --app-id YOUR_APP_ID \
  --branch-name main \
  --job-type RELEASE \
  --commit-id PREVIOUS_COMMIT_SHA \
  --region us-east-1
```

---

## Troubleshooting

### Build Fails
- Check build logs in Amplify console
- Verify Node version in build settings
- Ensure all dependencies are in `package.json`

### Domain Not Resolving
- Wait 24-48 hours for DNS propagation
- Check Route 53 hosted zone has correct NS records
- Verify domain is not locked

### SSL Certificate Issues
- Wait up to 1 hour for certificate provisioning
- Ensure domain ownership verification is complete
- Check AWS Certificate Manager for status

---

## Next Steps After Deployment

1. ✅ Verify site loads at https://vegan-hearts.org
2. 📧 Set up AWS SES for email functionality
3. 🗄️ Create DynamoDB table for email signups
4. 📊 Add analytics (Plausible or similar)
5. 🔒 Configure WAF rules for security
6. 📱 Test on mobile devices
7. ♿ Run accessibility audit
8. 🚀 Announce launch to Vegan Hearts team!

---

*For issues or questions, refer to AWS Amplify documentation or contact Peter.*

