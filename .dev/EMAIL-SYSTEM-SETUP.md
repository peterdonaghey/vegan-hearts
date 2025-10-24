# 📧 Email Signup System - Complete Setup

**Date:** October 24, 2025  
**Status:** ✅ LIVE (Pending SES Verification)

---

## 🎯 What's Working

✅ **Email capture form** - Live on vegan-hearts.org  
✅ **DynamoDB storage** - All signups saved permanently  
✅ **SES integration** - Welcome emails configured  
⚠️ **SES verification** - Needs email verification (see below)

---

## 🏗️ Infrastructure Created

### 1. DynamoDB Table
**Name:** `vegan-hearts-email-signups`  
**Region:** us-east-1  
**Billing:** Pay per request (free tier)  
**Primary Key:** email (Hash) + timestamp (Range)

**Schema:**
```json
{
  "email": "user@example.com",
  "timestamp": 1729782000000,
  "signupDate": "2025-10-24T14:00:00.000Z",
  "source": "landing-page"
}
```

**View table:**
```bash
aws dynamodb scan \
  --profile peterdonaghey \
  --region us-east-1 \
  --table-name vegan-hearts-email-signups
```

### 2. AWS SES (Simple Email Service)
**Sender:** hello@vegan-hearts.org  
**Region:** us-east-1  
**Status:** Pending verification  
**Free tier:** 62,000 emails/month

**Check verification status:**
```bash
aws ses get-identity-verification-attributes \
  --profile peterdonaghey \
  --region us-east-1 \
  --identities hello@vegan-hearts.org
```

### 3. IAM User
**Name:** vegan-hearts-api  
**Permissions:**
- DynamoDB: PutItem, GetItem, Query, Scan on `vegan-hearts-email-signups`
- SES: SendEmail, SendRawEmail

**Access Keys:** Added to Vercel environment variables

---

## 🔧 Technical Implementation

### API Endpoint
**URL:** `https://vegan-hearts.org/api/subscribe`  
**Method:** POST  
**Body:** `{ "email": "user@example.com" }`

**Response (Success):**
```json
{
  "success": true,
  "message": "Thank you for subscribing!"
}
```

**Response (Error):**
```json
{
  "error": "Invalid email address"
}
```

### Frontend Component
**File:** `app/components/EmailSignupForm.tsx`  
**Features:**
- Client-side validation
- Loading states
- Success/error messages
- Disabled state while submitting

### Backend API
**File:** `app/api/subscribe/route.ts`  
**Features:**
- Email validation (regex)
- DynamoDB storage
- SES welcome email (HTML + text)
- Error handling
- Graceful SES failure (saves email even if SES fails)

---

## 🎨 Welcome Email Template

**Subject:** 🌱 Welcome to VeganHearts!

**Includes:**
- Beautiful HTML design
- VeganHearts branding (orange + green)
- Welcome message
- Preview of upcoming features
- Call-to-action button
- Plain text fallback

---

## ⚠️ Important: SES Verification Required

**Action needed:** Verify `hello@vegan-hearts.org` in AWS SES

**Steps:**
1. Check the inbox for `hello@vegan-hearts.org`
2. Click the verification link from AWS
3. Emails will start sending immediately after verification

**Current state:**
- Emails ARE being saved to DynamoDB ✅
- Welcome emails will fail until verified ⚠️
- No data loss - emails are captured

**Alternative:** Use a verified personal email temporarily:
```bash
# Edit the SES setup script and run:
bash .dev/scripts/07_setup_ses.sh
```

---

## 📊 Environment Variables (Vercel)

Already configured via CLI:

```bash
AWS_ACCESS_KEY_ID=AKIAXUPNBTZNKRZZEHRE
AWS_SECRET_ACCESS_KEY=[hidden]
AWS_REGION=us-east-1
```

**View all env vars:**
```bash
vercel env ls
```

---

## 💰 Cost Estimate

| Service | Free Tier | Expected Usage | Cost |
|---------|-----------|----------------|------|
| DynamoDB | 25GB storage, 25 RCU/WCU | < 1000 signups/month | $0 |
| SES | 62,000 emails/month | < 100 emails/month | $0 |
| **Total** | - | - | **$0/month** |

---

## 🔍 Testing the System

### Test the API directly:
```bash
curl -X POST https://vegan-hearts.org/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### View signups in DynamoDB:
```bash
aws dynamodb scan \
  --profile peterdonaghey \
  --region us-east-1 \
  --table-name vegan-hearts-email-signups \
  --query 'Items[].{Email:email.S,Date:signupDate.S}' \
  --output table
```

### Test email sending:
```bash
aws ses send-email \
  --profile peterdonaghey \
  --region us-east-1 \
  --from hello@vegan-hearts.org \
  --to your@email.com \
  --subject "Test Email" \
  --text "This is a test"
```

---

## 📝 All Infrastructure Scripts

Located in `.dev/scripts/`:

1. **`06_create_dynamodb_table.sh`** ✅ Executed
   - Creates DynamoDB table
   - Sets up billing mode
   - Adds tags

2. **`07_setup_ses.sh`** ✅ Executed
   - Verifies sender email
   - Configures SES region
   - Shows verification status

3. **`08_create_iam_user.sh`** ✅ Executed
   - Creates IAM user
   - Attaches policies
   - Generates access keys
   - Adds to Vercel

---

## 🚀 Future Enhancements

### Near-term
- [ ] Verify SES sender email
- [ ] Request SES production access (remove sandbox mode)
- [ ] Add double opt-in confirmation
- [ ] Email preferences page
- [ ] Unsubscribe functionality

### Future
- [ ] Segmented email lists
- [ ] Email automation sequences
- [ ] Newsletter scheduling
- [ ] Analytics dashboard
- [ ] A/B testing

---

## 🛠️ Troubleshooting

### Emails not being sent?
1. Check SES verification status
2. Verify environment variables in Vercel
3. Check AWS credentials permissions
4. Review CloudWatch logs (if available)

### DynamoDB errors?
1. Verify IAM permissions
2. Check table exists: `aws dynamodb list-tables --profile peterdonaghey`
3. Verify AWS credentials in Vercel

### Form not submitting?
1. Check browser console for errors
2. Verify API endpoint is accessible
3. Check Vercel deployment logs

---

## 💚 For the animals. For the planet. For each other.

*Email system ready to build our compassionate community!*

