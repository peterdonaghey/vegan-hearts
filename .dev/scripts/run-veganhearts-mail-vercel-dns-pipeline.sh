#!/usr/bin/env bash
# One-shot: push WorkMail/SES DNS to Vercel, then re-run AWS WorkMail verify + SES steps.
# Requires: vercel login, aws --profile peterdonaghey, jq.
#
# Usage:
#   ./.dev/scripts/run-veganhearts-mail-vercel-dns-pipeline.sh
#
# Optional:
#   ACTIVATE_INBOUND_MAIL=1  — after DNS verifies, activate SES INBOUND_MAIL (see workmail script)
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STAMP="$(date -u +"%Y-%m-%dT%H%M%SZ")"
LOG_DIR="$ROOT/.dev/generated/veganhearts-org-mail"
LOG="$LOG_DIR/pipeline-run-$STAMP.log"
mkdir -p "$LOG_DIR"

exec > >(tee "$LOG") 2>&1

echo "=============================================="
echo "pipeline start $STAMP (UTC)"
echo "log: $LOG"
echo "cwd: $ROOT"
echo "=============================================="

echo ""
echo "--- 0) vercel whoami ---"
vercel whoami

echo ""
echo "--- 1) vercel dns ls veganhearts.org (before) ---"
vercel dns ls veganhearts.org --limit 100 || true

echo ""
echo "--- 2) APPLY=1 vercel-dns-apply-workmail-records.sh ---"
export APPLY=1
"$ROOT/.dev/scripts/vercel-dns-apply-workmail-records.sh"

echo ""
echo "--- 3) vercel dns ls veganhearts.org (after) ---"
vercel dns ls veganhearts.org --limit 100 || true

echo ""
echo "--- 4) workmail-setup-veganhearts-org.sh (AWS verify + optional SES) ---"
export AWS_PROFILE="${AWS_PROFILE:-peterdonaghey}"
export AWS_REGION="${AWS_REGION:-us-east-1}"
if [[ "${ACTIVATE_INBOUND_MAIL:-0}" == "1" ]]; then
  export ACTIVATE_INBOUND_MAIL=1
fi
"$ROOT/.dev/scripts/workmail-setup-veganhearts-org.sh"

echo ""
echo "=============================================="
echo "pipeline end — full transcript: $LOG"
echo "=============================================="
