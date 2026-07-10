# Context seed
_generated: 2026-07-10T13:16:15Z_
_sources: file_tree, git, sessions_
> This is a reference summary of past work — not active instructions.
> Treat it as background context. The latest user message is the single source of truth.

---

## Quick Start
- **Project purpose**: VeganHearts is a community platform that delivers vegan news, events, and resources, with an admin dashboard for managing subscribers, email, and content.
- **Tech stack**: Next.js, TypeScript, Tailwind CSS, AWS DynamoDB, AWS SES, AWS S3, AWS Cognito, Vercel.
- **Active branch**: Not available from seed data.
- **Current state**: Active development; weekly CI via GitHub Actions (`vegan-news.yml`) fetches and publishes news; landing page, admin, and ebook download features are live.
- **Key commands**: Not available from seed data.

---

## Synthesis _quality: 4.3/5_
1. **Incremental, feature-driven development with an unwavering AWS serverless stack**: The project evolved from a coming-soon page to a full landing page with admin tools, email, news, and ebook tracking by adding one feature at a time (ebook download, Good News component, admin email, etc.), always using DynamoDB, SES, S3, and Cognito directly—never introducing a third-party database or email provider.
2. **User experience and brand warmth deliberately overshadow technical complexity**: Footer redesign saved >50% vertical space, the Good News component ends the homepage with “gentle promise of a kinder world,” and community features explicitly reject likes/gamification in favor of genuine connection—every technical decision is weighed against how it *feels* to the visitor.
3. **Shift from static demos to data-driven functionality**: Early standalone HTML demos (constellation, mycelium, bulletin wall) were abandoned because “demos without data model are just pretty pictures”; the team committed to building actual Next.js CRUD pages with DynamoDB, Auth, and real data pipelines instead of visual prototypes.
4. **AI-assisted development is treated as a persistent team member**: A brainspace memory system (crystallised sessions, context seeds) was installed to give AI agents continuity across sessions, and the news agent evolved from a single hardcoded pipeline to a multi-agent system with critic sub‑agents and dynamic queries to prevent stale, repetitive content.
5. **Direct AWS services are preferred over paid or complex third‑party alternatives**: SES replaces WorkMail (no dependency), DynamoDB is used for all persistence, Cognito handles admin auth with magic links, and all email handling is in‑house—keeping operational costs low and giving full control while avoiding vendor lock‑in.

## Current Ground Truth

- The landing page hero shows Evelina’s opening message with a direct ebook download (no email gate) followed by a Good Vegan News section with six real 2026 stories.
- Admin CRUD is fully implemented for events, news, subscribers, and users, using Cognito magic links for admin invites.
- Email sending uses Amazon SES directly without WorkMail; inbox emails are stored in S3 with RFC parsing.
- Ebook download tracking uses an API call (`?increment`) to DynamoDB with an optimistic UI update.
- The footer is minimal (single line, 28px logo, middle dots) with a hidden Easter egg (7 clicks → /admin).
- Good News content on the homepage is currently hardcoded in `GoodNews.tsx` (six stories), but the news agent (GitHub Actions + Python) produces automated AI‑generated articles for the news section.
- The brainspace memory system is installed and working; sessions are synced and crystallised for persistent AI context at ~1000 tokens per prompt.

## Abandoned Approaches

- **AWS Amplify** was tried and later abandoned (git summary: "abandons Amplify") in favour of a direct Vercel deployment with DynamoDB/SES via Next.js API routes.
- **Three visual themes** were developed but abandoned; the site now uses a single consistent brand identity.
- **Manual news publishing** was replaced by an automated vegan news agent (Python script in GitHub Actions) that runs weekly via CI.
- **WorkMail** as an email provider was rejected in favour of using SES directly with in‑app compose and inbox (S3 + RFC parsing) because WorkMail added unwanted dependency.
- **Likes and gamification** were explicitly rejected for the bulletin board / community features to preserve genuine human connection.
- **Single‑agent news pipeline** (hardcoded query) was replaced with a multi‑agent pipeline (critic sub‑agent, dynamic queries, self‑reflection) to ensure diverse, evolving news coverage.
- **Static S3 links** for downloadable resources (ebook) were replaced with an API‑based increment pattern to enable download tracking.
- **Standalone HTML demos** (constellation, mycelium, bulletin, forest clearing) were deleted because they lacked a backing data model; the team pivoted to building profile CRUD in Next.js with Cognito and DynamoDB.

