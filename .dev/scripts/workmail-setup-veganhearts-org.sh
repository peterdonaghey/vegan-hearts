#!/usr/bin/env bash
# Register veganhearts.org on existing WorkMail org, export DNS for Spaceship,
# merge SES INBOUND_MAIL recipients, optionally activate INBOUND_MAIL, optionally create users.
#
# Usage:
#   ./.dev/scripts/workmail-setup-veganhearts-org.sh
#
# Optional env:
#   ACTIVATE_INBOUND_MAIL=1   — ses set-active-receipt-rule-set INBOUND_MAIL (disables other active sets)
#   WM_HELLO_PASSWORD=...    — if set with WM_EDU_PASSWORD, creates hello@ + education@ mailboxes
#   WM_EDU_PASSWORD=...
#
set -euo pipefail

PROFILE="${AWS_PROFILE:-peterdonaghey}"
REGION="${AWS_REGION:-us-east-1}"
WM_ORG="m-efd36f204fa4480f9eee765d5d380afa"
DOMAIN="veganhearts.org"
RULE_SET="INBOUND_MAIL"
# Receipt rule name equals org id (AWS default for WorkMail org rule)
WM_RULE_NAME="$WM_ORG"

AWS=(aws --profile "$PROFILE" --region "$REGION")
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
OUT_DIR="$ROOT/.dev/generated/veganhearts-org-mail"
JSON_OUT="$OUT_DIR/dns-records.json"
TXT_OUT="$OUT_DIR/authoritative-dns.txt"
LOG="$OUT_DIR/last-run.log"

mkdir -p "$OUT_DIR"
exec > >(tee -a "$LOG") 2>&1

echo "=== workmail-setup-veganhearts-org.sh $(date -u +"%Y-%m-%dT%H:%M:%SZ") ==="
echo "Profile=$PROFILE Region=$REGION"

need_jq() {
  if ! command -v jq >/dev/null 2>&1; then
    echo "ERROR: jq is required (brew install jq)." >&2
    exit 1
  fi
}

need_jq

echo "--- Step 1: register-mail-domain ($DOMAIN) ---"
if "${AWS[@]}" workmail list-mail-domains --organization-id "$WM_ORG" --output json \
  | jq -e --arg d "$DOMAIN" '.MailDomains[] | select(.DomainName == $d)' >/dev/null 2>&1; then
  echo "Domain already registered on org; skipping register-mail-domain."
else
  if "${AWS[@]}" workmail register-mail-domain \
    --organization-id "$WM_ORG" \
    --domain-name "$DOMAIN"; then
    echo "register-mail-domain OK"
  else
    echo "register-mail-domain failed; check error above."
    exit 1
  fi
fi

echo "--- Step 2: get-mail-domain (save DNS for your NS host, e.g. Vercel) ---"
"${AWS[@]}" workmail get-mail-domain \
  --organization-id "$WM_ORG" \
  --domain-name "$DOMAIN" \
  --output json | tee "$JSON_OUT"

OWN=$(jq -r '.OwnershipVerificationStatus // "UNKNOWN"' "$JSON_OUT")
DKIM=$(jq -r '.DkimVerificationStatus // "UNKNOWN"' "$JSON_OUT")
echo "OwnershipVerificationStatus=$OWN DkimVerificationStatus=$DKIM"

{
  echo "DNS for $DOMAIN (Vercel DNS, Route 53, etc. — whoever your nameservers point to) — add these records exactly as returned by AWS."
  echo "If your host appends the zone name, use trailing dots on names where shown."
  echo ""
  jq -r '.Records[] | "\(.Type)\t\(.Hostname)\t\(.Value)"' "$JSON_OUT" \
    | if command -v column >/dev/null 2>&1; then column -t -s $'\t'; else cat; fi
} > "$TXT_OUT"

echo "Wrote: $TXT_OUT"
echo "Wrote: $JSON_OUT"

if [[ "$OWN" != "VERIFIED" ]]; then
  echo ""
  echo "STOP: domain ownership not verified yet. Fix DNS at your NS host, wait, re-run."
  exit 0
