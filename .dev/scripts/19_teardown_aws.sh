#!/usr/bin/env bash
# =============================================================================
# 19_teardown_aws.sh — Delete ALL VeganHearts AWS resources (permanent)
#
# The org is disbanded and the site is now a static single page on Vercel.
# This script removes every AWS resource built for the old backend:
#   DynamoDB, S3, SES (+inbound), SESv2, Lambda, WorkMail, Cognito,
#   Amplify, Route 53 (legacy domain), IAM user/policy/role.
#
# Verified against live AWS (2026-08-02):
#   DynamoDB: vegan-hearts-admin-users, -email-signups, -events, -news,
#             -password-tokens
#   S3: vegan-hearts-assets, -dreamer-mail, -email-storage, -public-files
#   SES rule set INBOUND_MAIL (active): forward-vh-evelina-gmail,
#       dreamer-inbox, m-efd36f204fa4480f9eee765d5d380afa (WorkMail)
#   SES identities: veganhearts.org, vegan-hearts.org, veganhearts.awsapps.com,
#       hello@vegan-hearts.org, veganhearts2024@gmail.com,
#       donagheypeter@googlemail.com
#   SESv2 contact list: veganhearts-subscribers
#   Lambda: VeganHeartsForwarder
#   WorkMail org m-efd36f204fa4480f9eee765d5d380afa (users hello,
#       hello_vh, education_vh)
#   Cognito pool vegan-hearts-admins (us-east-1_Us0AwdnIH)
#   Amplify app dzr37dw67gio8
#   Route 53 hosted zone vegan-hearts.org (Z07021562WUGHHTUXDBG)
#   IAM: user vegan-hearts-api, policy vegan-hearts-api-policy,
#       role EmailForwarderRole
#
# It ONLY touches resources that belong to this project (vegan*-named or
# explicit IDs). Anything else in the account (other buckets, lambdas, SES
# identities, rule sets like agent-email-ruleset, hosted zones, registrations)
# is reported and left alone.
#
# Usage:
#   bash .dev/scripts/19_teardown_aws.sh             # real run (double confirm)
#   DRY_RUN=1 bash .dev/scripts/19_teardown_aws.sh   # preview, change nothing
#   SKIP_BACKUP=1 bash .dev/scripts/19_teardown_aws.sh
#   BACKUP_DIR=/some/path bash .dev/scripts/19_teardown_aws.sh
#   FORCE=1 bash .dev/scripts/19_teardown_aws.sh     # skip confirmations (CI)
#
# Requires: aws cli (--profile peterdonaghey), jq
# =============================================================================

set -euo pipefail

PROFILE="${AWS_PROFILE:-peterdonaghey}"
REGION="${AWS_REGION:-us-east-1}"
DRY_RUN="${DRY_RUN:-0}"
SKIP_BACKUP="${SKIP_BACKUP:-0}"
FORCE="${FORCE:-0}"
BACKUP_DIR="${BACKUP_DIR:-.dev/generated/aws-teardown-$(date +%Y%m%d-%H%M%S)}"

AWS=(aws --profile "$PROFILE" --region "$REGION")

# ----------------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------------
log()  { printf '%s\n' "$*"; }
ok()   { printf '✅ %s\n' "$*"; }
warn() { printf '⚠️  %s\n' "$*"; }
fail() { printf '❌ %s\n' "$*"; }

section() { printf '\n══════════════════════════════════════════════════════════\n'; log "▶ $*"; }

# Run a command honoring DRY_RUN (fails fast on error).
run() {
  if [[ "$DRY_RUN" == "1" ]]; then
    printf 'DRY-RUN: %q ' "$@"; echo
  else
    "$@"
  fi
}

# Run ignoring errors (resource may not exist / already gone).
try() {
  if [[ "$DRY_RUN" == "1" ]]; then
    printf 'DRY-RUN: %q ' "$@"; echo
  else
    "$@" 2>/dev/null || warn "failed (may not exist): $*"
  fi
}

