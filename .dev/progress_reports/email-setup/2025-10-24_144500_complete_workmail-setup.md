# workmail setup - complete

**date:** 2025-10-24 14:45
**status:** ✅ complete

## what was done

**workmail created**
- org id: m-efd36f204fa4480f9eee765d5d380afa
- email: hello@vegan-hearts.org
- user id: c2c2d62a-434b-4768-82a2-acb5ec294621
- imap: imap.mail.us-east-1.awsapps.com:993

**dns records added to route 53**
- mx record for workmail
- txt records for ses verification
- cname records for dkim
- spf and dmarc records
- autodiscover cname for workmail

**ses verification**
- hello@vegan-hearts.org verified ✅
- verification email received in workmail inbox
- clicked verification link programmatically

**code updated**
- uncommented welcome email code in `app/api/subscribe/route.ts`
- deployed to production

**tested**
- test signup sent to production
- welcome email delivered successfully
- ses stats show delivery attempts with 0 bounces

## credentials

stored in `.dev/workmail-credentials.txt` (gitignored)
- email: hello@vegan-hearts.org
- password: [generated]
- imap server: imap.mail.us-east-1.awsapps.com:993

## cli access

can access email via:
- mutt
- alpine
- python imaplib
- fetchmail
- mbsync/isync
- offlineimap

## what's working

✅ website live at https://vegan-hearts.org
✅ email signups save to dynamodb
✅ welcome emails send from hello@vegan-hearts.org
✅ workmail inbox accessible via imap
✅ full cli email access available

## cost

~$4/month for workmail user

## next steps

none - everything is working






