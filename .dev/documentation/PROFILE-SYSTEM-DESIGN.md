# VeganHearts — Profile System Design

> *"A platform where you can meet other like-minded people. Not about likes and sharing photos — more like a web of people and network. Just a way to say, hey, I'm here."* — Evelina

---

## 1. Core Principles

- **No passwords.** Magic-link auth only. You are who your email says you are.
- **No required fields except name.** Everything else is optional and self-defined.
- **The BIO is freeform sections.** People define their own sections with their own titles. No prescribed fields.
- **Sharings are the feed.** What people share flows through the community. Video, image, text, article, location — whatever they want to put out there.
- **No algorithm, no likes.** Chronological, filterable by distance/relevance/type. Connection is direct and human.
- **The map is a first-class view.** "Who is near me?" is one of the most natural questions.
- **Everything builds toward the knowledge graph.** Profiles → BIO → Sharings → Map → Connections → Web.

---

## 2. The Profile Page

A profile has two zones:

### Zone 1: The BIO — who I am

Static sections that describe the person/company/sanctuary. These live on the profile and change infrequently. Think of it as the "about" part of the profile.

Each BIO section has:
- A **title** — user-defined. "About Me", "What I Grow", "My Vegan Journey", "Our Mission", whatever.
- A **type** — determines rendering:
  - `text` — plain paragraphs
  - `image` — a photo
  - `link` — URL shown as a preview card
  - `contact` — how to reach me (email, Signal, Instagram, etc.)
- **Content** — the actual text/URL
- **Order** — reorderable

### Zone 2: Sharings — what I share

Posts that flow into the community feed. These are timestamped, shown in reverse chronological order on the profile, and also appear in the global/community feed.

Each sharing has:
- A **type** — determines rendering and feed card style:
  - `text` — a thought, a story, an update
  - `image` — a photo or artwork
  - `video` — YouTube/Vimeo embed
  - `article` — text + images + optional video, like a mini blog post
  - `location` — sharing an amazing place (cafe, sanctuary, hiking spot) with a map pin, photo, and notes
  - `event` — something happening (could also create an event entry)
  - `question` — asking the community something
- **Title** (optional)
- **Body** — text content
- **Media** — images, video URL
- **Location data** (optional) — coordinates, place name
- **Timestamp** — when it was shared
- **Profile it belongs to** — always tied to a profile

### How the profile page looks

