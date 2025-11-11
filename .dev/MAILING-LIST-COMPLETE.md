# ✅ mailing list system complete

**date:** october 24, 2025
**status:** fully operational & compliant

---

## what you have now

✅ **proper mailing list:** aws ses contact list (`veganhearts-subscribers`)
✅ **subscribe flow:** saves to dynamodb + adds to contact list + sends welcome email
✅ **unsubscribe system:** one-click removal with branded confirmation page
✅ **compliance:** can-spam/gdpr compliant with unsubscribe in all emails
✅ **email branding:** logo, brand colors (#346c39 green, #f0822a orange)

---

## how subscribers work

**when someone signs up:**
1. email saved to dynamodb table
2. added to ses contact list `veganhearts-subscribers`
3. welcome email sent with unsubscribe link

**when someone unsubscribes:**
1. removed from ses contact list
2. marked as unsubscribed in dynamodb
3. branded confirmation page shown

---

## checking your mailing list

**count subscribers:**
```bash
aws sesv2 list-contacts \
  --profile peterdonaghey \
  --region us-east-1 \
  --contact-list-name veganhearts-subscribers \
  --query 'Contacts | length(@)'
```

**list all subscribers:**
```bash
aws sesv2 list-contacts \
  --profile peterdonaghey \
  --region us-east-1 \
  --contact-list-name veganhearts-subscribers
```

---

## sending to your list

when you're ready to send newsletters/updates:

```bash
# send to entire list
aws sesv2 send-email \
  --profile peterdonaghey \
  --region us-east-1 \
  --from-email-address hello@vegan-hearts.org \
  --list-management-options ContactListName=veganhearts-subscribers \
  --content \
    'Subject={Data="Your Subject"},
     Body={
       Html={Data="<html>...</html>"},
       Text={Data="Plain text..."}
     }'
```

the contact list automatically:
- handles unsubscribes
- tracks who's subscribed
- ensures compliance

---

## endpoints

**subscribe:** https://vegan-hearts.org (form on homepage)
**unsubscribe:** https://vegan-hearts.org/api/unsubscribe?email={email}

---

## email template

welcome email includes:
- veganhearts logo
- brand colors
- course info
- unsubscribe link
- looks professional

---

## testing

tested & verified:
- ✅ subscribe adds to contact list
- ✅ welcome email delivers
- ✅ unsubscribe link works
- ✅ removal from contact list
- ✅ dynamodb tracking
- ✅ branded pages

---

## permissions

added to iam user `vegan-hearts-api`:
- ses:CreateContact
- ses:DeleteContact  
- ses:GetContact
- ses:ListContacts
- ses:CreateContactList
- ses:GetContactList
- ses:ListContactLists

---

## what's deployed

- ✅ https://vegan-hearts.org
- ✅ email signup working
- ✅ welcome emails sending
- ✅ unsubscribe working
- ✅ workmail inbox active
- ✅ cli email access ready

---

## next steps

**you're ready to:**
1. collect signups (already happening)
2. send newsletters to your list
3. manage subscribers via aws cli
4. check workmail inbox via cli

**when sending future emails:**
- always use the contact list
- include unsubscribe link (automatic with contact list)
- use hello@vegan-hearts.org as sender

---

**everything is working and compliant. you have a proper mailing list now.**





