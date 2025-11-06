#!/bin/bash

# VeganHearts Email Forwarding Setup
# Pure SES + Lambda solution - 100% CLI, no console needed
# Sets up email forwarding from vegan-hearts.org addresses to your personal email

set -e

PROFILE="peterdonaghey"
REGION="us-east-1"
DOMAIN="vegan-hearts.org"
BUCKET_NAME="vegan-hearts-email-storage"
HOSTED_ZONE_ID="Z07021562WUGHHTUXDBG"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

if [ -z "$1" ]; then
    print_error "Usage: $0 <forward-to-email> [<source-email>]"
    echo ""
    echo "Examples:"
    echo "  # Forward education@ to your email:"
    echo "  $0 donagheypeter@googlemail.com education@vegan-hearts.org"
    echo ""
    echo "  # Forward ALL @vegan-hearts.org emails:"
    echo "  $0 donagheypeter@googlemail.com"
    exit 1
fi

FORWARD_TO="$1"
SOURCE="${2:-*@$DOMAIN}"
ACCOUNT_ID=$(aws sts get-caller-identity --profile $PROFILE --query Account --output text)

echo "================================================"
echo "VeganHearts Email Forwarding"
echo "================================================"
echo "From: $SOURCE"
echo "To: $FORWARD_TO"
echo "AWS Account: $ACCOUNT_ID"
echo "================================================"
echo ""

# Verify recipient email
print_status "Verifying $FORWARD_TO..."
STATUS=$(aws ses get-identity-verification-attributes \
    --profile $PROFILE \
    --region $REGION \
    --identities "$FORWARD_TO" \
    --query "VerificationAttributes.\"$FORWARD_TO\".VerificationStatus" \
    --output text 2>/dev/null || echo "NotFound")

if [ "$STATUS" != "Success" ]; then
    print_warning "Sending verification email to $FORWARD_TO..."
    aws ses verify-email-identity \
        --profile $PROFILE \
        --region $REGION \
        --email-address "$FORWARD_TO"
    echo ""
    print_warning "CHECK YOUR EMAIL: $FORWARD_TO"
    echo "Click verification link, then press Enter..."
    read -r
fi
print_status "Email verified"

# Create S3 bucket
print_status "Setting up S3 bucket..."
if ! aws s3 ls "s3://$BUCKET_NAME" --profile $PROFILE 2>/dev/null; then
    aws s3 mb "s3://$BUCKET_NAME" --profile $PROFILE --region $REGION
fi

cat > /tmp/bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowSESPuts",
    "Effect": "Allow",
    "Principal": {"Service": "ses.amazonaws.com"},
    "Action": "s3:PutObject",
    "Resource": "arn:aws:s3:::$BUCKET_NAME/*",
    "Condition": {"StringEquals": {"AWS:SourceAccount": "$ACCOUNT_ID"}}
  }]
}
EOF

aws s3api put-bucket-policy --profile $PROFILE --bucket $BUCKET_NAME --policy file:///tmp/bucket-policy.json
print_status "S3 configured"

# Create IAM role
print_status "Creating IAM role..."
ROLE_NAME="EmailForwarderRole"

cat > /tmp/trust.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

if ! aws iam get-role --profile $PROFILE --role-name $ROLE_NAME 2>/dev/null; then
    aws iam create-role --profile $PROFILE --role-name $ROLE_NAME --assume-role-policy-document file:///tmp/trust.json
    aws iam attach-role-policy --profile $PROFILE --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    aws iam attach-role-policy --profile $PROFILE --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/AmazonSESFullAccess
    aws iam attach-role-policy --profile $PROFILE --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
    sleep 10
fi
print_status "IAM role ready"

# Create Lambda
print_status "Deploying Lambda function..."
cat > /tmp/index.mjs << 'EOF'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const s3 = new S3Client();
const ses = new SESClient();

// Simple email body extractor
function extractBody(rawEmail) {
    const parts = rawEmail.split(/\r?\n\r?\n/);
    if (parts.length < 2) return rawEmail;
    const body = parts.slice(1).join('\n\n');
    return body
        .replace(/=\r?\n/g, '')
        .replace(/=[0-9A-F]{2}/g, (match) => String.fromCharCode(parseInt(match.substring(1), 16)))
        .trim();
}

