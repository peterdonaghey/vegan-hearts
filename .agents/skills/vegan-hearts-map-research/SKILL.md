---
name: vegan-hearts-map-research
description: Research and add vegan animal sanctuaries and vegan projects to the Vegan Hearts Map. Work region by region across Spain, Portugal and Taiwan, searching for farm animal sanctuaries, vegan ecovillages, vegan communities, and plant-based projects — including niche website-less places found via social media. Verify each find actually exists at the claimed location, capture contact info, record structured data, and add it to lib/places.ts.
---

# Vegan Hearts Map — Research Skill

## When to Use

Activate this skill when the user says:
- "Add more places to the map"
- "Research [region] for sanctuaries"
- "Let's cover [country/region]"
- "Find vegan projects in [area]"
- "Search Facebook/Instagram for sanctuaries"
- Any request to grow the Vegan Hearts Map dataset

## The Mission

This map exists so vegans can **connect** with sanctuaries — to volunteer, donate, and build community. The most important finds are the **small, website-less, volunteer-run places in the dirt doing the hard work** — not the big established organizations. A place is only useful on the map if there's a way to contact them. **Contact info is mandatory.**

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
  website?: string;     // Official URL (optional — many places don't have one)
  address: string;      // Full human-readable address
  locationPrecision: "exact" | "approximate";
  // "exact" = verified street/plot-level coords.
  // "approximate" = only town/region known — coords point at town/region centre,
  // and the map should show this clearly (e.g. dashed ring or label).
  contact: {
    email?: string;
    phone?: string;       // Include country code
    whatsapp?: string;    // Full international format
    instagram?: string;   // @handle or URL
    facebook?: string;    // Page URL
    telegram?: string;
    other?: string;       // e.g. "via linktr.ee/xxx", "via Teaming"
  };
  tags: string[];       // Lowercase, e.g. ["vegan", "rescue", "galicia"]
  image?: string;       // Optional image URL
  source: string;       // "manual" | "osm" | "community" | "research" | "social"
  sourceUrl?: string;   // URL where existence + address were verified (website, FB page, IG profile, directory listing)
}
```

**Priority types**: `sanctuary` and `project` first, then `accommodation` (only genuine vegan projects — ecovillages, sanctuary-adjacent ops, all-vegan retreats). Restaurants and shops are excluded (HappyCow exists for that).

## What Belongs on the Map

### ✅ Include
- **Animal sanctuaries** — vegan-run rescue/rehab centres, ANY size (microsantuarios count!)
- **Vegan projects & communities** — ecovillages, cohousing, intentional communities
- **Vegan-run projects** — rewilding, permaculture, vegan education centres
- **Sanctuary-adjacent operations** — enterprises that fund a sanctuary
- **Website-less places with social media presence** — Facebook page, Instagram, Teaming, or WhatsApp contact is ENOUGH. This is the core of the mission.

### ❌ Exclude
- Plain B&Bs/hotels/hostels that merely offer vegan breakfast
- Eco-farms that are vegan-friendly but not vegan-run
- Buddhist monasteries/temples serving vegan food as religious practice
- Anything where veganism is a selling point rather than the mission

**Test**: *"Is this a vegan project people can connect with, or a business with vegan options?"*

## Two Research Tracks

### Track A: Web Research (for established places)
For each region: search web in English + local language (see search terms below), check directories (GEN, Workaway, WWOOF, sanctuarydirectory.com, ladocumentalistavegana.com, madridvegano.es/santuarios-de-animales-en-espana, vlcanimalsave.org, elfuturoesvegano.com/es/mas-info/santuarios, yourdailyvegan.com). ⚠️ spainvegan.es is DEAD (now a casino spam domain) — do not use it. Also check xeu.cat (Catalan association registry) and the Generalitat registries for sanctuary addresses.

### Track B: Social Media Research (for niche, website-less places) — CRITICAL
The small places often have NO website but DO have a Facebook page, Instagram, or Teaming group. Facebook requires login — the user will log in when available. Instagram can be browsed without login.

## Facebook Search Playbook (logged-in)

**Setup**: Navigate to facebook.com, let the user log in (never ask for credentials — user logs in themselves). Once logged in, search works.

**Search URL pattern**:
```
https://www.facebook.com/search/pages/?q=<query>
```

**Effective search terms** (Spanish):
- `santuario vegano`
- `santuario de animales`
- `refugio de animales vegano`
- `microsantuario`
- `santuario de granja`
- `santuario antiespecista`
- `aldea vegana` / `ecoaldea vegana`
- `santuario [region]` (e.g. `santuario Galicia`)
- `refugio vegano`

**Effective search terms** (Portuguese):
- `santuário vegano` / `santuário de animais` / `refúgio vegano` / `aldeia vegana`

**How to read results**: Each result shows category, followers, and a blurb. Filter for:
- Categories: Nonprofit Organization, Community, Cause, Charity Organization, Animal Shelter
- Descriptions containing: santuario, refugio, antiespecista, animales de granja, rescate
- **Location**: many results are Latin America — check each page's About for Spain/Portugal/Taiwan

**Page inspection workflow** (for each promising page):
1. Open the page
2. Read the intro/blurb + category + follower count
3. Check `Details` → location (must be in target region)
4. Check `Links` → website, linktr.ee, teaming.net, instagram
5. Check `Contact info` → email, phone, WhatsApp button
6. Check recent posts → confirm still active (posts within last ~6 months)
7. Record ALL contact channels — that's the point of the map

**Contact channels to capture** (in priority order): email, WhatsApp, phone, Instagram, Teaming, PayPal/GoFundMe (donation links), Facebook page itself.

**Reality check**: Expect a lot of Latin American results (Argentina, Mexico, Colombia, Bolivia) — the Spanish-language vegan community is huge there. Be disciplined: only keep places in the target region.

## Instagram Discovery (log-in recommended, works logged-out for profiles/hashtags)

Instagram is where the smallest sanctuaries live — many have ONLY an Instagram account, no website, no Facebook. The user can log in (Meta session may carry over from Facebook — click "Continue as <user>" when offered).

**What actually works (tested):**

1. **Hashtag search** — navigate to `https://www.instagram.com/explore/tags/<tag>/`. Instagram redirects to a keyword search page showing a grid of posts. Clicking a post reveals the author + full caption.
   - Effective tags (tested): `santuariovegano`, `santuariodeanimais`, `santuarioanimal`, `vegansanctuary`, `veganportugal`, `santuariodeanimales`, `microsantuario`, `refugiovegano`, `antiespecismo`, `santuariosanimales`
