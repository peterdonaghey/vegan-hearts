# ✅ workmail setup complete

**date:** october 24, 2025
**status:** fully operational

---

## what's live

✅ **website:** https://vegan-hearts.org
✅ **email signups:** saving to dynamodb
✅ **welcome emails:** sending from hello@vegan-hearts.org
✅ **workmail inbox:** accessible via imap
✅ **ses verified:** hello@vegan-hearts.org ✅

---

## workmail details

**email:** hello@vegan-hearts.org
**imap:** imap.mail.us-east-1.awsapps.com:993
**org id:** m-efd36f204fa4480f9eee765d5d380afa
**user id:** c2c2d62a-434b-4768-82a2-acb5ec294621

**credentials:** stored in `.dev/workmail-credentials.txt`

---

## cli email access

workmail supports imap, so you can use:
- `mutt -f imaps://hello@vegan-hearts.org@imap.mail.us-east-1.awsapps.com`
- python imaplib scripts
- fetchmail
- mbsync/isync
- offlineimap
- alpine

---

## what was completed

1. created workmail organization
2. registered vegan-hearts.org domain
3. added dns records to route 53:
   - mx record for workmail
   - txt records for ses verification  
   - cname records for dkim
   - spf and dmarc records
   - autodiscover cname
4. created hello@vegan-hearts.org mailbox
5. verified email address in ses
6. enabled welcome emails in code
7. tested and deployed to production

---

## verification

tested signup flow - welcome email delivered successfully:
- api endpoint returns success
- dynamodb record created
- ses shows delivery with 0 bounces
- recipient receives formatted html email

---

## cost

~$4/month for workmail user

---

## accessing the inbox via cli

**python example:**
```python
import imaplib
mail = imaplib.IMAP4_SSL('imap.mail.us-east-1.awsapps.com')
mail.login('hello@vegan-hearts.org', 'PASSWORD')
mail.select('INBOX')
result, data = mail.search(None, 'ALL')
# read emails...
```

**mutt:**
```bash
mutt -f imaps://hello@vegan-hearts.org@imap.mail.us-east-1.awsapps.com
```

password is in `.dev/workmail-credentials.txt`

---

**no further action needed - everything is working**