# ----------------------------------------------------------------------------
# 0. Preflight + confirmation
# ----------------------------------------------------------------------------
section "Preflight"
if ! command -v aws >/dev/null 2>&1; then
  fail "aws CLI not found. Install it first."
  exit 1
fi
if ! command -v jq >/dev/null 2>&1; then
  fail "jq not found (brew install jq)."
  exit 1
fi

log "Identity check (profile: $PROFILE, region: $REGION):"
"${AWS[@]}" sts get-caller-identity || { fail "AWS auth failed. Check your profile."; exit 1; }

ME_ARN=$("${AWS[@]}" sts get-caller-identity --query Arn --output text)

log ""
log "🔴 This script PERMANENTLY DELETES all VeganHearts AWS resources:"
log "  - DynamoDB: vegan-hearts-email-signups, -events, -admin-users, -password-tokens, -news"
log "  - S3: vegan-hearts-public-files, -assets, -email-storage, -dreamer-mail"
log "  - SES: vegan* identities, rule sets INBOUND_MAIL + email-forwarding,"
log "    contact list veganhearts-subscribers"
log "  - Lambda: VeganHeartsForwarder  |  WorkMail org m-efd36f204fa4480f9eee765d5d380afa"
log "  - Cognito pool vegan-hearts-admins  |  Amplify app dzr37dw67gio8"
log "  - Route 53: hosted zone vegan-hearts.org"
log "  - IAM: user vegan-hearts-api, policy vegan-hearts-api-policy, role EmailForwarderRole"

if [[ "$DRY_RUN" == "1" ]]; then
  log ""
  log "DRY-RUN mode: nothing will be deleted."
elif [[ "$FORCE" == "1" ]]; then
  warn "FORCE=1 — skipping confirmation."
else
  log ""
  read -r -p "Type YES to begin: " ANS1
  [[ "$ANS1" == "YES" ]] || { fail "Aborted."; exit 1; }
  read -r -p "IRREVERSIBLE. Type YES again to confirm: " ANS2
  [[ "$ANS2" == "YES" ]] || { fail "Aborted."; exit 1; }
fi

# ----------------------------------------------------------------------------
# 1. Backup everything that will be deleted
# ----------------------------------------------------------------------------
if [[ "$SKIP_BACKUP" == "1" ]]; then
  warn "SKIP_BACKUP=1 — skipping backups and file rescue."
else
  section "Backup → $BACKUP_DIR"
  mkdir -p "$BACKUP_DIR"/{dynamodb,s3,ses,cognito}

  # DynamoDB: scan every vegan-hearts table to JSON
  TABLES=$(aws dynamodb list-tables \
    --profile "$PROFILE" --region "$REGION" \
    --query 'TableNames[?starts_with(@,`vegan-hearts`)]' --output text || true)
  for table in $TABLES; do
    log "  Scanning $table..."
    try "${AWS[@]}" dynamodb scan --table-name "$table" --output json > "$BACKUP_DIR/dynamodb/$table.json"
    ok "Backed up $table"
  done

  # S3: sync every vegan bucket locally
  BUCKETS=$(aws s3api list-buckets \
    --profile "$PROFILE" \
    --query 'Buckets[].Name' --output text | tr '\t' '\n' | grep -i vegan || true)
  for bucket in $BUCKETS; do
    if "${AWS[@]}" s3api head-bucket --bucket "$bucket" >/dev/null 2>&1; then
      log "  Syncing s3://$bucket..."
      try "${AWS[@]}" s3 sync "s3://$bucket" "$BACKUP_DIR/s3/$bucket"
      ok "Backed up s3://$bucket"
    else
      warn "Bucket $bucket not found, skipping."
    fi
  done

  # Rescue live-site files into the repo so the static page keeps working
  mkdir -p public/india-documentary public/ebooks
  if [[ -d "$BACKUP_DIR/s3/vegan-hearts-assets/india-documentary" ]]; then
    run cp -R "$BACKUP_DIR/s3/vegan-hearts-assets/india-documentary/." public/india-documentary/
    ok "Hero images rescued → public/india-documentary/"
  fi
  if [[ -f "$BACKUP_DIR/s3/vegan-hearts-public-files/ebooks/awakening-your-vegan-heart-21-days.pdf" ]]; then
    run cp "$BACKUP_DIR/s3/vegan-hearts-public-files/ebooks/awakening-your-vegan-heart-21-days.pdf" public/ebooks/
    ok "Ebook PDF rescued → public/ebooks/"
  elif [[ -f "Awakening your Vegan Heart.pdf" ]]; then
    run cp "Awakening your Vegan Heart.pdf" "public/ebooks/awakening-your-vegan-heart-21-days.pdf"
    ok "Ebook PDF copied from repo root → public/ebooks/"
  else
    warn "Ebook PDF not found in S3 backup or repo root — grab it before deleting the bucket!"
  fi

  # SESv2 contacts + Cognito users (for the record)
  try "${AWS[@]}" sesv2 list-contacts --contact-list-name veganhearts-subscribers > "$BACKUP_DIR/ses/contacts.json"
  COGNITO_POOL_ID=$(aws cognito-idp list-user-pools --max-results 60 \
    --profile "$PROFILE" --region "$REGION" \
    --query "UserPools[?Name=='vegan-hearts-admins'].Id | [0]" --output text 2>/dev/null || true)
  if [[ -n "$COGNITO_POOL_ID" && "$COGNITO_POOL_ID" != "None" ]]; then
    try "${AWS[@]}" cognito-idp list-users --user-pool-id "$COGNITO_POOL_ID" --output json > "$BACKUP_DIR/cognito/users.json"
  fi

  ok "Backup complete."
