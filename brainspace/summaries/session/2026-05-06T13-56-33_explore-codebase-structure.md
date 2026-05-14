## Session Summary: VeganHearts Codebase Exploration

### Context

The session was a deep‑dive codebase review of the **VeganHearts** project, triggered by a user request to understand the project’s architecture, email flows, ebook delivery, and landing page. The agent systematically explored directories, read all key files (pages, API routes, components, scripts, docs), and produced a comprehensive synthesis.

---

### What Was Discovered

#### 1. Project Structure

- **Next.js 15** with App Router, deployed on **Vercel** (serverless).
- Tailwind CSS with a custom earth‑tone palette (`vh-green`, `vh-orange`, `bg-[#FFFAF1]`).
- AWS infrastructure scattered across `.dev/scripts/` – 18+ numbered shell scripts covering GitHub repo, Amplify (now deprecated), Vercel switch, DynamoDB, SES, Cognito, S3, WorkMail.
- Two domains:  
  - `vegan-hearts.org` (with hyphen) – legacy, website domain (used for landing page).  
  - `veganhearts.org` (no hyphen) – canonical mail domain, DNS on Vercel.  
- Lambda `VeganHeartsForwarder` in `.dev/lambda/email-forwarder/` – SES → S3 → Lambda → Gmail.

#### 2. Landing Page – A Surprising State

- **`app/page.tsx`** has an early `return <NatureLanding />` on line 16. The entire original hero section (with hero image, mission, vision, image collage, unified feed) sits below the return and is **dead code**.
- **`NatureLanding`** is an interactive image‑based navigation using SVG hotspots over `nature-backdrop.jpeg`. Clicking hotspots (Home, Education, Free E-book, Contact) slides in content panels.  
  - The “Free E-book” hotspot shows only descriptive text – **no download form, no email capture**.
- The `ComingSoonPage` component exists but is unused.

#### 3. Ebook Download Flow

- **Path:** User fills name + email on `/education` → `POST /api/ebook-download`.
- **Backend API (`/app/api/ebook-download/route.ts`):**
  - Validates inputs.  
  - Queries DynamoDB table `vegan-hearts-email-signups` (PK `email`, SK `timestamp`).  
  - If new: inserts record with `source: 'ebook-download'`.  
  - If re‑subscribing: updates `unsubscribed` flag.  
  - If already active: skips DB write (no duplicate).  
  - Adds to SESv2 contact list `veganhearts-subscribers` (catches `AlreadyExistsException`).  
  - Sends HTML email via SES containing a direct S3 download link to `https://vegan-hearts-public-files.s3.us-east-1.amazonaws.com/ebooks/awakening-your-vegan-heart-21-days.pdf`.
- **From address:** `info@veganhearts.org` (no hyphen) – **inconsistent** with the subscribe API which uses `hello@vegan-hearts.org`.

#### 4. Email System

| Purpose | API/Script | Service | From Address |
|---|---|---|---|
| Welcome email (subscribe) | `/api/subscribe` | SES | `hello@vegan-hearts.org` |
| Ebook delivery | `/api/ebook-download` | SES | `info@veganhearts.org` |
| Unsubscribe confirmation | `/api/unsubscribe` | SES + HTML page | `hello@vegan-hearts.org` (in error) |
| Inbound forwarding | Lambda `VeganHeartsForwarder` | SES inbound → S3 → Lambda → Gmail | `hello@veganhearts.org` or `education@veganhearts.org` |
| WorkMail mailboxes | `.dev/scripts/workmail-setup-...` | AWS WorkMail | `hello@veganhearts.org`, `education@veganhearts.org` |

- **SES sandbox:** Account may still be in sandbox mode (`ProductionAccessEnabled: false`), limiting sending to verified addresses.
- **WorkMail EOL 2027:** AWS plans to discontinue WorkMail. A migration plan will be needed.

#### 5. Authentication & Admin

- **Cognito** for admin authentication.  
- **JWT verification** via `aws-jwt-verify` in `lib/auth.ts`.  
- **Admin dashboard** at `/admin` with sub‑pages for events, news, subscribers, users, password setup.  
- **Easter egg entry:** 7 clicks on footer logo navigates to `/admin`.

#### 6. Known Issues & Gotchas

| Issue | Detail |
|---|---|
| **Dead early return** in `page.tsx` | Original hero layout completely unreachable. |
| **No ebook capture on landing** | `NatureLanding` ebook section has no form. |
| **Inconsistent `From` addresses** | `hello` vs `info` on different domains. |
| **PDF file in project root** | `Awakening your Vegan Heart.pdf` must be manually re‑uploaded to S3 after changes. |
| **No rate limiting / CSRF** | Subscribe and ebook endpoints lack protection. |
| **Env vars may have trailing whitespace** | `.trim()` calls suggest a previous bug. |
| **WorkMail imminent end‑of‑life** | Requires migration before 2027. |

---

### Key Technical Details

- **DynamoDB table:** `vegan-hearts-email-signups` (schema: `email` PK, `timestamp` SK, plus `name`, `source`, `unsubscribed`, `signupDate`, `unsubscribedAt`).
- **SESv2 contact list:** `veganhearts-subscribers`.
- **S3 buckets:**  
  - `vegan-hearts-public-files` – public ebooks, images.  
  - `vegan-hearts-assets` – event/news images (referenced in `next.config.js`).  
  - `vegan-hearts-email-storage` – raw emails for the forwarder Lambda.
- **Lambda forwarder** picks a verified source based on original destination (e.g., if destination includes `education@veganhearts.org`, it replies as `education@veganhearts.org`).
- **IAM permissions** are set up via `08_create_iam_user.sh` and `09_fix_iam_permissions.sh`.

---

### What Matters Most

- **Mission:** spread compassion through vegan education. The ebook and email signup are the primary conversion funnels – they must work flawlessly.
- **Infrastructure complexity:** AWS services are manually wired together (DynamoDB, SES, Cognito, S3, Lambda). Scripts in `.dev/` are the only documentation. Any deployment change requires re‑running these scripts.
- **Maintenance alert:** the early return and unused components suggest a need for cleanup before adding new features.
- **Next UX improvement:** placing the ebook download form directly on the landing page (inside `NatureLanding` or in the original hero layout) would reduce friction.

The session ended with a clear, actionable map of the codebase – exactly what the user needed to continue development confidently.