```
┌──────────────────────────────────────────┐
│  ┌────────────────────────────────────┐  │
│  │ [photo]  Maria                      │  │
│  │         individual                  │  │
│  │         Barcelona, Spain 🇪🇸         │  │
│  │                                    │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ About Me                     │  │  │
│  │  │ Vegan for 8 years. Love      │  │  │
│  │  │ cooking Mediterranean food.  │  │  │
│  │  └──────────────────────────────┘  │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ 🌱 What I Can Share          │  │  │
│  │  │ I teach vegan cooking        │  │  │
│  │  │ workshops from my kitchen.   │  │  │
│  │  └──────────────────────────────┘  │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │ 🔗 My Recipe Blog            │  │  │
│  │  │ mariascooking.substack.com   │  │  │
│  │  └──────────────────────────────┘  │  │
│  │                                    │  │
│  │  [+ Connect]                       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ── Sharings ──────────────────────────  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📍 Shared a place                  │  │
│  │ Verd de Verdaguer — best vegan     │  │
│  │ brunch in Gràcia!                  │  │
│  │ [photo of the cafe]                │  │
│  │ [mini map pin]                     │  │
│  │ 3 days ago                         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📝 Shared an article               │  │
│  │ How I Make Vegan Paella            │  │
│  │ My grandmother's recipe, adapted.  │  │
│  │ [photos + text]                    │  │
│  │ 1 week ago                         │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 💬 Shared a thought                │  │
│  │ Just tried the new vegan cheese    │  │
│  │ at the market. Game changer.       │  │
│  │ 2 weeks ago                        │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 3. The Feed

The feed is the living pulse of the community. It aggregates sharings from everyone.

### 3.1 Default feed
- Chronological (newest first)
- Shows all sharings from all profiles
- Each card shows: type icon, title/body preview, author name + photo, time ago
- Click a card → expand or go to the full sharing on their profile

### 3.2 Feed filters (build progressively)
- **By distance** — "within 50km of me" (uses browser geolocation or a city you set)
- **By type** — "show only videos", "show only locations", "show only articles"
- **By profile type** — "people only", "companies & sanctuaries"
- **By connection** — "sharings from people I'm connected to"
- **Search** — full text search across sharings

### 3.3 Feed as part of profile
- Your profile page shows YOUR sharings in reverse chronological order
- The global feed at `/feed` or on the homepage shows everyone's sharings
- Eventually: community threads — topic-based feeds ("Recipes", "Activism", "Sanctuaries")

---

## 4. The Map

### 4.1 Profile pins
- Leaflet.js + OpenStreetMap (free, no API keys)
- Every profile with a city/country shows as a pin
- Pin color = profile type (green = individual, orange = company, sage = sanctuary)
- Click pin → popup: name, photo, city, link to profile

### 4.2 Location sharings on the map
- When someone shares a `location` type sharing, it also appears on the map
- Different pin style from profile pins
- Click → popup with the sharing content + link to the sharer's profile
- This is how the map becomes a community resource: "Where are the good vegan places?"

### 4.3 Map layers (future)
- Profiles layer
- Shared locations layer
- Events layer (reuse existing events system)

---

## 5. Connections (future phase)

### 5.1 Typed connections
When two profiles connect, the connection has a type:
- `friend of`, `works at`, `founded`, `volunteers for`, `mentored by`, `collaborates with`, `family`
- Custom — user can type their own

### 5.2 How connecting works
1. Visit someone's profile
2. Click "Connect"
3. Select a relationship type (or type custom)
4. The other person gets a notification
5. If accepted, connection appears on both profiles

### 5.3 Knowledge graph (far future)
A visualization showing how everyone is connected, filterable by connection type, geography, and degrees of separation.

---

## 6. Data Model

### 6.1 DynamoDB: `profiles`

```
PK: profile_id (UUID)
name: string
type: individual | company | sanctuary | collective | other
city: string (optional)
country: string (optional)
photo_url: string (optional)
email: string (private, for auth)
bio_sections: [
  {
    id: UUID
    type: text | image | link | contact
    title: string
    content: string
    order: number
  }
]
created_at: timestamp
updated_at: timestamp
```

### 6.2 DynamoDB: `sharings`

```
PK: sharing_id (UUID)
profile_id: string (GSI partition key)
type: text | image | video | article | location | event | question
title: string (optional)
body: string
media_urls: [string]
video_url: string (optional)
location_name: string (optional)
location_lat: number (optional)
location_lng: number (optional)
created_at: timestamp (GSI sort key for feed)
updated_at: timestamp
```

### 6.3 Feed query
- GSI on `(type, created_at)` or just scan by `created_at` descending
- For filtered feeds: add GSIs as needed (e.g. by location proximity, by profile type)

---

## 7. Build Phases

### Phase 1: Profile + BIO
- [ ] Create DynamoDB `profiles` table
- [ ] Magic-link auth for profile creation (reuse Cognito)
- [ ] Profile creation: name, type, city, country, photo
- [ ] BIO sections: add, edit, delete, reorder
- [ ] BIO section types: text, image, link, contact
- [ ] Public profile page at `/profile/[id]`
- [ ] Brand styling (warm, nature-inspired)

### Phase 2: Sharings + Feed
- [ ] Create DynamoDB `sharings` table
- [ ] Create sharing from profile: text, image, video, article, location
- [ ] Sharing cards with type-specific rendering
- [ ] Profile page shows user's sharings below BIO
- [ ] Global feed at `/feed` or on homepage
- [ ] Chronological feed, basic type filter

### Phase 3: Map
- [ ] `/map` page with Leaflet + OpenStreetMap
- [ ] Profile pins
- [ ] Location sharing pins
- [ ] Click pin → popup → link to profile/sharing

### Phase 4: Feed Filters
- [ ] Distance filter
- [ ] Type filter
- [ ] Profile type filter
- [ ] Search

### Phase 5: Connections
- [ ] Connect button on profiles
- [ ] Relationship types
- [ ] Connection list on profile
- [ ] Filter feed by connections

---

## 8. Design Notes

### 8.1 Vibe
- Walking into a sunlit forest clearing
- Warm cream background (#FFFAF1) — like paper in sunlight
- Green (#39713b) for belonging, growth, life
- Orange (#ed8329) for warmth, sunset, heart
- Quicksand for headings (rounded, friendly)
- Inter for body (clean, readable)
- Nothing corporate, nothing slick, nothing that feels like a product

### 8.2 BIO vs Sharings — visual distinction
- BIO sections: more permanent, slightly more structured, part of the profile's "identity card"
- Sharings: flowing, timestamped, feed-style cards, feel like a living stream
- On the profile page, BIO is at top (always visible), sharings scroll below

---

*Living document — evolves as we build and as Evelina and Peter refine the vision.*