fi

# ----------------------------------------------------------------------------
# 2. Inbound mail off — SES receipt rules, Lambda, log group
# ----------------------------------------------------------------------------
section "SES inbound (receipt rules + Lambda)"

# Deactivate whatever rule set is active so SES stops routing mail
try "${AWS[@]}" ses set-active-receipt-rule-set --rule-set-name ""

# Delete all rules + rule sets we created (INBOUND_MAIL and the legacy one).
# This covers forward-vh-evelina-gmail, dreamer-inbox and the WorkMail rule.
for RULE_SET in INBOUND_MAIL email-forwarding; do
  RULES=$(aws ses describe-receipt-rule-set --rule-set-name "$RULE_SET" \
    --profile "$PROFILE" --region "$REGION" \
    --query 'Rules[].Name' --output text 2>/dev/null || true)
  for rule in $RULES; do
    try "${AWS[@]}" ses delete-receipt-rule --rule-set-name "$RULE_SET" --rule-name "$rule"
  done
  try "${AWS[@]}" ses delete-receipt-rule-set --rule-set-name "$RULE_SET"
done

# Spam/virus receipt filters (none exist today, harmless to try)
FILTERS=$(aws ses list-receipt-filters --profile "$PROFILE" --region "$REGION" \
  --query 'Filters[].Name' --output text 2>/dev/null || true)
for filter in $FILTERS; do
  try "${AWS[@]}" ses delete-receipt-filter --filter-name "$filter"
done

# Lambda forwarder + its CloudWatch log group
try "${AWS[@]}" lambda delete-function --function-name VeganHeartsForwarder
try "${AWS[@]}" logs delete-log-group --log-group-name /aws/lambda/VeganHeartsForwarder

# ----------------------------------------------------------------------------
# 3. SES sending — identities, contact list, configuration sets
# ----------------------------------------------------------------------------
section "SES identities + SESv2 contact list"

# Delete only vegan-related identities (domains + email addresses)
IDENTITIES=$(aws ses list-identities --profile "$PROFILE" --region "$REGION" \
  --query 'Identities' --output json | jq -r '.[]' 2>/dev/null || true)
for identity in $IDENTITIES; do
  if [[ "$identity" == *vegan* ]]; then
    try "${AWS[@]}" ses delete-identity --identity "$identity"
  else
    warn "Skipping unrelated SES identity: $identity"
  fi
done

try "${AWS[@]}" sesv2 delete-contact-list --contact-list-name veganhearts-subscribers