2. **Keyword search** — `https://www.instagram.com/explore/search/keyword/?q=<query>` shows posts matching the query (e.g. "santuario vegano", "leon vegano sanctuary"). Useful for finding an account when you only know the name.
3. **Profile inspection** — `instagram.com/<handle>/` shows: bio (often contains email, IBAN, linktr.ee!), follower count, and recent posts. Recent posts = activity check. The bio is the jackpot for contact info.
4. **Post captions are GOLD** — captions frequently contain: PayPal links, IBAN bank numbers, Teaming links, emails, phone numbers, and **mentions/tags of other sanctuaries** (@santuariovacaloura, @santuariovegan...). Reading captions of known sanctuaries leads to new ones — this is the cross-linking strategy.
5. **Donation posts** — sanctuaries regularly post donation calls with full payment details. These are instant contact channels AND proof the place is active.

**Worked example (this is why we check):** searching `#santuariovegano` led to Leon Vegano Animal Sanctuary (León — a place with NO discoverability via regular web search) and Animais Sem Fronteiras (Alcochete, Portugal) — both with emails/phones/IBANs in their posts/bios.

**Handle guessing** often fails (`/leonveganosanctuary/` was wrong) — use keyword search instead, or find the handle by opening the post from the hashtag grid.

## Facebook Search Playbook (logged-in)
## Teaming.net (Spain's micro-donation platform)

Many website-less Spanish sanctuaries fundraise on Teaming (€1/month). URL pattern: `teaming.net/<groupname>`. When a Facebook page links to Teaming, it confirms active fundraising + gives a contact channel. Check `teaming.net` search for "santuario" too.

## Verification Step (MANDATORY)

### 1. Existence Check
- [ ] **Website**: fetch it. Must load and show the place operating.
- [ ] **No website?** Facebook page or Instagram profile with posts in the last ~6 months is a valid substitute. Check the page/About for "still active" signals.
- [ ] Record the URL where you verified existence in `sourceUrl` (website URL, FB page URL, or IG profile URL).

### 2. Location Check
- [ ] Get the address/location from a real source (website, FB page Details, IG bio, directory listing). Never from memory.
- [ ] **Exact address known** → geocode via Nominatim: `https://nominatim.openstreetmap.org/search?q=<address>&format=json` (User-Agent: veganhearts-map/1.0, 1s between calls). Use `locationPrecision: "exact"`.
- [ ] **Only town/region known** → geocode the town/region centre and set `locationPrecision: "approximate"`. This is ACCEPTABLE — the map must show it as approximate (dashed ring marker + "location approximate" label). Never pretend a region-level location is exact.
- [ ] If you can't determine even the region, don't add the place.

