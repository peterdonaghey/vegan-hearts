# vegan-hearts
_scope: 18 sessions_
_crystalised: 2026-05-13T08:36:28+00:00_

# 🌱 VeganHearts: The Oracle’s Synthesis

## What We Built

VeganHearts evolved from a stalled email-gated ebook page into a **warm, open community landing page** — and laid the foundation for a genuine “Web of People.” The core deliverables are:

- **Homepage overhaul** – replaced dead `NatureLanding` with a hero section featuring a mountain sunset, ebook card with book cover thumbnail, direct download (no email gate), a download counter, and a “Good Vegan News” bulletin board with 6 verified stories.
- **Good Vegan News component** – responsive card grid with graceful image fallback, brand colors, and hardcoded real news items (policy wins, market growth, sanctuary milestones).
- **Ebook download counter** – single DynamoDB item (`email = "__download_counter__"`) updated via `ADD` on each download. API supports read-only, increment, and redirect modes. Optimistic UI updates.
- **Admin dashboard** – full CRUD for events, news, subscribers, admin users. Protected by Cognito JWT verification. Magic-link password setup for new admins.
- **Password-less invite flow** – 32-byte token stored in DynamoDB (24h expiry), SES email with setup link, client-side password validation.
- **Footer redesign** – compact, reduced by >50% vertical space, combined copyright line with tagline, preserved 7-click easter egg to `/admin`.

## Architecture Patterns

| Layer | Decision | Why |
|-------|----------|-----|
| **Auth** | Cognito + JWT verification (`aws-jwt-verify`) | Admin-only access; no public user accounts yet. |
| **Database** | Single DynamoDB table `vegan-hearts-email-signups` (PK: email, SK: timestamp) | Simple schema, single table for multiple use cases (email signups, ebook counter, tokens). |
| **Email** | SES transactional (welcome, ebook, admin invite), SESv2 contact list (`veganhearts-subscribers`), WorkMail forwarding | Three distinct flows; from addresses inconsistent (`hello` vs `info`, hyphen vs no-hyphen domains). |
| **Deployment** | Vercel serverless | Fast builds, no server management; all AWS infra configured via shell scripts in `.dev/`. |
| **Styling** | Tailwind CSS + custom brand tokens (`vh-orange #ed8329`, `vh-green #39713b`, bg `#FFFAF1`) | Consistent, warm earth tones; fonts Quicksand (display) + Inter (body). |
| **Demos** | Standalone HTML files (constellation, bulletin wall, mycelium) | Explored visual concepts for “Web of People” before committing to build. All demos deleted post-evaluation. |

## Bugs & Gotchas

1. **Dead early return in `page.tsx`** – The original hero layout sat below a `return <NatureLanding />` on line 16, making the entire section unreachable. Fixed by replacing the component.
2. **Broken images in GoodNews** – 3 of 6 original stories had dead image URLs. Replaced with verified sources and added a 🌱 fallback component.
3. **Inconsistent `From` addresses** – `api/ebook-download` uses `info@veganhearts.org`, while `api/subscribe` uses `hello@vegan-hearts.org`. Different domains (with/without hyphen).
4. **Environment variable trimming** – Several API routes apply `.trim()` to AWS credentials, suggesting newline characters from copy-paste.
5. **`edit_file` tool fragility** – Failed when JSON had emoji or special characters; required reading file fresh before editing; once failed outright due to missing `mode` field.
6. **WorkMail EOL 2027** – AWS plans to discontinue WorkMail; email forwarding will need migration.
7. **No middleware for admin routes** – Admin pages are only client-side protected; API routes verify JWT server-side, but page-level route protection isn't implemented.
8. **Ebook download counter fallback dead code** – `UpdateCommand` with `ADD` already creates the item from 0, making the separate `PutCommand` fallback unnecessary.

## Mission-Aligned Decisions

- **Zero-friction ebook** – Removed email gate entirely. Founder Evelina wanted immediate access: “Every download spreads compassion.” Counter is purely informational, not a metric to optimize.
- **No likes, no algorithms** – The “Web of People” design explicitly avoids gamification. Profiles are optional (name only required). Sharings flow chronologically into a community notice board, not a feed optimized for engagement.
- **Warm, inclusive tone** – Homepage text: “You’re already part of the vegan family. Every single one of us.”
- **Open door** – No signup required to browse the landing page, good news, or future map. Presence without passwords.

## What Matters Most

**Technically:** A small but robust Next.js app with AWS backend, admin tools working, ebook delivery simplified to one click, download tracking in place. Infrastructure is documented but manually scripted – a single source of truth for AWS resources would reduce risk.

**Humanly:** The founder’s dream is now tangible. Two visitors downloaded the ebook in the first week. The community landing page feels alive. The demos of the mycelium network, bulletin wall, and constellation proved that connection can be beautiful without being extractive.

**Next horizon:** The “Web of People” – profiles, sharings, map – is the logical extension. The design document is written. The DynamoDB schema is ready. Build Phase 1: profile creation with BIO sections. Use magic-link auth for public users. Keep it simple. Keep it warm. No likes. Just us.