export const handler = async (event) => {
    const record = event.Records[0];
    const messageId = record.ses.mail.messageId;
    const bucket = process.env.BUCKET;
    const forwardTo = process.env.FORWARD_TO;
    
    try {
        const data = await s3.send(new GetObjectCommand({
            Bucket: bucket,
            Key: `emails/${messageId}`
        }));
        
        const rawEmail = await data.Body.transformToString();
        const subject = record.ses.mail.commonHeaders.subject || '(no subject)';
        const fromList = record.ses.mail.commonHeaders.from || ['unknown'];
        const from = fromList[0];
        const fromEmail = from.match(/<(.+)>/) ? from.match(/<(.+)>/)[1] : from;
        const messageBody = extractBody(rawEmail);
        
        const cleanBody = `From: ${from}
Subject: ${subject}

────────────────────────────────

${messageBody}`;

        await ses.send(new SendEmailCommand({
            Source: `education@${process.env.DOMAIN}`,
            Destination: { ToAddresses: [forwardTo] },
            ReplyToAddresses: [fromEmail],
            Message: {
                Subject: { Data: subject },
                Body: { Text: { Data: cleanBody } }
            }
        }));
        
        console.log(`Forwarded email from ${from} to ${forwardTo}`);
        return { statusCode: 200 };
    } catch (error) {
        console.error('Forwarding error:', error);
        throw error;
    }
};
EOF

cd /tmp && zip -q lambda.zip index.mjs

LAMBDA_NAME="VeganHeartsForwarder"
ROLE_ARN="arn:aws:iam::$ACCOUNT_ID:role/$ROLE_NAME"

if aws lambda get-function --profile $PROFILE --region $REGION --function-name $LAMBDA_NAME 2>/dev/null; then
    aws lambda update-function-code --profile $PROFILE --region $REGION --function-name $LAMBDA_NAME --zip-file fileb:///tmp/lambda.zip
    aws lambda update-function-configuration --profile $PROFILE --region $REGION --function-name $LAMBDA_NAME \
        --environment "Variables={FORWARD_TO=$FORWARD_TO,BUCKET=$BUCKET_NAME,DOMAIN=$DOMAIN}"
else
    aws lambda create-function --profile $PROFILE --region $REGION --function-name $LAMBDA_NAME --runtime nodejs18.x \
        --role $ROLE_ARN --handler index.handler --zip-file fileb:///tmp/lambda.zip --timeout 30 \
        --environment "Variables={FORWARD_TO=$FORWARD_TO,BUCKET=$BUCKET_NAME,DOMAIN=$DOMAIN}"
    sleep 5
fi

aws lambda add-permission --profile $PROFILE --region $REGION --function-name $LAMBDA_NAME \
    --statement-id ses --action lambda:InvokeFunction --principal ses.amazonaws.com \
    --source-account $ACCOUNT_ID 2>/dev/null || true
print_status "Lambda deployed"

# Create SES receipt rule
print_status "Creating SES receipt rule..."
RULE_SET="email-forwarding"
RULE_NAME="forward-all"
LAMBDA_ARN="arn:aws:lambda:$REGION:$ACCOUNT_ID:function:$LAMBDA_NAME"

if ! aws ses describe-receipt-rule-set --profile $PROFILE --region $REGION --rule-set-name $RULE_SET 2>/dev/null; then
    aws ses create-receipt-rule-set --profile $PROFILE --region $REGION --rule-set-name $RULE_SET
fi

aws ses delete-receipt-rule --profile $PROFILE --region $REGION --rule-set-name $RULE_SET --rule-name $RULE_NAME 2>/dev/null || true

cat > /tmp/rule.json << EOF
{
  "Name": "$RULE_NAME",
  "Enabled": true,
  "TlsPolicy": "Optional",
  "Recipients": ["$SOURCE"],
  "Actions": [
    {"S3Action": {"BucketName": "$BUCKET_NAME", "ObjectKeyPrefix": "emails/"}},
    {"LambdaAction": {"FunctionArn": "$LAMBDA_ARN", "InvocationType": "Event"}}
  ],
  "ScanEnabled": true
}
EOF

aws ses create-receipt-rule --profile $PROFILE --region $REGION --rule-set-name $RULE_SET --rule file:///tmp/rule.json
aws ses set-active-receipt-rule-set --profile $PROFILE --region $REGION --rule-set-name $RULE_SET
print_status "Receipt rule active"

# Configure MX records
print_status "Updating MX records..."
cat > /tmp/mx.json << EOF
{
  "Changes": [{
    "Action": "UPSERT",
    "ResourceRecordSet": {
      "Name": "$DOMAIN",
      "Type": "MX",
      "TTL": 300,
      "ResourceRecords": [{"Value": "10 inbound-smtp.$REGION.amazonaws.com"}]
    }
  }]
}
EOF

aws route53 change-resource-record-sets --profile $PROFILE --hosted-zone-id $HOSTED_ZONE_ID --change-batch file:///tmp/mx.json
print_status "MX records updated"

rm -f /tmp/*.json /tmp/index.js /tmp/lambda.zip

echo ""
echo "================================================"
echo -e "${GREEN}✓ EMAIL FORWARDING LIVE!${NC}"
echo "================================================"
echo ""
echo "$SOURCE → $FORWARD_TO"
echo ""
echo "Test: Send email to education@vegan-hearts.org"
echo ""
echo "Update forward address:"
echo "  $0 <new-email> $SOURCE"
echo ""
echo "================================================"
image.png