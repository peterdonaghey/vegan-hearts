#!/usr/bin/env bash
# =============================================================================
# 20_verify_aws_gone.sh — Read-only check that no VeganHearts AWS resources
# remain. Run this AFTER 19_teardown_aws.sh. Exits 0 if clean, 1 if leftovers.
#
# Usage:
#   bash .dev/scripts/20_verify_aws_gone.sh
# Requires: aws cli (--profile peterdonaghey), jq
# =============================================================================

set -uo pipefail

PROFILE="${AWS_PROFILE:-peterdonaghey}"
REGION="${AWS_REGION:-us-east-1}"
AWS=(aws --profile "$PROFILE" --region "$REGION")

failures=0

check() {
  local label="$1" result="$2"
  if [[ -z "$result" || "$result" == "None" || "$result" == "NONE" ]]; then
    printf '✅ %s\n' "$label"
  else
    printf '❌ %s:\n%s\n' "$label" "$result"
    failures=$((failures + 1))
  fi
}

section() { printf '\n════ %s ════\n' "$*"; }

section "DynamoDB tables"
check "vegan-hearts tables" "$("${AWS[@]}" dynamodb list-tables --query 'TableNames[?starts_with(@,`vegan-hearts`)]' --output text 2>/dev/null)"

section "S3 buckets"
check "vegan* buckets" "$("${AWS[@]}" s3api list-buckets --query "Buckets[?starts_with(Name,'vegan')].Name" --output text 2>/dev/null)"

section "SES"
check "vegan* identities" "$("${AWS[@]}" ses list-identities --query 'Identities[?contains(@,`vegan`)]' --output text 2>/dev/null)"
check "vegan* receipt rule sets" "$("${AWS[@]}" ses list-receipt-rule-sets --query 'RuleSets[?contains(Name,`vegan`) || contains(Name,`INBOUND`) || contains(Name,`forward`) || contains(Name,`email-forwarding`)].Name' --output text 2>/dev/null)"
check "vegan* contact lists" "$("${AWS[@]}" sesv2 list-contact-lists --query 'ContactLists[?contains(ContactListName,`vegan`)].ContactListName' --output text 2>/dev/null)"

section "Lambda"
check "VeganHeartsForwarder" "$("${AWS[@]}" lambda list-functions --query 'Functions[?contains(FunctionName,`VeganHearts`)].FunctionName' --output text 2>/dev/null)"

section "WorkMail"
check "veganhearts org" "$("${AWS[@]}" workmail list-organizations --query 'OrganizationSummaries[?contains(Alias,`vegan`)].OrganizationId' --output text 2>/dev/null)"

section "Cognito"
check "vegan-hearts-admins pool" "$("${AWS[@]}" cognito-idp list-user-pools --max-results 60 --query 'UserPools[?contains(Name,`vegan`)].Id' --output text 2>/dev/null)"

section "Amplify"
check "vegan app dzr37dw67gio8" "$("${AWS[@]}" amplify list-apps --query 'apps[?appId==`dzr37dw67gio8`].appId' --output text 2>/dev/null)"

section "Route 53"
check "vegan* hosted zones" "$("${AWS[@]}" route53 list-hosted-zones --query 'HostedZones[?contains(Name,`vegan`)].Name' --output text 2>/dev/null)"
check "vegan* registered domains" "$("${AWS[@]}" route53domains list-domains --query 'Domains[?contains(DomainName,`vegan`)].DomainName' --output text 2>/dev/null)"

section "IAM"
check "user vegan-hearts-api" "$("${AWS[@]}" iam get-user --user-name vegan-hearts-api --query 'User.UserName' --output text 2>/dev/null)"
check "policy vegan-hearts-api-policy" "$("${AWS[@]}" iam list-policies --scope Local --query 'Policies[?contains(PolicyName,`vegan-hearts-api`)].PolicyName' --output text 2>/dev/null)"
check "role EmailForwarderRole" "$("${AWS[@]}" iam list-roles --query 'Roles[?RoleName==`EmailForwarderRole`].RoleName' --output text 2>/dev/null)"

echo ""
if [[ "$failures" -eq 0 ]]; then
  echo "✅ All clear — no VeganHearts resources remain on AWS."
  exit 0
else
  echo "❌ $failures leftover resource group(s) found — check above."
  exit 1
fi