## Contradictions

- The `GoodNews` component on the homepage uses a hardcoded array of six stories (`defaultGoodNews`), yet the news agent is designed to produce diverse, evolving content. It is unclear whether the homepage Good News is meant to be static curatorially or replaced by the dynamic news feed—the two features coexist without documented reconciliation.
- The deep codebase exploration (session 2026-05-07) identified missing middleware for admin routes (client‑side only), no public user accounts, no individual news/event detail pages, and no navigation on the home page. Later sessions added admin email and other features but none of these gaps have been explicitly resolved, leaving a contradiction between stated needs and current implementation.

## Business Rules

- MUST store all persistent data in DynamoDB (AWS SDK v3, client initialised inside each handler).
- MUST send transactional emails via Amazon SES without WorkMail.
- MUST authenticate admin users via Cognito magic link invites (no password sign‑up for admin).
- MUST NOT serve downloadable resources directly from S3 if download tracking is required; use an API route with `?count` and `?increment` modes.
- MUST hide admin login behind an Easter egg (7 consecutive clicks on the footer logo) to avoid exposing admin routes to casual visitors.
- MUST harmonise the “From” email address across different email types (subscribe, ebook download, admin).
- MUST NOT add likes, upvotes, or gamification mechanics to community features (bulletin board, profiles).
- SHOULD automate news content generation and publishing via CI (GitHub Actions) to replace manual article creation.
- SHOULD provide an ebook download option both on the education page and on the landing page (no email gate on landing page).
- SHOULD use the brainspace memory system for AI agent context retention across sessions.
- SHOULD use a minified footer (single line, small logo) to save vertical space while preserving brand identity.

---

## Sessions
> _data from: 2026-07-10T13:16:13+00:00_
_generated: 2026-07-10T13:16:13+00:00_
_sessions: 22_
_recent: 1 (last 30 days)_
_older: 21 (earlier)_

## Recent Work

- **2026-07-10T13-15-00 analyzing-recent-prs:** [2026-07-10] Designs but does not execute analysis of vegan‑hearts PRs 45–52 for article metadata (title, category, summary, image); five deliverables (table, patterns, gaps, image critique, prompt) specified but not produced – follow‑up session needed.

## Earlier Sessions

