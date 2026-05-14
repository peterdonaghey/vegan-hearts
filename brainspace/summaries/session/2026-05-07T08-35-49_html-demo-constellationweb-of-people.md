I've created the constellation demo at `demos/constellation.html`. Here's what's inside:

**🌱 The Web of Vegan Hearts** — a standalone HTML file using D3.js from CDN.

### What it does

- **Force-directed graph** on a dark, nature-inspired radial gradient background (deep green to charcoal)
- **9 nodes** representing the people and organizations from your list, each with:
  - Glowing node (SVG circle with `filter="url(#glow)"`)
  - Initials displayed in the center
  - Color-coded by type: individuals (green), companies (orange-tinted), sanctuaries (leaf green)
  - Subtle floating/breathing animation via the force simulation (alpha decay set low so they drift gently)
- **Organic curved links** (thin, low-opacity, with a dash pattern that subtly moves — adds a mycelium/root-like feel)
- **Profile card** on node click: slides in from the right with name, city, country, type badge, and bio — warm cream card with the brand palette
- **Hover glow** on nodes (cursor change, scale up)
- **Responsive** — works on mobile too (the profile card becomes full-width on small screens)

### Technical details

- Pure HTML/CSS/JS, no build step
- D3 v7 force simulation with `forceCharge` (-80), `forceCollide` (radius-based), `forceCenter`, and `forceLink` (distance 120)
- SVG glow filter using `feGaussianBlur` and `feMerge`
- CSS custom properties matching your exact brand colors
- No external fonts required (Georgia serif for warm, organic feel)
- The links have a subtle animated dash (`stroke-dasharray="4 6"` with a CSS animation that shifts the stroke position)

### Brand colors used exactly as specified

- `--vh-green: #39713b`
- `--vh-orange: #ed8329`  
- `--vh-green-dark: #2d5a30`
- Background: `#FFFAF1` (cream for header area)
- Graph area: radial gradient from `#2a3a1f` → `#1a1a0f` → `#0f0f08`

### Demo profiles included

Maria (Barcelona), Jean (Paris), Aisha (London), Marco (Milan), Lena (Berlin), Sofia (Athens), Helsinki Vegan Kitchen, Farm Sanctuary Italia, Green Protein Co — all with realistic bios.

### To view

Open `demos/constellation.html` in any browser. No server needed.

What do you think? Want me to tweak anything — more nodes, different colors for certain types, different layout feel, or add the photo placeholders?