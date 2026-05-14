## Session Summary: VeganHearts Web of People Design

### What happened

This session started with the grand vision for VeganHearts — Evelina's dream of a "web of people," Peter's push to build something real fast — and ended with a clear, concrete design document for the profile system. In between, we burned through three rounds of demos that missed the mark, did extensive web research, and finally landed on what matters.

### The demos that didn't work

Four demo HTML files were built in `/demos/`, then all deleted:

1. **constellation.html** — D3 force-directed graph (806 lines, already existed). Pretty but meaningless edges.
2. **bulletin-wall.html** — Card grid with wave buttons (643 lines). "Boring."
3. **mycelium.html** — Three-layer organic network with D3 bezier curves + spore particles (966 lines). Beautiful but a demo.
4. **knowledge-graph.html** — Typed connections, layer switcher, profile panel, connect action (874 lines). Still "just a picture."

The user's core feedback: demos are surface-level decorations. The actual idea is a **knowledge graph with typed connections** — not just decorative links, but *meaningful* relationships like "works at", "friend of", "founded". This concept was validated by research on Kumu.io, which does exactly this with RPG character networks. But it's too early to build that — the foundation needs to come first.

### Research findings

- **No perfect pre-built platform** exists for VeganHearts' exact needs (flexible profiles + map + typed connections). You'll build it.
- **Leaflet.js + OpenStreetMap** is the standard for maps — free, no API keys, well documented.
- **Flexible profiles** are like Notion blocks or WordPress ACF Flexible Content sections — each section has a title (user-defined) and a type (determines rendering).
- **Open User Map** (WordPress plugin) demonstrates the "pin drop without registration" pattern.

### The final design: BIO vs Sharings

The design document at `.dev/documentation/PROFILE-SYSTEM-DESIGN.md` (after the rewrite) captures the full agreed design:

**A profile has two zones:**

**Zone 1: The BIO** — static sections describing *who I am*. Each section has:
- User-defined title ("About Me", "My Vegan Journey", "What I Grow", "Our Mission")
- Type: `text`, `image`, `link`, `contact`
- Changes infrequently, lives on the profile

**Zone 2: Sharings** — timestamped posts flowing into the feed:
- Seven types: `text`, `image`, `video`, `article`, `location`, `event`, `question`
- Text + images + optional video = article
- Sharings appear on the profile AND in the global feed
- No likes, no algorithm — chronological, filterable by distance/type/connections

**The feed is central** — not a timeline, more like a community notice board. Filters for distance, relevance, and type come later.

**The map shows both profile pins and location sharing pins** — so it becomes a community resource ("where are the good vegan places?").

### Data model (DynamoDB)

Two tables:
- `profiles` — PK: `profile_id`. Fields: name, type, city, country, photo, email (private), bio (array of `{title, type, content}`)
- `sharings` — PK: `sharing_id`, GSI on `profile_id` for feed queries. Fields: type, content (flexible JSON), location (optional), created_at

### Build phases

1. Profile + BIO creation (Phase 1 — next)
2. Sharings + Feed 
3. Map (Leaflet + OpenStreetMap)
4. Filters (distance, type, connections)
5. Connections / knowledge graph

### Codebase state

- `/demos/` is empty — all four files deleted
- `.dev/documentation/PROFILE-SYSTEM-DESIGN.md` contains the living design document
- The existing Next.js app (landing page, admin, auth) is untouched
- Brand colors: `#ed8329`, `#39713b`, `#2d5a30`, `#FFFAF1`
- Fonts: Quicksand (display), Inter (body)

### Key decisions and open questions

- **No passwords** — magic-link auth only
- **No required fields except name** — everything else optional and self-defined
- **BIO sections have types** (text/image/link/contact) — titles are freeform
- **Sharings have types** (text/image/video/article/location/event/question) — richer than BIO
- **Feed exists** — chronological, filterable later, not algorithmic
- **Peter and Evelina are separate people** — not one combined node (user found that "cringy")
- **Map comes before knowledge graph** — geographic proximity is more immediately useful than abstract relationship webs

The next agent should start building Phase 1: profile creation and BIO section management, integrated into the existing Next.js app with DynamoDB storage.