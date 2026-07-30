---
name: vegan-hearts-map-research
description: Research and add vegan animal sanctuaries and vegan projects to the Vegan Hearts Map. Work region by region across Spain and Portugal, searching for farm animal sanctuaries, vegan ecovillages, vegan accommodations, and plant-based community projects. Validate each find, record structured data, and add it to lib/places.ts.
---

# Vegan Hearts Map — Research Skill

## When to Use

Activate this skill when the user says:
- "Add more places to the map"
- "Research [region] for sanctuaries"
- "Let's cover [country/region]"
- "Find vegan projects in [area]"
- Any request to grow the Vegan Hearts Map dataset

## The Dataset

All places live in a single typed array at `lib/places.ts`. The type definition is:

```ts
export type PlaceType = "sanctuary" | "restaurant" | "shop" | "project" | "accommodation";

export interface Place {
  id: string;           // kebab-case, e.g. "mino-valley"
  name: string;         // Full place name
  lat: number;          // Decimal degrees
  lng: number;          // Decimal degrees
  type: PlaceType;      // Primary category — drives marker colour
  subtypes: string[];   // More specific, e.g. ["farm_animal", "rescue"]
  description: string;  // 1-3 sentences, engaging, informative
  website?: string;     // Official URL
  address: string;      // Full human-readable address
  tags: string[];       // Lowercase, e.g. ["vegan", "rescue", "galicia"]
  image?: string;       // Optional image URL
  source: string;       // "manual" | "osm" | "community" | "research"
}
```

**Priority types for this skill**: `sanctuary` and `project` first, then `accommodation`. Restaurants and shops are lower priority (can be batch-imported from OSM later).

## Region-by-Region Workflow

We're covering Spain and Portugal systematically. Here's the region breakdown:

### SPAIN
1. ~~**Galicia**~~ *(done — Mino Valley, O Viso)*
2. **Asturias, Cantabria, Basque Country** (north coast)
3. **Catalonia** *(partial — Santuario Gaia)*
4. **Aragon, Navarre, La Rioja**
5. **Castile & León, Madrid** *(partial — Santuario Vegan)*
6. **Castile–La Mancha, Extremadura**
7. **Valencia, Murcia** *(partial — Jacobs Ridge)*
8. **Andalusia** *(partial — La Candela)*
9. **Balearic Islands** *(partial — Eden Sanctuary)*
10. **Canary Islands**

### PORTUGAL
1. **Norte** (Porto, Braga, Vila Real)
2. **Centro** (Coimbra, Aveiro, Viseu, Guarda)
3. **Lisbon & Setúbal** (capital region)
4. **Alentejo** (Évora, Beja)
5. **Algarve** (Faro, Lagos, Tavira)
6. **Madeira & Azores** (islands)

## Research Strategy

For each region, perform the following searches (use Brave Search / web fetch):

### Primary Searches (English)
```
vegan animal sanctuary [region] [country]
farm animal sanctuary [region] [country]
vegan rescue [region]
vegan ecovillage [region]
vegan hotel [region]
```

### Secondary Searches (local language)
For Spanish regions:
```
santuario vegano [region]
santuario de animales [region]
refugio vegano [region]
aldea vegana [region]
```
For Portuguese regions:
```
santuário vegano [região]
santuário de animais [região]
refúgio vegano [região]
aldeia vegana [região]
```

### Third-Party Directories to Check
- **HappyCow** — Vegan restaurants, shops, some sanctuaries
- **Global Ecovillage Network** (ecovillage.org) — Intentional communities
- **WWOOF / Workaway** — Volunteer stays at sanctuaries and farms
- **Your Daily Vegan** (yourdailyvegan.com) — Sanctuary spotlights
- **Vegan Paradise** (veganparadise.org) — Sanctuary directory
- **Sanctuary Directory** (sanctuarydirectory.com) — Global listings

## Validation Criteria

Before adding a place, confirm:

- [ ] **Is it still open?** Check website or recent reviews. Skip if permanently closed.
- [ ] **Is it vegan-aligned?** Sanctuary should be vegan-run or explicitly vegan/plant-based. Projects should be explicitly vegan (not just "eco" or "organic").
- [ ] **Is the location accurate?** Get coordinates from the official website, Google Maps (eyeball it — don't scrape), or OpenStreetMap.
- [ ] **Does it have a website?** Strongly preferred. If no website, there must be a reliable third-party source (news article, directory listing).

## Coordinate Accuracy

| Confidence | Method | Example |
|---|---|---|
| High | Official website gives exact address + OSM lookup | "Calle Mayor 12, 28001 Madrid" → precise lat/lng |
| Medium | We know the town/village | Place is in "Pantón, Lugo" → coordinates for the town centre |
| Low (avoid) | Only the region is known | "Somewhere in Galicia" — don't add it |

## Adding a Place

Once validated, add the object to `lib/places.ts`:

1. Open `lib/places.ts`
2. Add a new object inside the `places` array, in the appropriate region section
3. Create a section comment if the region doesn't have one yet:
   ```ts
   // ============================================================
   // SPAIN — ANDALUSIA
   // ============================================================
   ```
4. Generate the `id` from the place name: lowercase, replace spaces/special chars with hyphens, remove articles.
   - "Fundación Santuario Gaia" → `santuario-gaia`
   - "O Viso Ecovillage" → `o-viso-ecovillage`
5. Write a good `description` (1-3 sentences) — what they do, what animals they rescue, year founded, why they're special.
6. Use `source: "research"` for places found through this skill.
7. Keep entries in alphabetical order within each region section.

## Progress Tracking

Progress is tracked at `.agents/skills/vegan-hearts-map-research/progress.json`.

Read it at the start of each session, update it at the end with what was completed.

### progress.json format

```json
{
  "lastUpdated": "2026-07-30",
  "completedRegions": {
    "spain": ["Galicia"],
    "portugal": []
  },
  "totalPlaces": 8,
  "currentFocus": "Asturias, Cantabria, Basque Country",
  "notes": "Santuario Gaia is in Catalonia. Next region: north coast of Spain."
}
```

## Quality Checklist per Entry

Before finishing, verify each new place:

- [ ] `id` matches the naming convention (kebab-case)
- [ ] `lat`/`lng` are in decimal degrees (not degrees/minutes/seconds)
- [ ] `type` is one of the five valid types
- [ ] `subtypes` use snake_case
- [ ] `tags` are lowercase, relevant, include the region
- [ ] `description` is unique (not copy-pasted boilerplate)
- [ ] `website` works (or has been checked)
- [ ] `source` is set correctly
- [ ] Build passes: `npm run build`
- [ ] Bonus: open the demo HTML and visually confirm the marker is in the right place
