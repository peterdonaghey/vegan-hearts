# Next Steps to Deploy VeganHearts

## Right Now (After Meeting - 20 minutes)

### Step 1: Register Domain (5 min)

Create contact file with your info:
```bash
cat > /tmp/domain-contact.json << 'EOF'
{
  "FirstName": "Peter",
  "LastName": "Donaghey",
  "ContactType": "PERSON",
  "OrganizationName": "VeganHearts",
  "AddressLine1": "YOUR_ADDRESS",
  "City": "YOUR_CITY",
  "State": "YOUR_STATE",
  "CountryCode": "US",
  "ZipCode": "YOUR_ZIP",
  "PhoneNumber": "+1234567890",
  "Email": "your@email.com"
}
EOF
```

Register domain (~$12):
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

### Step 2: Create GitHub Repo (2 min)

1. Go to github.com/new
2. Name: `vegan-hearts`
3. Public/Private (your choice)
4. Don't initialize with README

Then locally:
```bash
cd /Users/peterdonaghey/Projects/vegan-hearts
git remote add origin git@github.com:YOUR_USERNAME/vegan-hearts.git
git branch -M main
git commit -m "Initial commit: VeganHearts landing page"
git push -u origin main
```

### Step 3: Deploy to Amplify (10 min)

**Via AWS Console (easiest):**

1. Go to: https://console.aws.amazon.com/amplify/
2. Click "New app" → "Host web app"
3. Select "GitHub"
4. Authorize AWS Amplify
5. Select repo: `vegan-hearts`
6. Branch: `main`
7. Click "Save and deploy"
8. Wait ~5 minutes for first deploy

### Step 4: Connect Domain (5 min)

In Amplify Console:
1. Go to "Domain management"
2. Click "Add domain"
3. Enter: `vegan-hearts.org`
4. Click "Configure domain"
5. Amplify handles DNS automatically
6. Wait ~15 min for SSL certificate

**Done!** Site live at https://vegan-hearts.org

---

## Tomorrow (Email Backend - 1 hour)

### DynamoDB Table
```bash
aws dynamodb create-table \
  --profile peterdonaghey \
  --table-name vegan-hearts-emails \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --key-schema AttributeName=email,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### SES Setup
```bash
# Verify domain
aws ses verify-domain-identity \
  --profile peterdonaghey \
  --domain vegan-hearts.org \
  --region us-east-1

# Add DNS records (Amplify will guide you)
```

### API Route
Create `app/api/subscribe/route.ts` - I can help with this!

---

## This Week (Nice to Have)

- [ ] Add analytics (Plausible/Fathom)
- [ ] Set up email templates
- [ ] Add 404 page
- [ ] Social media meta tags
- [ ] Favicon and app icons
- [ ] Google Search Console

---

## Questions?

Check `.dev/docs/deployment-guide.md` or ping me!