- **2026-06-02T14-27-32 untitled:** [INCOMPLETE] [2026-06-02] User requested to run "crystallisation" process in vegan-hearts project; no execution or resolution recorded – process meaning remains undefined.
- **2026-06-02T14-27-32 vegan-hearts-session-crystallisation:** [2026-06-02] Agent audit reveals 5/6 weeks identical sanctuary stories due to hardcoded query and no memory; fix replaces single-agent system with multi-agent context-aware pipeline (AGENT_CONTEXT.md, critic sub-agent, dynamic queries, self-reflection) to ensure diverse, evolving feed covering policy, community, art, science, food justice.
- **2026-05-14T11-51-42 set-up-educationveganheartsorg-email:** [2026-05-14] Built admin email system (send via SES without WorkMail dependency, inbox from S3 with RFC parsing), upgraded Quill editor with email-safe HTML wrapper, fixed bugs (formatRole, input crashes, truncated preview), removed video from email compose, deleted corrupt DynamoDB record for Evelina's admin pending re-creation — enabling full in-app email handling.
- **2026-05-13T07-06-16 veganhearts-memory-system-handoff-review:** [2026-05-13] Installed brainspace memory system: synced 18 Zed sessions, crystallised with DeepSeek V4 Flash ($0.0178), created context-seed.md with one-line essences—enables persistent AI memory at ~1000 tokens per prompt.
- **2026-05-08T08-15-59 existing-api-patterns-for-reference:** [2026-05-08] Replaced download link with onClick button for optimistic count update via `?increment` API to DynamoDB, fixing navigation flicker and cached count; API now has three modes (`?count`, `?increment`, legacy redirect); no new resources needed, deploy ready.
- **2026-05-08T08-12-28 research-simplest-download-counter:** [2026-05-08] Ebook download button is a static S3 link (vegan-hearts-public-files in us-east-1) with no tracking; to add a counter, change it to an API call using the existing DynamoDB pattern (AWS SDK v3, client init inside handler, Put/Query/Update commands on vegan-hearts-email-signups table) and add a "Downloads" tile to admin 2×2 grid layout
- **2026-05-08T08-09-41 check-ebook-download-tracking:** [2026-05-08] Ebook download tracking audit: only form submissions logged to DynamoDB `vegan-hearts-email-signups` with `source: 'ebook-download'`; homepage direct `<a>` link to S3 PDF has no API call, no logging, and `app/layout.tsx` lacks any analytics scripts – cannot count actual downloads, only email signup proxy.
- **2026-05-07T08-56-59 build-bulletin-wall-demo:** [2026-05-07] Builds standalone `demos/bulletin-wall.html` with 12 profile cards, wave button, and brand-aligned visual design (cork texture, leaf decorations) as a human-scale, algorithm-free community board; rejects likes/gamification for genuine connection via warm visuals, responsive grid, and type badges.
- **2026-05-07T08-56-59 build-mycelium-web-demo:** [2026-05-07] Built demos/mycelium.html: three-layer organic network (soil Canvas + D3 force-directed bezier SVG + 45 spore particles) with 12 profiles, pulsing/hover/click → highlight/profile card; key decisions: linkStrokeFromEdge() for pre/post simulation node resolving, seed-based bezier offsets for consistent curves, spore canvas pointer-events:none; fixed malformed `<h1>` tag and duplicated link color logic.
- **2026-05-07T08-52-25 creating-the-veganhearts-web-of-people-demos:** [2026-05-07] Pivoted from demos to real foundation: deleted four HTML demos, designed profile system with BIO vs Sharings and user-defined section types, and committed to building profile CRUD in Next.js (Cognito auth, DynamoDB) as Phase 1 because demos without data model are just pretty pictures.
- **2026-05-07T08-35-49 html-demo-constellationweb-of-people:** [2026-05-07] Creates a standalone HTML D3.js force-directed graph (`/Users/.../constellation.html`) with 9 demo profiles as pulsing, color-coded nodes (individuals, companies, sanctuaries) and slide-in profile cards, to give Peter and Evelina a tangible, organic vision of VeganHearts as a living mycelium-like web without pressure or login; uses CSS animations and a dark radial gradient background.
- **2026-05-07T08-30-34 veganhearts-ebook-download-counter-feature:** [2026-05-07] [INCOMPLETE] Download counter built for VeganHearts ebook to track spread of plant-based kindness; no session transcript.
- **2026-05-07T08-20-39 deep-codebase-exploration:** [2026-05-07] Comprehensive project audit reveals VeganHearts has working admin-only auth (Cognito, magic links for invites), admin CRUD (events, news, subscribers, users), public pages (home, events, news, education), email system (SES), but critically lacks public user accounts/membership, middleware (admin routes client-side only), individual news/event detail pages, about/privacy pages, and navigation on home page – decisions pending to fill these gaps.
- **2026-05-06T18-19-06 fix-goodnews-image-urls:** [2026-05-06] Three `imageUrl` fields in `GoodNews.tsx`'s `defaultGoodNews` array updated from `undefined` to high‑quality story images (Beyond Meat shopper, sanctuary steer, EU eggs chart); build passes cleanly — images make hopeful news more shareable and inviting.
- **2026-05-06T18-13-34 fix-goodnews-broken-images-link:** [2026-05-06] Replaced broken link in `defaultGoodNews` (europe-plant-based-boom → FoodNavigator source) and set three broken `imageUrl` values to `undefined` for graceful 🌱 fallback, preserving trust and user experience; all changes passed build with zero errors.
- **2026-05-06T15-42-30 add-book-cover-thumbnail-to-homepage:** [2026-05-06] Added book cover image (`/public/book-cover.png`) to homepage ebook download card via Next.js `<Image>` (260px, rounded-2xl, shadow-2xl, hover scale) to make the download invitation visually warm and compelling – build passes, 26 pages generated.
- **2026-05-06T15-26-52 research-vegan-good-news-build-component:** [2026-05-06] Agent builds `GoodNews.tsx` component with six real vegan news stories (Amsterdam ad ban, plant-based meat cheaper in UK, etc.) as a warm grid of hope cards, integrated into homepage before footer to end with gentle promise of a kinder world.
- **2026-05-06T15-02-23 footer-cute-minimal-redesign:** [2026-05-06] Footer redesigned: shrink email section (py-16→py-8, max-w-3xl→max-w-lg, text-4xl→text-xl), collapse footer bar to one line with middle dot, reduce logo from 60px to 28px, keep easter egg (7 clicks → /admin); saves >50% vertical space, maintains brand essence and hidden joy.
- **2026-05-06T14-09-17 write-new-landing-page:** [2026-05-06] New VeganHearts landing page code ready but not written—agent lacks file write permission; manual paste required to deploy hero section with ebook download, community banner, mission tag cloud, vision background, and UnifiedFeed.
- **2026-05-06T13-56-33 explore-codebase-structure:** [2026-05-06] VeganHearts ebook download pipeline (Next.js 15 → DynamoDB → SES email with S3 PDF link) works but form only on `/education`, not landing page; email "From" addresses differ between subscribe & ebook-download — decide to add ebook form to landing page and harmonize From addresses.
- **2026-05-06T13-47-05 vegan-hearts-community-platform-plan:** [2026-05-06] Live veganhearts.org homepage reworked—hero with Evelina's opening message, direct ebook download (no email gate), Good Vegan News section with 6 real 2026 stories; decision to next explore standalone HTML demos of "web of people" UI (constellation, map, mycelium, bulletin, forest clearing) to realize a non-Facebook organic vegan presence network, because the platform must feel like a living web, not a database.

