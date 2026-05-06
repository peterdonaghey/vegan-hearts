# veganhearts.org email (concise reference)

## What you have

- **Canonical mail domain:** `veganhearts.org` (no hyphen), DNS on **Vercel** (NS `ns1/ns2.vercel-dns.com`). Spaceship is registrar only; its DNS is inactive while those NS are set.
- **Legacy domain:** `vegan-hearts.org` (hyphen) — still on Route 53; same WorkMail **org** can host both.
- **AWS WorkMail org:** alias `veganhearts`, id `m-efd36f204fa4480f9eee765d5d380afa`, region **`us-east-1`**.
- **Inbound mail:** SES MX → receipt rule set **`INBOUND_MAIL`** → **WorkMail** for recipients `vegan-hearts.org`, `veganhearts.awsapps.com`, **`veganhearts.org`**.
- **Active SES rule set:** **`INBOUND_MAIL`** (required for WorkMail). Any other rule set (e.g. personal agent inbox) is **inactive** unless merged into `INBOUND_MAIL` or you switch the active set again.
- **Forward to Evelina (Gmail):** Rule **`forward-vh-evelina-gmail`** runs **first** on `INBOUND_MAIL`: `hello@veganhearts.org` and `education@veganhearts.org` → S3 (`vegan-hearts-email-storage` prefix `emails/`) → Lambda **`VeganHeartsForwarder`** → **`veganhearts2024@gmail.com`**. Then the WorkMail rule still runs so copies land in WorkMail too (if SES continues; S3+Lambda Event is non-terminating).

## Scripts (repo)

| Script | Role |
|--------|------|
| `workmail-setup-veganhearts-org.sh` | Register domain on org (once), refresh `dns-records.json` + `authoritative-dns.txt`, after **domain ownership** `VERIFIED` → add `veganhearts.org` to SES WorkMail rule; optional `ACTIVATE_INBOUND_MAIL=1`; optional mailboxes if `WM_HELLO_PASSWORD` + `WM_EDU_PASSWORD` set. DKIM can still say `PENDING` briefly; script continues with a warning. |
| `vercel-dns-apply-workmail-records.sh` | `APPLY=1` — push records from `dns-records.json` via `vercel dns add`; skips rows already present in `vercel dns ls`. |
| `run-veganhearts-mail-vercel-dns-pipeline.sh` | Vercel apply + `workmail-setup` in one run; logs under `.dev/generated/veganhearts-org-mail/pipeline-run-*.log`. |
| `poll-and-complete-veganhearts-mail.sh` | Waits until WorkMail **ownership** is `VERIFIED`, then same as finish (activate + optional users). |
| `finish-workmail-activate-and-users.sh` | Wrapper: `ACTIVATE_INBOUND_MAIL=1` + optional `AUTO_GENERATE_MAIL_PASSWORDS=1` → runs `workmail-setup`; prints generated passwords once (local terminal only). |
| `ses-forward-veganhearts-to-evelina-gmail.sh` | Zip `.dev/lambda/email-forwarder`, update **`VeganHeartsForwarder`** (`FORWARD_TO` default `veganhearts2024@gmail.com`), create/replace SES rule **`forward-vh-evelina-gmail`** at top of **`INBOUND_MAIL`**. Requires Evelina’s address **verified in SES**. |

**AWS CLI profile:** `peterdonaghey` (override with `AWS_PROFILE`).

## Mailboxes (WorkMail)

| Email | Internal `name` | Note |
|-------|-----------------|------|
| `hello@vegan-hearts.org` | `hello` | Original hyphen domain |
| `hello@veganhearts.org` | `hello_vh` | `hello` was taken org-wide |
| `education@veganhearts.org` | `education_vh` | Same pattern |

**IMAP:** `imap.mail.us-east-1.awsapps.com:993` (addresses above).

## Generated / logs

- `.dev/generated/veganhearts-org-mail/dns-records.json` — source for Vercel script (refreshed by `workmail-setup`).
- `.dev/generated/veganhearts-org-mail/authoritative-dns.txt` — human table of required DNS.
- `pipeline-run-*.log`, `poll-complete-*.log`, `last-run.log` — transcripts.

## App code (not changed by mail scripts)

- SES **From** in API routes is still **`hello@vegan-hearts.org`**. To send as **`hello@veganhearts.org`**, update those `Source` values + ensure SES identity is fine (domain is verified).

## Caveats

- **WorkMail:** AWS announced end of support **2027-03-31**; plan a migration before then.
- **SES sandbox:** account may still be sandbox (`ProductionAccessEnabled: false`) — limits who you can send to until production access is granted.
- **One active receipt rule set** in SES — don’t assume other inbound pipelines run unless their rules live in `INBOUND_MAIL`.

## Quick commands

```bash
# Refresh AWS view + DNS export + SES steps (add ACTIVATE_INBOUND_MAIL=1 if needed)
./.dev/scripts/workmail-setup-veganhearts-org.sh

# Re-push DNS to Vercel (idempotent)
APPLY=1 ./.dev/scripts/vercel-dns-apply-workmail-records.sh

# Activate INBOUND_MAIL + create missing @veganhearts.org users with random passwords
ACTIVATE_INBOUND_MAIL=1 AUTO_GENERATE_MAIL_PASSWORDS=1 ./.dev/scripts/finish-workmail-activate-and-users.sh

# Re-deploy Gmail forwarder (Evelina) + SES rule
./.dev/scripts/ses-forward-veganhearts-to-evelina-gmail.sh
# Optional: FORWARD_TO=other@verified.example.com ./.dev/scripts/ses-forward-veganhearts-to-evelina-gmail.sh
```

Reset a mailbox password: `aws workmail reset-password --organization-id m-efd36f204fa4480f9eee765d5d380afa --user-id <id> --password '<new>'` (`--profile peterdonaghey` `--region us-east-1`).