fi
if [[ "$DKIM" != "VERIFIED" ]]; then
  echo ""
  echo "WARN: DkimVerificationStatus=$DKIM (AWS can lag after correct CNAMEs). Continuing with SES receipt rules / activation; DKIM usually flips to VERIFIED soon."
fi

echo "--- Step 3: SES — add $DOMAIN to WorkMail receipt rule ---"
RULE_SET_JSON=$("${AWS[@]}" ses describe-receipt-rule-set --rule-set-name "$RULE_SET" --output json)
UPDATED_RULE=$(echo "$RULE_SET_JSON" | jq -c \
  --arg name "$WM_RULE_NAME" \
  --arg dom "$DOMAIN" \
  '.Rules[] | select(.Name == $name) | .Recipients |= (. + [$dom] | unique)')

if echo "$RULE_SET_JSON" | jq -e --arg name "$WM_RULE_NAME" --arg dom "$DOMAIN" \
  '.Rules[] | select(.Name == $name) | .Recipients | index($dom) != null' >/dev/null 2>&1; then
  echo "Recipient $DOMAIN already present in rule $WM_RULE_NAME"
else
  "${AWS[@]}" ses update-receipt-rule --rule-set-name "$RULE_SET" --rule "$UPDATED_RULE"
  echo "update-receipt-rule OK"
fi

if [[ "${ACTIVATE_INBOUND_MAIL:-0}" == "1" ]]; then
  echo "--- Step 4: ses set-active-receipt-rule-set INBOUND_MAIL ---"
  "${AWS[@]}" ses set-active-receipt-rule-set --rule-set-name "$RULE_SET"
  echo "Active receipt rule set is now INBOUND_MAIL (other sets inactive)."
else
  echo "--- Step 4: skipped (set ACTIVATE_INBOUND_MAIL=1 to activate INBOUND_MAIL) ---"
  echo "Inbound mail for WorkMail only runs through the ACTIVE rule set. Current active set:"
  "${AWS[@]}" ses describe-active-receipt-rule-set --output json 2>/dev/null || echo "(none)"
fi

if [[ -n "${WM_HELLO_PASSWORD:-}" ]] && [[ -n "${WM_EDU_PASSWORD:-}" ]]; then
  echo "--- Step 5: create users hello@ and education@ (if missing) ---"
  users_json=$("${AWS[@]}" workmail list-users --organization-id "$WM_ORG" --output json)
  create_if_missing() {
    local local_name="$1"
    local display="$2"
    local email="$3"
    local pass="$4"
    if echo "$users_json" | jq -e --arg e "$email" '.Users[] | select(.Email == $e)' >/dev/null 2>&1; then
      echo "User already exists: $email"
      return 0
    fi
    local uid
    uid=$("${AWS[@]}" workmail create-user \
      --organization-id "$WM_ORG" \
      --name "$local_name" \
      --display-name "$display" \
      --query UserId --output text)
    "${AWS[@]}" workmail register-to-work-mail \
      --organization-id "$WM_ORG" \
      --entity-id "$uid" \
      --email "$email"
    "${AWS[@]}" workmail reset-password \
      --organization-id "$WM_ORG" \
      --user-id "$uid" \
      --password "$pass"
    echo "Created and enabled: $email"
  }
  # WorkMail "name" is unique per org (not per domain). hello@vegan-hearts.org already uses "hello".
  create_if_missing "${WM_LOCAL_HELLO_NAME:-hello_vh}" "Vegan Hearts" "hello@${DOMAIN}" "$WM_HELLO_PASSWORD"
  create_if_missing "${WM_LOCAL_EDU_NAME:-education_vh}" "Vegan Hearts Education" "education@${DOMAIN}" "$WM_EDU_PASSWORD"
else
  echo "--- Step 5: skipped (set WM_HELLO_PASSWORD and WM_EDU_PASSWORD to create mailboxes) ---"
fi

echo "=== done ==="
