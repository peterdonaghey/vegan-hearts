# mailing list + unsubscribe - complete

**date:** 2025-10-24 16:03
**status:** ✅ complete

## what was built

**ses contact list**
- created `veganhearts-subscribers` contact list
- proper mailing list management via aws ses v2
- can-spam/gdpr compliant

**unsubscribe functionality**
- endpoint: `/api/unsubscribe?email={email}`
- removes from ses contact list
- marks as unsubscribed in dynamodb
- nice branded unsubscribe page

**updated subscribe flow**
- saves to dynamodb
- adds to ses contact list
- sends welcome email with unsubscribe link
- handles duplicate signups gracefully

**iam permissions added**
- ses contact list management
- create/delete/get contacts
- policy: `SESContactListManagement`

## testing results

✅ subscribe → contact added to list
✅ welcome email includes unsubscribe link
✅ unsubscribe → contact removed from list
✅ unsubscribe → marked in dynamodb
✅ branded unsubscribe confirmation page

## files created/modified

**new:**
- `app/api/unsubscribe/route.ts` - unsubscribe endpoint
- iam policy for ses contact list permissions

**modified:**
- `app/api/subscribe/route.ts` - adds to contact list
- welcome email template - includes unsubscribe link
- `package.json` - added @aws-sdk/client-sesv2

## how it works

**subscribe:**
1. user submits email
2. saved to dynamodb (unsubscribed: false)
3. added to ses contact list
4. welcome email sent with unsubscribe link

**unsubscribe:**
1. user clicks unsubscribe link in email
2. removed from ses contact list
3. all dynamodb entries marked unsubscribed
4. branded confirmation page shown

## ses contact list

- name: `veganhearts-subscribers`
- region: us-east-1
- manages all subscribers
- source of truth for mailings

## future mailings

when sending future emails:
```bash
# use sesv2 send email with contact list
aws sesv2 send-email \
  --from-email-address hello@vegan-hearts.org \
  --list-management-options ContactListName=veganhearts-subscribers \
  --content '...'
```

contact list automatically handles unsubscribes

## compliance

✅ unsubscribe link in all emails
✅ one-click unsubscribe
✅ branded confirmation
✅ permanent removal from list
✅ can-spam compliant
✅ gdpr ready

## deployment

deployed to: https://vegan-hearts.org
all tests passing