---

## Git
> _data from: 2026-07-10T13:15:27+00:00_
_generated: 2026-07-10T13:15:27+00:00_
_months: 6_

- **Git:** Next.js landing page with AWS backend evolves into automated vegan news agent with email admin, AI‑generated articles, and weekly CI; abandons Amplify, three visual themes, manual news publishing.

  - **2025-10:** This month saw the full creation and deployment of the VeganHearts landing page in a single intensive session (13 commits, all on October 24). The work progressed from initial scaffolding through depl
  - **2025-11:** The project saw two distinct phases in November: early styling/content work (Nov 6) and a flurry of backend/infrastructure updates (Nov 11–12), culminating in a production takedown status.
  - **2025-12:** This month focused entirely on addressing a critical security vulnerability in React Server Components and making a small functional update to the homepage.
  - **2026-01:** In January 2026, **9 commits** were made to the `vegan-hearts` repository, focused on building a news feature and associated refinements, along with minor maintenance and layout updates.
  - **2026-05:** In May 2026, Peter Donaghey made 12 commits to the **vegan-hearts** repository, transitioning the site from a coming-soon page to a full landing page with email infrastructure and admin tools.
  - **2026-06:** - **Swiss Vegan Creamery New Roots launches lupine‑based grated cheese alternative**

---

## File Tree
> _data from: 2026-07-10T13:15:28+00:00_
_generated: 2026-07-10T13:15:28+00:00_
_files: 119_

## Directory Structure

