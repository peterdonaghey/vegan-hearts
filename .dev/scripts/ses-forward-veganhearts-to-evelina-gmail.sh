#!/usr/bin/env bash
# Deploy / update VeganHeartsForwarder + prepend SES rule on INBOUND_MAIL so
# hello@veganhearts.org and education@veganhearts.org forward to Evelina's Gmail
# (S3 + Lambda, non-terminating) then existing WorkMail rule still runs.
#
# Usage:
#   ./.dev/scripts/ses-forward-veganhearts-to-evelina-gmail.sh
#
set -euo pipefail

PROFILE="${AWS_PROFILE:-peterdonaghey}"
REGION="${AWS_REGION:-us-east-1}"
FORWARD_TO="${FORWARD_TO:-veganhearts2024@gmail.com}"
BUCKET="${S3_EMAIL_BUCKET:-vegan-hearts-email-storage}"
LAMBDA_NAME="VeganHeartsForwarder"
RULE_SET="INBOUND_MAIL"
RULE_NAME="forward-vh-evelina-gmail"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LAM_DIR="$ROOT/.dev/lambda/email-forwarder"
ZIP="$ROOT/.dev/generated/veganhearts-org-mail/forwarder-lambda.zip"
LOG_DIR="$(dirname "$ZIP")"
mkdir -p "$LOG_DIR"

AWS=(aws --profile "$PROFILE" --region "$REGION")
ACCOUNT_ID=$("${AWS[@]}" sts get-caller-identity --query Account --output text)
LAM_ARN="arn:aws:lambda:${REGION}:${ACCOUNT_ID}:function:${LAMBDA_NAME}"

echo "=== ses-forward-veganhearts-to-evelina-gmail.sh ==="
echo "Forward: hello@ + education@ veganhearts.org → $FORWARD_TO"
echo "Account=$ACCOUNT_ID Region=$REGION"

echo "--- verify Evelina address in SES (required to send forwards) ---"
STATUS=$("${AWS[@]}" ses get-identity-verification-attributes \
  --identities "$FORWARD_TO" \
  --query "VerificationAttributes.\"$FORWARD_TO\".VerificationStatus" \
  --output text 2>/dev/null || echo "NotFound")
if [[ "$STATUS" != "Success" ]]; then
  echo "ERROR: $FORWARD_TO is not verified in SES (status=$STATUS)."
  echo "Run: aws --profile $PROFILE --region $REGION ses verify-email-identity --email-address $FORWARD_TO"
  echo "Evelina must click the link in Gmail, then re-run this script."
  exit 1
fi

echo "--- zip Lambda (.dev/lambda/email-forwarder) ---"
cd "$LAM_DIR"
rm -f "$ZIP"
zip -qr "$ZIP" index.mjs node_modules

echo "--- update Lambda code + env ---"
if ! "${AWS[@]}" lambda get-function --function-name "$LAMBDA_NAME" >/dev/null 2>&1; then
  echo "ERROR: Lambda $LAMBDA_NAME missing. Create base infra first (see setup-email-forwarding.sh) or create role EmailForwarderRole."
  exit 1
fi

"${AWS[@]}" lambda update-function-code \
  --function-name "$LAMBDA_NAME" \
  --zip-file "fileb://$ZIP"

# Wait until code update finishes (config update fails if still "InProgress")
for _ in $(seq 1 30); do
  U=$("${AWS[@]}" lambda get-function-configuration --function-name "$LAMBDA_NAME" --query 'LastUpdateStatus' --output text)
  [[ "$U" == "Successful" ]] && break
  sleep 3
done

"${AWS[@]}" lambda update-function-configuration \
  --function-name "$LAMBDA_NAME" \
  --environment "Variables={FORWARD_TO=${FORWARD_TO},BUCKET=${BUCKET},DOMAIN=veganhearts.org}"

"${AWS[@]}" lambda add-permission \
  --function-name "$LAMBDA_NAME" \
  --statement-id "ses-inbound-vh-${RULE_NAME}" \
  --action lambda:InvokeFunction \
  --principal ses.amazonaws.com \
  --source-account "$ACCOUNT_ID" 2>/dev/null || true

echo "--- receipt rule $RULE_NAME on $RULE_SET (first = runs before WorkMail) ---"
"${AWS[@]}" ses delete-receipt-rule --rule-set-name "$RULE_SET" --rule-name "$RULE_NAME" 2>/dev/null || true

RULE_JSON=$(jq -nc \
  --arg name "$RULE_NAME" \
  --arg bucket "$BUCKET" \
  --arg arn "$LAM_ARN" \
  '{Name:$name,Enabled:true,TlsPolicy:"Optional",Recipients:["hello@veganhearts.org","education@veganhearts.org"],Actions:[{S3Action:{BucketName:$bucket,ObjectKeyPrefix:"emails/"}},{LambdaAction:{FunctionArn:$arn,InvocationType:"Event"}}],ScanEnabled:true}')

"${AWS[@]}" ses create-receipt-rule \
  --rule-set-name "$RULE_SET" \
  --rule "$RULE_JSON"

echo "--- confirm active rule set ---"
ACTIVE=$("${AWS[@]}" ses describe-active-receipt-rule-set --query 'Metadata.Name' --output text 2>/dev/null || echo "")
if [[ "$ACTIVE" != "$RULE_SET" ]]; then
  echo "WARN: active receipt rule set is '$ACTIVE' not $RULE_SET — WorkMail inbound may be off."
  echo "Fix: aws --profile $PROFILE --region $REGION ses set-active-receipt-rule-set --rule-set-name $RULE_SET"
fi

echo "--- rule order (first lines) ---"
"${AWS[@]}" ses describe-receipt-rule-set --rule-set-name "$RULE_SET" --output json | jq '.Rules | map(.Name)'

echo "=== done: mail to hello@ / education@ veganhearts.org → Lambda → $FORWARD_TO (and WorkMail still gets a copy if next rule matches) ==="
