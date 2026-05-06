#!/usr/bin/env bash
# Apply WorkMail/SES DNS from dns-records.json via `vercel dns add`.
# Prereqs: `vercel login` (or VERCEL_TOKEN), domain added to Vercel, NS pointing to Vercel.
#
# Default: print commands only (dry run). To execute:
#   APPLY=1 ./.dev/scripts/vercel-dns-apply-workmail-records.sh
#
set -euo pipefail

DOMAIN="${VERCEL_DNS_DOMAIN:-veganhearts.org}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
JSON="${WORKMAIL_DNS_JSON:-$ROOT/.dev/generated/veganhearts-org-mail/dns-records.json}"
APPLY="${APPLY:-0}"

if ! command -v jq >/dev/null 2>&1; then
  echo "ERROR: jq required (brew install jq)" >&2
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "ERROR: vercel CLI not found" >&2
  exit 1
fi

if [[ ! -f "$JSON" ]]; then
  echo "ERROR: missing $JSON — run .dev/scripts/workmail-setup-veganhearts-org.sh first" >&2
  exit 1
fi

hostname_to_sub() {
  local hn="$1"
  hn="${hn%.}"
  if [[ "$hn" == "$DOMAIN" ]]; then
    echo '@'
  elif [[ "$hn" == *".$DOMAIN" ]]; then
    echo "${hn%.$DOMAIN}"
  else
    echo "ERROR: hostname $hn not under $DOMAIN" >&2
    return 1
  fi
}

strip_dot() {
  local s="$1"
  echo "${s%.}"
}

run() {
  if [[ "$APPLY" == "1" ]]; then
    "$@"
  else
    printf 'DRY-RUN: '; printf '%q ' "$@"; echo
  fi
}

# When APPLY=1, skip adds if `vercel dns ls` already shows the value (re-runnable pipeline).
snapshot=""
refresh_snapshot() {
  snapshot=$(vercel dns ls "$DOMAIN" --limit 100 2>/dev/null | tail -n +2 || true)
}

already_has() {
  [[ "$APPLY" == "1" ]] || return 1
  [[ -n "$snapshot" ]] || return 1
  grep -Fq "$1" <<< "$snapshot"
}

count=$(jq '.Records | length' "$JSON")
echo "Records: $count | Domain: $DOMAIN | APPLY=$APPLY | JSON=$JSON"
echo ""

if [[ "$APPLY" == "1" ]]; then
  refresh_snapshot
fi

for ((i = 0; i < count; i++)); do
  type=$(jq -r ".Records[$i].Type" "$JSON")
  host=$(jq -r ".Records[$i].Hostname" "$JSON")
  val=$(jq -r ".Records[$i].Value" "$JSON")
  sub=$(hostname_to_sub "$host") || exit 1

  case "$type" in
    MX)
      pri="${val%% *}"
      target="${val#* }"
      target=$(strip_dot "$target")
      if already_has "inbound-smtp.us-east-1.amazonaws.com"; then
        echo "SKIP MX (already present): $target"
      else
        run vercel dns add "$DOMAIN" "$sub" MX "$target" "$pri"
        refresh_snapshot
      fi
      ;;
    TXT)
      if already_has "$val"; then
        echo "SKIP TXT (already present): $sub"
      else
        run vercel dns add "$DOMAIN" "$sub" TXT "$val"
        refresh_snapshot
      fi
      ;;
    CNAME)
      tgt=$(strip_dot "$val")
      if already_has "$tgt"; then
        echo "SKIP CNAME (already present): $sub"
      else
        run vercel dns add "$DOMAIN" "$sub" CNAME "$tgt"
        refresh_snapshot
      fi
      ;;
    *)
      echo "SKIP unsupported type: $type" >&2
      ;;
  esac
done

echo ""
if [[ "$APPLY" != "1" ]]; then
  echo "Dry run only. Re-run with APPLY=1 to push to Vercel."
else
  echo "Done. Verify: vercel dns ls $DOMAIN --limit 100"
fi
