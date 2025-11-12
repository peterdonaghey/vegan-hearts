# 🔧 VeganHearts Email Setup - Required Actions

**Date:** October 24, 2025  
**Current Status:** Email signups working ✅ | Welcome emails pending ⚠️

---

## 📊 What's Working Now

✅ **Website:** https://vegan-hearts.org  
✅ **Email signup form:** Saves to DynamoDB  
✅ **Your Gmail verified:** donagheypeter@googlemail.com can receive from SES  

---

## ⚠️ What Needs Setup

**Problem:** `hello@vegan-hearts.org` cannot send emails because:
1. No email inbox exists for this address
2. SES verification link was sent to hello@vegan-hearts.org (but no inbox to receive it)
3. Until verified, SES won't send FROM this address

---

## 🎯 Solution: Set Up Email for vegan-hearts.org Domain

### Option 1: AWS WorkMail (Recommended - Full CLI Access ✅)
Create a mailbox for hello@vegan-hearts.org with complete CLI email access.

**Setup Steps:**
```bash
# 1. Create WorkMail organization
aws workmail create-organization \
  --profile peterdonaghey \
  --region us-east-1 \
  --alias veganhearts

# 2. Get organization ID
ORG_ID=$(aws workmail list-organizations \
  --profile peterdonaghey \
  --region us-east-1 \
  --query 'OrganizationSummaries[0].OrganizationId' \
  --output text)

# 3. Register domain
aws workmail register-to-work-mail \
  --profile peterdonaghey \
  --region us-east-1 \
  --organization-id $ORG_ID \
  --domain-name vegan-hearts.org \
  --entity-id <ENTITY_ID>

# 4. Create user with mailbox
aws workmail create-user \
  --profile peterdonaghey \
  --region us-east-1 \
  --organization-id $ORG_ID \
  --name hello \
  --display-name "VeganHearts"

# 5. Set password for user
aws workmail reset-password \
  --profile peterdonaghey \
  --region us-east-1 \
  --organization-id $ORG_ID \
  --user-id <USER_ID> \
  --password <SECURE_PASSWORD>
```

**CLI Email Access (IMAP/SMTP):**
```bash
# WorkMail supports IMAP - use with CLI email clients like `mutt` or `alpine`

# IMAP settings:
# Server: imap.mail.us-east-1.awsapps.com
# Port: 993 (SSL)
# Username: hello@vegan-hearts.org
# Password: <your password>

# Example with mutt:
mutt -f imaps://hello@vegan-hearts.org@imap.mail.us-east-1.awsapps.com

# Example with fetchmail:
cat > ~/.fetchmailrc << 'EOF'
poll imap.mail.us-east-1.awsapps.com
protocol IMAP
user "hello@vegan-hearts.org"
password "<PASSWORD>"
ssl
EOF

# List messages via AWS CLI (using WorkMail Message Flow API):
aws workmailmessageflow get-raw-message-content \
  --profile peterdonaghey \
  --region us-east-1 \
  --message-id <MESSAGE_ID>
```

**Python CLI Script for Reading Emails:**
```python
import boto3
import email
from email import policy
from email.parser import BytesParser

# Connect via IMAP
import imaplib
mail = imaplib.IMAP4_SSL('imap.mail.us-east-1.awsapps.com')
mail.login('hello@vegan-hearts.org', 'PASSWORD')
mail.select('INBOX')

# Search and fetch
result, data = mail.search(None, 'ALL')
latest_email_id = data[0].split()[-1]
result, data = mail.fetch(latest_email_id, '(RFC822)')
raw_email = data[0][1]
msg = BytesParser(policy=policy.default).parsebytes(raw_email)
print(f"From: {msg['from']}")
print(f"Subject: {msg['subject']}")
print(msg.get_body(preferencelist=('plain')).get_content())
```

**Cost:** ~$4/user/month

### Option 2: Email Forwarding (Simpler, No Inbox)
Forward hello@vegan-hearts.org → donagheypeter@googlemail.com

**Using AWS SES Receiving:**
```bash
# 1. Create receipt rule set
aws ses create-receipt-rule-set \
  --profile peterdonaghey \
  --region us-east-1 \
  --rule-set-name vegan-hearts-rules

# 2. Set as active
aws ses set-active-receipt-rule-set \
  --profile peterdonaghey \
  --region us-east-1 \
  --rule-set-name vegan-hearts-rules

# 3. Add MX records to Route 53
# MX 10 inbound-smtp.us-east-1.amazonaws.com
```

**Cost:** Free (SES receiving is free)

### Option 3: Google Workspace / Gmail for Custom Domain
Set up Google Workspace for vegan-hearts.org (most user-friendly).

**Not CLI-based, but easiest to manage**

**Cost:** ~$6/user/month

---

## 📋 Immediate Next Steps

1. **Choose email solution** (WorkMail, SES forwarding, or Google Workspace)
2. **Set up inbox** for hello@vegan-hearts.org
3. **Check inbox** for AWS SES verification email
4. **Click verification link**
5. **Re-enable welcome emails** in code (remove the /* */ comments in `app/api/subscribe/route.ts`)
6. **Deploy:** `npm run deploy`

---

## 🔍 Check Current SES Status

```bash
# Check sender verification status
aws ses get-identity-verification-attributes \
  --profile peterdonaghey \
  --region us-east-1 \
  --identities hello@vegan-hearts.org

# Check recipient verification (your Gmail)
aws ses get-identity-verification-attributes \
  --profile peterdonaghey \
  --region us-east-1 \
  --identities donagheypeter@googlemail.com

# Check SES sandbox status
aws ses get-account-sending-enabled \
  --profile peterdonaghey \
  --region us-east-1
```

---

## 📝 Files Modified (Not Pushed to Git)

- `app/api/subscribe/route.ts` - Welcome emails temporarily disabled
- `app/api/test/route.ts` - Test endpoint (can be deleted)

---

## 💡 Recommended Approach

**✅ For CLI requirement:** Use Option 1 (WorkMail) - Full IMAP/CLI access  
**For quick setup:** Use Option 2 (Email Forwarding) - No CLI access  
**For ease of use:** Use Option 3 (Google Workspace) - Limited CLI access

Once email is set up and verified, all welcome emails will work automatically.

---

## 📧 CLI Email Tools Compatible with WorkMail

- **mutt** - Terminal email client
- **alpine** - Terminal email client  
- **fetchmail** - Retrieve emails via CLI
- **Python imaplib** - Programmatic email access
- **mbsync/isync** - Sync IMAP to local maildir
- **offlineimap** - Two-way IMAP sync

All work with WorkMail's IMAP endpoint: `imap.mail.us-east-1.awsapps.com:993`

---

## 🚀 Current Deployment

**Latest:** https://vegan-hearts.org  
**Deploy command:** `npm run deploy` (NO git push!)  
**Email signups:** Working and saving to DynamoDB  
**Welcome emails:** Will work once hello@vegan-hearts.org is verified  

---

**Questions? Everything is documented in `.dev/` folder.**