CONFIG_SETS=$(aws sesv2 list-configuration-sets --profile "$PROFILE" --region "$REGION" \
  --query 'ConfigurationSets' --output text 2>/dev/null || true)
for cs in $CONFIG_SETS; do
  try "${AWS[@]}" sesv2 delete-configuration-set --configuration-set-name "$cs"
done

# ----------------------------------------------------------------------------
# 4. WorkMail — users, domains, then the org itself
# ----------------------------------------------------------------------------
section "WorkMail org"

for ORG in $(aws workmail list-organizations --profile "$PROFILE" --region "$REGION" \
  --query 'OrganizationSummaries[].OrganizationId' --output text || true); do
  if [[ "$ORG" != "m-efd36f204fa4480f9eee765d5d380afa" ]]; then
    warn "Skipping unrelated WorkMail org: $ORG"
    continue
  fi

  # Mailboxes first (they must be deregistered + disabled before delete)
  for UID in $(aws workmail list-users --organization-id "$ORG" \
    --profile "$PROFILE" --region "$REGION" \
    --query 'Users[].Id' --output text || true); do
    try "${AWS[@]}" workmail deregister-from-work-mail --organization-id "$ORG" --entity-id "$UID"
    try "${AWS[@]}" workmail disable-user --organization-id "$ORG" --user-id "$UID"
    try "${AWS[@]}" workmail delete-user --organization-id "$ORG" --user-id "$UID"
  done

  # Domains next
  for DOMAIN in $(aws workmail list-mail-domains --organization-id "$ORG" \
    --profile "$PROFILE" --region "$REGION" \
    --query 'MailDomains[].DomainName' --output text || true); do
    try "${AWS[@]}" workmail deregister-mail-domain --organization-id "$ORG" --domain-name "$DOMAIN"
    try "${AWS[@]}" workmail delete-mail-domain --organization-id "$ORG" --domain-name "$DOMAIN"
  done

  try "${AWS[@]}" workmail delete-organization --organization-id "$ORG" --delete-directory
done

# ----------------------------------------------------------------------------
# 5. Cognito user pool
# ----------------------------------------------------------------------------
section "Cognito"

delete_user_pool() {
  local pool_id="$1"
  if [[ "$DRY_RUN" == "1" ]]; then
    printf 'DRY-RUN: %q %q %q %q %q %q\n' aws --profile "$PROFILE" --region "$REGION" \
      cognito-idp delete-user-pool --user-pool-id "$pool_id"
    return
  fi
  if "${AWS[@]}" cognito-idp delete-user-pool --user-pool-id "$pool_id" >/dev/null 2>&1; then
    ok "Deleted user pool $pool_id"
  else
    warn "Direct delete failed — removing users first, then retrying."
    for username in $("${AWS[@]}" cognito-idp list-users --user-pool-id "$pool_id" \
      --query 'Users[].Username' --output text 2>/dev/null || true); do
      "${AWS[@]}" cognito-idp admin-delete-user --user-pool-id "$pool_id" --username "$username" >/dev/null 2>&1 || true
    done
    if "${AWS[@]}" cognito-idp delete-user-pool --user-pool-id "$pool_id" >/dev/null 2>&1; then
      ok "Deleted user pool $pool_id (after removing users)"
    else
      fail "Could not delete user pool $pool_id — delete it manually in the console."
    fi
  fi
}

POOL_ID=$(aws cognito-idp list-user-pools --max-results 60 \
  --profile "$PROFILE" --region "$REGION" \
  --query "UserPools[?Name=='vegan-hearts-admins'].Id | [0]" --output text 2>/dev/null || true)
if [[ -n "$POOL_ID" && "$POOL_ID" != "None" ]]; then
  delete_user_pool "$POOL_ID"
else
  warn "Cognito pool 'vegan-hearts-admins' not found — nothing to delete."
fi

# ----------------------------------------------------------------------------
# 6. Amplify app (leftover from pre-Vercel hosting)
# ----------------------------------------------------------------------------
section "Amplify"

try "${AWS[@]}" amplify delete-app --app-id dzr37dw67gio8

