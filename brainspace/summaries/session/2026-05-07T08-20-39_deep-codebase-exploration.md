## Session Summary: Deep Codebase Exploration of VeganHearts

You asked me to thoroughly explore the VeganHearts project—every auth file, page, component, brand token, DynamoDB table, email flow, and any existing "people" or "profile" code. I used directory listings, file reads, grep searches, and terminal commands across the entire codebase. Here's what we learned.

### What You Have (and What's Working)

**Auth System**
- Admin-only authentication using AWS Cognito (user pool + client ID).  
- Client-side JWT expiration check (`useAuth.ts`); server-side verification via `aws-jwt-verify` (`lib/auth.ts`).  
- Login form lives inside `AdminLayout.tsx`—it renders the login screen when unauthenticated, then stores the access token.  
- **Magic link flow** exists for admin invite/password reset. An existing admin creates a user, a 32-byte token is stored in DynamoDB (`vegan-hearts-password-tokens`, 24h expiry), and an SES email with a setup link is sent. The user sets a password (validated client-side) via `/admin/setup-password?token=xxx`.  
- Password reset uses the same token mechanism.  
- **No public user auth**—no accounts, no profiles, no registration for end users.

**Admin Dashboard & Pages**
- Dashboard (`/admin`) with four tiles: Events, News, Subscribers, Users.  
- Full CRUD for users, events, news, and subscribers—all behind Cognito auth.  
- Rich text editor for news (`react-quill-new`), poster uploads for events, CSV export for subscribers.  
- Admin layout wraps each page; it shows a login form if not authenticated, otherwise an admin nav bar.

**Page Structure**
- Public pages: `/` (home), `/events`, `/news`, `/education`.  
- Admin pages under `/admin/`.  
- **No middleware** exists—admin pages are only protected client-side; API routes are properly verified server-side.  
- **No `[slug]` pages for individual news or events**—the API routes exist, but the corresponding page files do not.

**Brand & Design**
- Brand colors: `vh-orange #ed8329`, `vh-green #39713b`, `vh-green-dark #2d5a30`.  
- Fonts: Inter (body), Quicksand (display headings), Lora (serif), Special Elite (typewriter).  
- Global background: `#FFFAF1` (warm cream). Very few custom CSS rules—most styling is done via Tailwind utilities.  
- Component patterns: well-typed interfaces, sub-components in same file, consistent hover/transition effects, image error fallbacks.

**Email System**
- SES for transactional emails (welcome, ebook, admin invite/reset).  
- SESv2 contact list (`veganhearts-subscribers`) for newsletter.  
- WorkMail handles forwarding (`hello@`, `education@`).  
- The password-setup flow is documented as tested and working locally. The email signup flow had historical debugging issues (API-STATUS.md notes possible runtime failures) but code is complete and deployed.

**DynamoDB Tables** (4 total)
- `vegan-hearts-email-signups` (PK: email, SK: timestamp)  
- `vegan-hearts-events` (PK: eventId)  
- `vegan-hearts-admin-users` (PK: userId)  
- `vegan-hearts-password-tokens` (PK: token)  
- **No public user profiles table** exists—the only users are admin users.

**Components**
- `Footer.tsx`: minimal footer with logo and a 7‑click easter egg to `/admin`.  
- `Navigation.tsx`: fixed top nav with links to Home, Events, News, Education; shows Admin button when authenticated.  
- `GoodNews.tsx`: displays hardcoded good news items with category badges, date, title, summary, and source link.  
- `NatureLanding.tsx`: an alternative stone-themed landing (appears unused).  
- `UnifiedFeed.tsx`: combines news and events on the homepage, sorted by date.

**No People/Profile/Network Code**
A grep for `people`, `profile`, `network`, or `member` in all TS(X) files returned zero matches. The project has no concept of public user profiles, member directories, or social networking features.

### What's Missing or Needs Attention
- **Public user system**: no registration, no login, no user-generated content.  
- **Middleware**: absent, so admin pages are only protected client-side.  
- **Individual article/event pages**: the API endpoints exist but no corresponding `[slug]` pages.  
- **Footer links**: none—no About, Contact, Privacy, etc.  
- **Navigation on home**: commented out (`{/* <Navigation /> */}`).  
- **Only one admin role**: the role dropdown has a comment about future roles.  
- **Email signup API reliability**: previously had runtime errors (likely AWS SDK initialization in serverless).  
- **No event detail, no news detail pages**—only list views exist.

### What Matters Mission-wise
This is an early-stage NGO platform. The infrastructure (Cognito, DynamoDB, SES, S3) is solid and production-ready. The admin tools are functional. The gap is on the public-facing side—there's no community layer, no way for supporters to create profiles or connect. The `NatureLanding` component and commented-out navigation suggest design explorations are still in progress. The GoodNews section is static and hardcoded, not yet content-managed.

Your next steps likely involve deciding whether to add public user features (profiles, network) or to deepen the existing content & admin experience. The password-setup flow is a good example of a polished, secure feature that works end-to-end.