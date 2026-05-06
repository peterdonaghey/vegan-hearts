#!/usr/bin/env bash
# Run after veganhearts.org ownership is VERIFIED in WorkMail:
# SES receipt rule + optional ACTIVATE_INBOUND_MAIL + optional mailboxes.
#
# Usage:
#   ACTIVATE_INBOUND_MAIL=1 WM_HELLO_PASSWORD=... WM_EDU_PASSWORD=... \
#     ./.dev/scripts/finish-workmail-activate-and-users.sh
#
# Or let it generate passwords for new mailboxes:
#   ACTIVATE_INBOUND_MAIL=1 AUTO_GENERATE_MAIL_PASSWORDS=1 \
#     ./.dev/scripts/finish-workmail-activate-and-users.sh
#
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
export AWS_PROFILE="${AWS_PROFILE:-peterdonaghey}"
export AWS_REGION="${AWS_REGION:-us-east-1}"

if [[ "${AUTO_GENERATE_MAIL_PASSWORDS:-0}" == "1" ]]; then
  export WM_HELLO_PASSWORD="${WM_HELLO_PASSWORD:-$(openssl rand -base64 24)}"
  export WM_EDU_PASSWORD="${WM_EDU_PASSWORD:-$(openssl rand -base64 24)}"
  echo "AUTO_GENERATE_MAIL_PASSWORDS: random passwords will be printed after setup."
fi

"$ROOT/.dev/scripts/workmail-setup-veganhearts-org.sh"

if [[ "${AUTO_GENERATE_MAIL_PASSWORDS:-0}" == "1" ]] && [[ -n "${WM_HELLO_PASSWORD:-}" ]]; then
  echo ""
  echo "================================================================"
  echo "SAVE PASSWORDS (local use only; do not commit):"
  echo "  hello@veganhearts.org     $WM_HELLO_PASSWORD"
  echo "  education@veganhearts.org $WM_EDU_PASSWORD"
  echo "================================================================"
fi