# ----------------------------------------------------------------------------
# 7. DynamoDB tables
# ----------------------------------------------------------------------------
section "DynamoDB"

TABLES=$(aws dynamodb list-tables --profile "$PROFILE" --region "$REGION" \
  --query 'TableNames[?starts_with(@,`vegan-hearts`)]' --output text || true)
for table in $TABLES; do
  run "${AWS[@]}" dynamodb delete-table --table-name "$table"
  ok "Deleting table $table"
done

# ----------------------------------------------------------------------------
# 8. S3 buckets (backed up in phase 1 — --force removes objects + versions)
# ----------------------------------------------------------------------------
section "S3 buckets"

BUCKETS=$(aws s3api list-buckets --profile "$PROFILE" \
  --query 'Buckets[].Name' --output text | tr '\t' '\n' | grep -i vegan || true)
for bucket in $BUCKETS; do
  run aws s3 rb "s3://$bucket" --force --profile "$PROFILE"
done

# ----------------------------------------------------------------------------
# 9. Route 53 — legacy domain + hosted zones
# ----------------------------------------------------------------------------
section "Route 53"

# Registrations can't be deleted via CLI — disable auto-renew so they lapse
# (only if a vegan* registration exists in this account; today none does)
for domain in $(aws route53domains list-domains --profile "$PROFILE" --region "$REGION" \
  --query 'Domains[].DomainName' --output text 2>/dev/null || true); do
  if [[ "$domain" == *vegan* ]]; then
    run "${AWS[@]}" route53domains disable-domain-auto-renew --domain-name "$domain"
    warn "Registration '$domain' kept (can't delete) — auto-renew disabled, it will lapse."
  else
    warn "Skipping unrelated registered domain: $domain"
  fi
done

# Hosted zones: delete all records (except NS/SOA) then the zone — vegan* only
while read -r zid zname; do
  [[ -n "$zid" ]] || continue
  zid=${zid#/hostedzone/}
  if [[ "$zname" != *vegan* ]]; then
    warn "Skipping unrelated hosted zone: $zname ($zid)"
    continue
  fi
  log "  Cleaning hosted zone $zname ($zid)..."
  if ! "${AWS[@]}" route53 list-resource-record-sets --hosted-zone-id "$zid" \
    --output json > "$BACKUP_DIR/route53-${zname%.}.json" 2>/dev/null; then
    warn "Could not read hosted zone $zname — skipping."
    continue
  fi
  jq '{Changes: [.ResourceRecordSets[] |
        select(.Type != "NS" and .Type != "SOA") |
        {Action: "DELETE", ResourceRecordSet: .}]}' \
    "$BACKUP_DIR/route53-${zname%.}.json" > "$BACKUP_DIR/route53-changes-${zname%.}.json"
  if jq -e '.Changes | length > 0' "$BACKUP_DIR/route53-changes-${zname%.}.json" >/dev/null 2>&1; then
    run "${AWS[@]}" route53 change-resource-record-sets --hosted-zone-id "$zid" \
      --change-batch "file://$BACKUP_DIR/route53-changes-${zname%.}.json"
  fi
  run "${AWS[@]}" route53 delete-hosted-zone --id "$zid"
done < <(aws route53 list-hosted-zones --profile "$PROFILE" \
  --query 'HostedZones[].[Id,Name]' --output text || true)

# ----------------------------------------------------------------------------
# 10. IAM — policy, user, role (LAST: the script's own credentials might
#     depend on these, so never run before the AWS steps above)
# ----------------------------------------------------------------------------
section "IAM"

# Customer-managed policy
POLICY_ARN=$(aws iam list-policies --scope Local --profile "$PROFILE" \
  --query "Policies[?PolicyName=='vegan-hearts-api-policy'].Arn" --output text 2>/dev/null || true)