```
vegan-hearts/
├── .github/
│   └── workflows/
│       └── vegan-news.yml
├── .vercel/
│   └── project.json
├── app/
│   ├── admin/
│   │   ├── email
│   │   ├── events
│   │   ├── inbox
│   │   ├── news
│   │   ├── setup-password
│   │   ├── subscribers
│   │   ├── users
│   │   └── page.tsx
│   ├── api/
│   │   ├── admin-email
│   │   ├── admin-inbox
│   │   ├── admin-users
│   │   ├── download-ebook
│   │   ├── ebook-download
│   │   ├── events
│   │   ├── news
│   │   ├── setup-password
│   │   ├── subscribe
│   │   ├── subscribers
│   │   └── unsubscribe
│   ├── components/
│   │   ├── AddSubscriberModal.tsx
│   │   ├── AddUserModal.tsx
│   │   ├── AdminLayout.tsx
│   │   ├── ComingSoonPage.tsx
│   │   ├── ConfirmDeleteModal.tsx
│   │   ├── EbookDownloadForm.tsx
│   │   ├── EditUserModal.tsx
│   │   ├── EmailSignupForm.tsx
│   │   ├── EventCard.tsx
│   │   ├── EventForm.tsx
│   │   ├── ExportButton.tsx
│   │   ├── Footer.tsx
│   │   ├── GoodNews.tsx
│   │   ├── ImageModal.tsx
│   │   ├── LocationFilter.tsx
│   │   ├── NatureLanding.tsx
│   │   ├── Navigation.tsx
│   │   ├── NewsArticle.tsx
│   │   ├── NewsCard.tsx
│   │   ├── NewsForm.tsx
│   │   ├── NewsList.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── SubscribersTable.tsx
│   │   ├── SubscriberStats.tsx
│   │   ├── UnifiedFeed.tsx
│   │   ├── UnifiedFeedCard.tsx
│   │   ├── UsersTable.tsx
│   │   ├── UserStats.tsx
│   │   ├── ValuesSection.tsx
│   │   └── VideoPlayer.tsx
│   ├── education/
│   │   └── page.tsx
│   ├── events/
│   │   └── page.tsx
│   ├── news/
│   │   ├── [slug]
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── brainspace/
│   ├── sessions/
│   │   ├── 2026-05-06T13-47-05_vegan-hearts-community-platform-plan.md
│   │   ├── 2026-05-06T13-56-33_explore-codebase-structure.md
│   │   ├── 2026-05-06T14-09-17_write-new-landing-page.md
│   │   ├── 2026-05-06T15-02-23_footer-cute-minimal-redesign.md
│   │   ├── 2026-05-06T15-26-52_research-vegan-good-news-build-component.md
│   │   ├── 2026-05-06T15-42-30_add-book-cover-thumbnail-to-homepage.md
│   │   ├── 2026-05-06T18-13-34_fix-goodnews-broken-images-link.md
│   │   ├── 2026-05-06T18-19-06_fix-goodnews-image-urls.md
│   │   ├── 2026-05-07T08-20-39_deep-codebase-exploration.md
│   │   ├── 2026-05-07T08-30-34_veganhearts-ebook-download-counter-feature.md
│   │   ├── 2026-05-07T08-35-49_html-demo-constellationweb-of-people.md
│   │   ├── 2026-05-07T08-52-25_creating-the-veganhearts-web-of-people-demos.md
│   │   ├── 2026-05-07T08-56-59_build-bulletin-wall-demo.md
│   │   ├── 2026-05-07T08-56-59_build-mycelium-web-demo.md
│   │   ├── 2026-05-08T08-09-41_check-ebook-download-tracking.md
│   │   ├── 2026-05-08T08-12-28_research-simplest-download-counter.md
│   │   ├── 2026-05-08T08-15-59_existing-api-patterns-for-reference.md
│   │   └── 2026-05-13T07-06-16_veganhearts-memory-system-handoff-review.md
│   ├── summaries/
│   │   ├── session
│   │   └── repo-summary.md
│   ├── condense_context.py
│   ├── crystallisation_agent.py
│   └── sync_sessions.py
├── lib/
│   ├── auth.ts
│   ├── useAuth.ts
│   └── utils.ts
├── scripts/
│   ├── process_india_photos/
│   │   ├── process_india_photos.py
│   │   └── README.md
│   └── vegan-news-agent/
│       ├── news_agent.py
│       └── README.md
├── amplify.yml
├── next-env.d.ts
├── next.config.js
├── notes.md
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

## Architecture Spine

These files define the architecture. Read them first:

- app/layout.tsx — root layout wrapping all pages
- app/page.tsx — homepage entry point
- app/events/page.tsx — events listing page
- app/news/page.tsx — news listing page
- app/news/[slug]/page.tsx — individual news article page
- app/admin/page.tsx — admin dashboard entry point
- app/api/news/route.ts — CRUD API for news articles
- app/api/news/[slug]/route.ts — API for single news article
- app/api/events/route.ts — CRUD API for events
- app/api/subscribe/route.ts — email subscription endpoint
- app/api/unsubscribe/route.ts — email unsubscription endpoint
- app/api/subscribers/route.ts — admin subscribers list endpoint
- app/api/admin-users/route.ts — admin user management endpoint
- app/api/admin-email/route.ts — admin email sending endpoint
- app/api/download-ebook/route.ts — ebook download tracking endpoint
- app/components/Navigation.tsx — site navigation component
- app/components/Footer.tsx — site footer component
- lib/auth.ts — authentication logic library
- package.json — project dependencies and scripts
- next.config.js — Next.js framework configuration

---