### 3. Contact Check (MANDATORY)
- [ ] At least ONE contact channel must be recorded: email, phone, WhatsApp, Instagram, Facebook page, or Teaming link.
- [ ] No contact info = place does not go on the map (people can't connect).
- [ ] For Facebook-only places, the Facebook page URL itself counts as contact.

### 4. Alignment Check
- [ ] Vegan-run, not just vegan-friendly.
- [ ] Not commercial-only (no plain B&Bs/hotels).
- [ ] Still operating.

## Adding a Place

Once verified, add the object to `lib/places.ts`:

1. Open `lib/places.ts`
2. Add a new object in the appropriate region section (create section comment if missing):
   ```ts
   // ============================================================
   // SPAIN — ANDALUSIA
   // ============================================================
   ```
3. Generate `id` from the name: lowercase, kebab-case, remove articles.
4. Write a good `description` (1-3 sentences) — what they do, animals rescued, year founded, why special. Include "no website — reach via Facebook/Instagram" if relevant.
5. Fill `contact` with every channel found. Fill `locationPrecision`.
6. `source: "social"` for social-media-discovered places; `"research"` for web research.
7. Set `sourceUrl` to the FB page / IG profile / website where verified.
8. Keep alphabetical order within each region section.

## Region-by-Region Workflow

We're covering Spain and Portugal systematically, region by region. Region list:

### SPAIN
1. ~~**Galicia**~~ *(done — Mino Valley, O Viso, Vacaloura, Acougo, Frente L.A., Sueño de Jill, Savia, Val de Rodas)*
2. ~~**Asturias, Cantabria, Basque Country**~~ *(done — Corazón Verde, Manada Cántabra, Vida Color Frambuesa, Paraíso Interespecie, Burrita Carmela, Roke Enea)*
3. ~~**Catalonia**~~ *(done — Gaia, Almas Veganas, El Hogar, Món La Bassa, BuenaVida, Cau del Bosc, La Vedruna, Wild Forest, La Casita de Lluvia, La Muntanyeta, Cal Lari ADE, Sakura, Casa de Madera, Casa Albets)*
4. **Aragon, Navarre** *(confirmed sparse — every directory lists ZERO vegan sanctuaries; Vegan Hope (Zaragoza) still dormant since 2016 — re-check before adding)*
5. ~~**La Rioja**~~ *(done — Movimiento Lleó, El Molino del Corregidor)*
6. **Castile & León, Madrid** *(partial — Santuario Vegan, Leon Vegano, Santuario Dharma (Gredos))* → **TODO: re-verify via Facebook; Espíritu Libre moved to Soria — needs contact info to add**
7. ~~**Castile–La Mancha, Extremadura**~~ *(done — Arthur King, Los Perros Negros, Refugio Los Abuelos, Ciudad Animal Brego)*
8. ~~**Valencia**~~ *(done — Compasión Animal, El Rebrot de la Vida, El Refugio de Perla, Pollets de la Terreta, Caballo Espíritu Libre, La Paloma Triste, La Granja de Izhan)*
9. ~~**Murcia**~~ *(done — Jacobs Ridge, Alma Libertaria, El Rincón de Barakah)*
10. ~~**Andalusia**~~ *(done — La Candela, El Hogar de Gringa, Todos los Caballos del Mundo, A Better Life 4 Horses, Rancho Edén, Donkey Dreamland, El Cortijillo de Lola)*
11. ~~**Balearic Islands**~~ *(done — Eden (Mallorca), Trebaluger (Menorca))* → **La Llar de l'Animal (north Mallorca) has NO contact channel — one FB search away from qualifying**
12. ~~**Canary Islands**~~ *(done — The Animal Academy, Finca Arkadia, Tenerife Animal Sanctuary, Santuario Petricor)*

### PORTUGAL
1. ~~**Norte**~~ *(done — Quinta das Águias)*
2. ~~**Centro**~~ *(done — Star Mountain)*
3. ~~**Lisbon & Setúbal**~~ *(done — Animais Sem Fronteiras, Save & Care)*
4. ~~**Alentejo**~~ *(done — Monte dos Vagabundos, Pangea Elephant Sanctuary)*
5. ~~**Algarve**~~ *(done — Outro Lado)*
6. ~~**Azores**~~ *(done — Donkeys & Friends (São Miguel))* → **Madeira still open**

### TAIWAN
- ~~**North, East Coast, South**~~ *(done — Pigs' Heaven, Sun Clover, Ánanda Suruci, Guanyin's Home)*

## Progress Tracking

Do NOT write progress files to the repo. Track completed regions conversationally — when the user asks for a new region, recall what was done and tell them which regions remain.

## Quality Checklist per Entry

- [ ] Existence verified (website OR active social media in last ~6 months)
- [ ] Location verified — coords from geocoding a real address; `locationPrecision` set correctly ("approximate" if only town/region known)
- [ ] `contact` has at least one channel
- [ ] `sourceUrl` set to where existence was confirmed
- [ ] Vegan-run, not just vegan-friendly
- [ ] Not commercial-only (no plain B&Bs/hotels)
- [ ] `id` kebab-case, `lat`/`lng` decimal degrees, `type` valid, `tags` lowercase with region
- [ ] `description` unique and engaging
- [ ] Build passes: `npm run build`