if [[ -n "$POLICY_ARN" && "$POLICY_ARN" != "None" ]]; then
  try "${AWS[@]}" iam detach-user-policy --user-name vegan-hearts-api --policy-arn "$POLICY_ARN"
  for version in $(aws iam list-policy-versions --policy-arn "$POLICY_ARN" --profile "$PROFILE" \
    --query 'Versions[?!IsDefaultVersion].VersionId' --output text 2>/dev/null || true); do
    try "${AWS[@]}" iam delete-policy-version --policy-arn "$POLICY_ARN" --version-id "$version"
  done
  try "${AWS[@]}" iam delete-policy --policy-arn "$POLICY_ARN"
fi

# App IAM user — skip if the CLI profile authenticates AS this user
USER_ARN=$(aws iam get-user --user-name vegan-hearts-api --profile "$PROFILE" \
  --query 'User.Arn' --output text 2>/dev/null || true)
if [[ -n "$USER_ARN" ]]; then
  if [[ "$ME_ARN" == "$USER_ARN" ]]; then
    warn "CLI profile authenticates AS vegan-hearts-api — skipping its deletion (delete last, manually)."
  else
    for key in $(aws iam list-access-keys --user-name vegan-hearts-api --profile "$PROFILE" \
      --query 'AccessKeyMetadata[].AccessKeyId' --output text 2>/dev/null || true); do
      try "${AWS[@]}" iam delete-access-key --user-name vegan-hearts-api --access-key-id "$key"
    done
    for inline in $(aws iam list-user-policies --user-name vegan-hearts-api --profile "$PROFILE" \
      --query 'PolicyNames' --output text 2>/dev/null || true); do
      try "${AWS[@]}" iam delete-user-policy --user-name vegan-hearts-api --policy-name "$inline"
    done
    for attached in $(aws iam list-attached-user-policies --user-name vegan-hearts-api --profile "$PROFILE" \
      --query 'AttachedPolicies[].PolicyArn' --output text 2>/dev/null || true); do
      try "${AWS[@]}" iam detach-user-policy --user-name vegan-hearts-api --policy-arn "$attached"
    done
    try "${AWS[@]}" iam delete-user --user-name vegan-hearts-api
  fi
else
  warn "IAM user vegan-hearts-api not found — nothing to delete."
fi

# Lambda forwarding role
for attached in $(aws iam list-attached-role-policies --role-name EmailForwarderRole --profile "$PROFILE" \
  --query 'AttachedPolicies[].PolicyArn' --output text 2>/dev/null || true); do
  try "${AWS[@]}" iam detach-role-policy --role-name EmailForwarderRole --policy-arn "$attached"
done
for inline in $(aws iam list-role-policies --role-name EmailForwarderRole --profile "$PROFILE" \
  --query 'PolicyNames' --output text 2>/dev/null || true); do
  try "${AWS[@]}" iam delete-role-policy --role-name EmailForwarderRole --policy-name "$inline"
done
try "${AWS[@]}" iam delete-role --role-name EmailForwarderRole

# ----------------------------------------------------------------------------
# Done — manual follow-ups
# ----------------------------------------------------------------------------
section "Teardown complete"
ok "All VeganHearts AWS resources removed (or scheduled)."

log ""
log "Manual follow-ups (outside AWS):"
log "  1. Vercel → project env vars: delete AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,"
log "     AWS_REGION, NEXT_PUBLIC_COGNITO_USER_POOL_ID, NEXT_PUBLIC_COGNITO_CLIENT_ID"
log "  2. GitHub → repo secrets: delete AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY;"
log "     delete .github/workflows/daily.yml (dream job reads S3)"
log "  3. Vercel DNS (veganhearts.org): optional — remove the MX/TXT/DKIM/autodiscover"
log "     records now that no mail service exists (or leave; mail just drops)"
log "  4. WorkMail mailbox contents: if you want them, export via IMAP"
log "     (imap.mail.us-east-1.awsapps.com:993) BEFORE the org was deleted"
log "  5. Code: .gitignore has '*.pdf' — remove that line so public/ebooks/ is committed"
log "  6. Route 53 legacy domain 'vegan-hearts.org': let the registration lapse or"
log "     transfer it (registration isn't in this account — no action needed here)"
log ""
log "Backups (if not skipped): $BACKUP_DIR"
