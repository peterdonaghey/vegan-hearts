#!/usr/bin/env bash
# Wait until WorkMail reports veganhearts.org DNS VERIFIED, then:
#   - run workmail-setup-veganhearts-org.sh with ACTIVATE_INBOUND_MAIL=1
#   - create hello@ + education@ if missing (random passwords printed once to stdout)
#
# Usage:
#   ./.dev/scripts/poll-and-complete-veganhearts-mail.sh
#
# Env:
#   POLL_MAX_ATTEMPTS (default 40)
#   POLL_SLEEP_SEC   (default 30)  → up to ~20 min by default
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
export AWS_PROFILE="${AWS_PROFILE:-peterdonaghey}"
export AWS_REGION="${AWS_REGION:-us-east-1}"
WM_ORG="m-efd36f204fa4480f9eee765d5d380afa"
DOMAIN="veganhearts.org"
MAX="${POLL_MAX_ATTEMPTS:-40}"
SLEEP="${POLL_SLEEP_SEC:-30}"
LOG_DIR="$ROOT/.dev/generated/veganhearts-org-mail"
STAMP="$(date -u +"%Y-%m-%dT%H%M%SZ")"
LOG="$LOG_DIR/poll-complete-$STAMP.log"
mkdir -p "$LOG_DIR"

exec > >(tee "$LOG") 2>&1

echo "poll-and-complete-veganhearts-mail.sh start $STAMP (max ${MAX}×${SLEEP}s)"
echo "log: $LOG"

AWS=(aws --profile "$AWS_PROFILE" --region "$AWS_REGION")

for ((n = 1; n <= MAX; n++)); do
  json=$("${AWS[@]}" workmail get-mail-domain --organization-id "$WM_ORG" --domain-name "$DOMAIN" --output json)
  own=$(echo "$json" | jq -r '.OwnershipVerificationStatus // "UNKNOWN"')
  dkim=$(echo "$json" | jq -r '.DkimVerificationStatus // "UNKNOWN"')
  echo "[$n/$MAX] Ownership=$own Dkim=$dkim"
  # Ownership is required; DKIM often stays PENDING briefly while public DNS is already correct.
  if [[ "$own" == "VERIFIED" ]]; then
    echo "--- DNS verified — SES / WorkMail setup + activate ---"
    export ACTIVATE_INBOUND_MAIL=1
    export WM_HELLO_PASSWORD="${WM_HELLO_PASSWORD:-$(openssl rand -base64 24)}"
    export WM_EDU_PASSWORD="${WM_EDU_PASSWORD:-$(openssl rand -base64 24)}"
    "$ROOT/.dev/scripts/workmail-setup-veganhearts-org.sh"
    echo ""
    echo "================================================================"
    echo "SAVE PASSWORDS (not stored in git; also in this log file locally):"
    echo "  hello@${DOMAIN}  →  $WM_HELLO_PASSWORD"
    echo "  education@${DOMAIN}  →  $WM_EDU_PASSWORD"
    echo "================================================================"
    echo "poll-and-complete: success"
    exit 0
  fi
  if ((n < MAX)); then
    sleep "$SLEEP"
  fi
done

echo "poll-and-complete: timed out waiting for VERIFIED (public DNS may already be correct; AWS checks can lag)."
echo "Re-run later: ./.dev/scripts/poll-and-complete-veganhearts-mail.sh"
exit 1
