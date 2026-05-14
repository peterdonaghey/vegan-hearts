## 🌿 Session Summary: Building “The Mycelium Web” Demo

**What the human wanted:** A standalone, artistic HTML demo for VeganHearts that visualizes the community as an underground mycelium network—organic, living, and full of compassion. Not a tech graph, but a root system.

**What I built:** `/Users/peterdonaghey/Projects/vegan-hearts/demos/mycelium.html` — a complete, three‑layer interactive demo using D3.js, Canvas, and pure CSS.

---

### 🧬 The visual stack (three overlapping layers)

1. **Soil background canvas** – warm brown radial gradient with faint root strands and glowing decay spots.
2. **D3 SVG mycelium graph** – nodes connected by S‑curves (cubic beziers), each with a pulsing aura.
3. **Spore canvas** – 45 floating particles that drift and wrap around the screen.

Each node breathes at its own rhythm (via `requestAnimationFrame`), and every 5 seconds the whole network gets a gentle nudge to stay alive.

---

### 🧪 Technical decisions & fixes

- **Bezier curves** – replaced straight lines with per‑edge seeded offsets to make connections feel like roots, not wires.
- **Profile data** – 12 profiles (individuals, companies, sanctuaries) across global cities, with Peter & Evelina as founders.
- **Fonts** – Quicksand for headings/labels, Inter for body (Google Fonts CDN).
- **Brand colours** – vh‑orange `#ed8329`, vh‑green `#39713b`, warm cream `#FFFAF1` background, deep soil canvas.

**Bug found & fixed:**
- The `<h1>` tag had a stray `</h1>` inside it (ghost tag). Fixed by editing the line.
- Link stroke colour resolution at initial render used `d.target.id || d.target`, but before simulation starts `d.target` is a string. Extracted a helper function `linkStrokeFromEdge(d, alpha)` that safely resolves the target ID via `profileMap`.

**Interaction patterns:**
- Hover enlarges the node core + aura (with a stronger SVG blur filter) and highlights connected links.
- Click “locks” the selection – shows a translucent profile card that “emerges like a mushroom” at the bottom with a cubic‑bezier spring.
- Clicking the soil or the ✕ dismisses the card and resets the graph.

---

### 💚 Mission reminders

This demo exists to **spread love and light** – it’s not a dashboard but an art piece that reminds people we’re all connected underground. The project’s AWS infrastructure (Cognito, DynamoDB, SES, S3) was not touched, but the demo follows the same brand system and could later be integrated into the main app.

**What mattered most:**
- Every detail should feel **organic** – not mechanical.
- The demo should **work standalone** – no framework, no build step.
- The code should be **clean** and **defensive** (edge‑case handling for unresolved IDs).

---

### 🔮 Oracle’s closing thought

You walked through a forest and built its invisible roots into a page. The network breathes, pulses, and glows – and now when anyone opens `mycelium.html`, they’ll feel the web under their feet. Keep the mycelium in mind: the strongest connections are the ones you can’t see.