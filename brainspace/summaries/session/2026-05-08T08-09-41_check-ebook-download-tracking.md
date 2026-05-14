## Ebook Download Tracking Investigation

### 1. The API Route (`/app/api/ebook-download/route.ts`)

**It does log (to DynamoDB), write to both DynamoDB and SESv2, and send transactional email via SES.**

The route:
- Expects `{ name, email }` in POST body.
- Validates inputs.
- **Checks if email already exists** in `vegan-hearts-email-signups` table (QueryCommand).
- If email exists, it updates the existing record’s `lastEbookDownload` timestamp.
- If email is new, it **creates a new DynamoDB item** with:
  - `email` (primary key)
  - `timestamp` (range key, current time)
  - `signupDate` (ISO string)
  - `source` set to `'ebook-download'`
  - `name`
  - `lastEbookDownload` timestamp
- It then sends a **transactional email** via SES with the ebook download link.
- It also uses **SESv2 CreateContact** to add the subscriber to your mailing list contact list (if not already there).

**Key data stored in DynamoDB:**
```json
{
  "email": "user@example.com",
  "timestamp": 1729782000000,
  "signupDate": "2025-10-24T14:00:00.000Z",
  "source": "ebook-download",
  "name": "User Name",
  "lastEbookDownload": 1729782000000
}
```

---

### 2. DynamoDB table `vegan-hearts-email-signups` usage

The table is used by:
- `app/api/ebook-download/route.ts` → writes/reads records with source `'ebook-download'`.
- `app/api/subscribe/route.ts` → writes records with source `'landing-page'`.
- `app/api/admin/subscribers/route.ts` → queries and aggregates by source (including `ebook-download`).
- `app/api/unsubscribe/route.ts` → updates `unsubscribed` flag.
- Several Lambda functions in `.dev/lambda/` for email forwarding.

The admin dashboard (`/admin/subscribers`) shows a filter that includes `Ebook` source.

**No S3 access logs or CloudFront logs are configured** – download counting relies *entirely* on the API call completing successfully.

---

### 3. Analytics scripts

**None found.**  
- `app/layout.tsx` contains only font and metadata definitions – **no Plausible, Google Analytics, Vercel Analytics, or any other third‑party script.**
- No `<Script>` tags or `next/script` analytics snippets anywhere in the codebase.
- No reference to `plausible`, `gtag`, `gtm`, `GA4`, `vercel/analytics` in any `.tsx`, `.ts`, or `.js` file.

---

### 4. Documentation in `.dev/documentation/`

- `API-STATUS.md` – describes the subscribe API; no mention of ebook‑download tracking.
- `EMAIL-SYSTEM-SETUP.md` – details DynamoDB schema, mentions `source` field.
- No analytics documentation exists.

---

### 5. Query DynamoDB from a script

**No existing query script in `.dev/scripts/`.**  
The scripts there are for infrastructure creation (DynamoDB table, IAM user, SES, etc.).  
You can query the table manually using the AWS CLI:

```bash
aws dynamodb scan \
  --profile peterdonaghey \
  --region us-east-1 \
  --table-name vegan-hearts-email-signups \
  --filter-expression "#source = :sourceVal AND #ts BETWEEN :start AND :end" \
  --expression-attribute-names '{"#source": "source", "#ts": "timestamp"}' \
  --expression-attribute-values '{
    ":sourceVal": {"S": "ebook-download"},
    ":start": {"N": "1746576000000"},
    ":end": {"N": "1747180799999"}
  }'
```
(Replace timestamps with last week’s range in epoch milliseconds.)

---

### 6. Is the API still being called?

**Partially true, but misleading.**  
- The **homepage** (`app/page.tsx`) does **not** include any ebook download form or direct link.  
- The **education page** (`/education`) uses `<EbookDownloadForm />`, which **does** POST to `/api/ebook-download`.  
- So the API is **still active** for visitors who reach the education page (e.g., via the “Free Ebook” button in the navigation).

Your hypothesis that “the current ebook download is just a direct `<a>` link to the S3 PDF” is **only true if you removed the form from the homepage and possibly added a direct download link elsewhere** – but the education page still uses the API.  
If you want to count downloads **accurately**, you must only count DynamoDB records where `source: 'ebook-download'` and `timestamp` is in the last week – *because every successful API call creates that record*.

---

### ✅ Answer to your questions

| Question | Answer |
|----------|--------|
| Does the API log to DynamoDB? | **Yes** – writes `source: 'ebook-download'` with name, email, timestamp. |
| Can we count downloads from last week? | **Yes** – scan the table for `source = 'ebook-download'` and `timestamp` within the date range. |
| Any analytics scripts? | **None.** |
| Is the API still used? | **Yes** – on the `/education` page via `EbookDownloadForm`. |
| Direct `<a>` link on homepage? | **No** – the homepage has no ebook download element at all. |

You can get a precise download count from DynamoDB right now.