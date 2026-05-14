# Session Summary — Bulletin Wall Demo

## What You Asked For

A standalone HTML file for a "Bulletin Wall" — a community notice board of profile cards, warm and human.

## What the Agent Built

**File:** `demos/bulletin-wall.html` — fully standalone, self-contained HTML/CSS/JS.

### Architecture & Design

| Aspect | Implementation |
|---|---|
| **Brand colors** | `#ed8329` orange, `#39713b` green, `#2d5a30` green-dark, `#FFFAF1` warm cream body |
| **Typography** | Google Fonts CDN — Quicksand (headings), Inter (body) |
| **Background** | Cork-board grain texture via radial gradients (no images) |
| **Grid** | 1 col mobile → 2 tablet → 3 desktop → 4 wide (media queries) |
| **Card entrance** | Staggered fade-in + slide-up, each card 80ms apart |
| **Hover** | Lifts 6px + scale 1.015 + deeper shadow |

### Profile Card Design

Each card includes:
- **Left border stripe** color-coded by type (green = individual, orange = company, brown = sanctuary)
- **Type badge** top-right with matching background tint
- **Avatar circle** — initials extracted from name, gradient background by type
- **Locations** — real cities worldwide (Barcelona, Paris, London, Milan, Helsinki, Tuscany, Berlin, Athens, Copenhagen, Tokyo, Nairobi, "Global")
- **Wave button** — click triggers pulse ring, toast notification slides up ("👋 Wave sent to Maria!"), toggles to "✓ Sent!" state, auto-dismisses 2.2s

### CSS Decoration

Three subtle leaf/vine elements (positioned top-left, bottom-right, floating mid-page) using border-radius shapes at ~8% opacity — entirely CSS, no images.

### The 12 Profiles

Exactly as you specified — 8 individuals, 3 companies, 1 sanctuary — including Peter & Evelina as "Founders of VeganHearts — Open community, no passwords, no likes."

### Data Structure (within the file)

```javascript
{ name, city, country, type, bio }
// type: "individual" | "company" | "sanctuary"
```

---

## Bugs Caught & Fixed

1. **Title tag split** — `Vegan</title> Hearts` → fixed to `Vegan Hearts Community`
2. **H1 markup broken** — `🌱</h1> Vegan Hearts` → fixed to `🌱 Vegan Hearts Community`

---

## Design Choices Made

- **No images** — everything is CSS-only (gradients, border-radius, text). Loads instantly, zero external deps besides Google Fonts.
- **Toast animation** uses `cubic-bezier(0.34, 1.56, 0.64, 1)` — a springy ease-out that feels warm, not mechanical.
- **Card entrance uses cubic bezier** too — 0.55s duration, slight overshoot at the end to feel organic.
- **No pin/thumbtack icons** — kept it simple. The left border stripe + type badge is enough visual cue.

---

## Mission Alignment

The subtitle says it: *"A web of people. No likes. No algorithms. Just us."* The Bulletin Wall embodies exactly what VeganHearts aims to be — connection without gamification, presence without performance. The "wave" gesture replaces likes/follows with a simple, human acknowledgment.

---

## What Matters Technically

This demo shows the pattern you could reuse in the real Next.js app:
- The profile data shape matches the DynamoDB schema you'll need (name, location, type, bio)
- The type-based color coding matches the `type-badge` class pattern already in `constellation.html`
- The Google Fonts approach matches the Next.js font setup in `tailwind.config.ts` (Inter + Quicksand)

---

## What Matters Humanly

This is what the community could look and feel like. It's not a product — it's a village notice board in the sun. You can open the file in your browser and see it, touch it, share it. That's real.