# Email Forwarding Setup

## Quick Start

Forward emails from `education@vegan-hearts.org` to your personal email:

```bash
.dev/scripts/setup-email-forwarding.sh donagheypeter@googlemail.com education@vegan-hearts.org
```

## How It Works

The script sets up a complete SES-based email forwarding system:

1. **Verifies recipient** - Sends AWS SES verification email
2. **Creates S3 bucket** - Stores raw emails temporarily
3. **Deploys Lambda** - Forwards emails to your address
4. **Creates SES rule** - Routes incoming emails to Lambda
5. **Updates MX records** - Points domain to AWS SES

## Architecture

```
Email → vegan-hearts.org MX → SES → S3 → Lambda → Forward to your email
```

## Updating Forwarding Address

Simply run the script again with the new email:

```bash
.dev/scripts/setup-email-forwarding.sh newemail@example.com education@vegan-hearts.org
```

The Lambda function will be updated with the new forwarding address.

## Forward Multiple Addresses

Run the script multiple times with different source emails:

```bash
# Forward education@
.dev/scripts/setup-email-forwarding.sh peter@example.com education@vegan-hearts.org

# Forward hello@ (updates existing Lambda)
.dev/scripts/setup-email-forwarding.sh peter@example.com hello@vegan-hearts.org
```

## Forward ALL Emails

Omit the source email to forward everything:

```bash
.dev/scripts/setup-email-forwarding.sh peter@example.com
```

This creates a catch-all that forwards all `@vegan-hearts.org` emails to your address.

## Requirements

- AWS CLI configured with `--profile peterdonaghey`
- Access to email account for SES verification
- Permissions to create: Lambda, IAM roles, S3 buckets, SES rules, Route53 records

## Resources Created

| Resource | Name | Purpose |
|----------|------|---------|
| S3 Bucket | `vegan-hearts-email-storage` | Temporary email storage |
| Lambda | `VeganHeartsForwarder` | Email forwarding logic |
| IAM Role | `EmailForwarderRole` | Lambda execution permissions |
| SES Rule Set | `email-forwarding` | Email routing configuration |
| SES Receipt Rule | `forward-all` | Matches incoming emails |
| Route53 MX | `vegan-hearts.org` | Points to SES inbound SMTP |

## Troubleshooting

### "Email not verified"

Check your inbox (the forward-to email) for an AWS verification email. Click the link, then press Enter in the script.

### "MX records not working"

DNS propagation can take up to 48 hours. Check with:

```bash
dig MX vegan-hearts.org
```

Should show: `10 inbound-smtp.us-east-1.amazonaws.com`

### "Emails not being forwarded"

Check Lambda logs:

```bash
aws logs tail /aws/lambda/VeganHeartsForwarder --profile peterdonaghey --follow
```

### "Permission denied"

Ensure you're using the correct AWS profile:

```bash
aws sts get-caller-identity --profile peterdonaghey
```

## Manual Cleanup

To remove all forwarding infrastructure:

```bash
# Delete SES rule
aws ses delete-receipt-rule \
  --profile peterdonaghey \
  --region us-east-1 \
  --rule-set-name email-forwarding \
  --rule-name forward-all

# Delete Lambda
aws lambda delete-function \
  --profile peterdonaghey \
  --region us-east-1 \
  --function-name VeganHeartsForwarder

# Delete S3 bucket (must be empty first)
aws s3 rb s3://vegan-hearts-email-storage --profile peterdonaghey --force

# Delete IAM role
aws iam detach-role-policy --profile peterdonaghey --role-name EmailForwarderRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam detach-role-policy --profile peterdonaghey --role-name EmailForwarderRole --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess
aws iam detach-role-policy --profile peterdonaghey --role-name EmailForwarderRole --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
aws iam delete-role --profile peterdonaghey --role-name EmailForwarderRole
```

## Cost

- **SES:** First 1,000 emails/month free, then $0.10 per 1,000 emails
- **Lambda:** First 1M requests free, then $0.20 per 1M requests
- **S3:** First 5GB free, then $0.023/GB/month
- **Route53 MX records:** $0.50/month per hosted zone (already included)

**Expected monthly cost for low volume:** ~$0-1

## Security Notes

- Emails are stored in S3 with the `emails/` prefix
- Lambda has read-only S3 access and full SES access
- SES scans all incoming emails for spam/viruses
- TLS is optional for incoming emails (can be set to Required)
- Consider adding S3 lifecycle rules to auto-delete old emails after 30 days

## Next Steps

1. Run the script to set up forwarding
2. Send a test email to `education@vegan-hearts.org`
3. Check your personal email inbox
4. Configure additional aliases as needed

