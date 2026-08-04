// Audit script: checks every URL in lib/places.ts and flags dead links / no-contact entries.
// Usage: node scripts/audit-place-links.mjs [--json]
import { readFileSync } from "node:fs";

const src = readFileSync("lib/places.ts", "utf8");

// Pull out the places array as JS-ish objects
const start = src.indexOf("export const places: Place[] = [");
const end = src.lastIndexOf("];");
const arrSrc = src.slice(start + "export const places: Place[] = [".length, end);

// Extract each object literal
const objects = [];
let depth = 0;
let cur = "";
for (const ch of arrSrc) {
  if (ch === "{") depth++;
  if (ch === "}") depth--;
  if (depth === 0 && ch === "}" && cur.trim()) {
    objects.push(cur + "}");
    cur = "";
  } else {
    cur += ch;
  }
}
if (cur.trim()) objects.push(cur);

// Parse one object
function parseObj(src) {
  const obj = {};
  for (const m of src.matchAll(/(\w+):\s*("[^"]*")/g)) {
    try {
      obj[m[1]] = JSON.parse(m[2]);
    } catch {}
  }
  // contact object (handles unquoted keys)
  const cm = src.match(/contact:\s*(\{[^}]*\})/);
  if (cm) {
    const contact = {};
    for (const m of cm[1].matchAll(/(\w+):\s*("[^"]*")/g)) {
      try {
        contact[m[1]] = JSON.parse(m[2]);
      } catch {}
    }
    obj.contact = contact;
  }
  return obj;
}

// URL regex — matches full URLs and bare domains like teaming.net/x (requires a real TLD)
const URL_RE = /(?:https?:\/\/)?[\w-]+(?:\.[a-z]{2,})+(?:\/[^\s"'`)\]]*)?/g;

// Readable channel keys
const CHANNELS = ["email", "phone", "whatsapp", "instagram", "facebook", "telegram"];

const entries = [];
for (const o of objects) {
  const place = parseObj(o);
  if (!place.id) continue;
  const urls = [];
  const seen = new Set();
  const add = (u) => {
    if (!u || typeof u !== "string" || seen.has(u)) return;
    seen.add(u);
    urls.push(u);
  };
  add(place.website);
  add(place.sourceUrl);
  const c = place.contact || {};
  for (const k of CHANNELS.concat(["other"])) {
    if (typeof c[k] === "string") {
      if (k === "email") continue; // mailto channels are valid; not fetchable
      for (const u of c[k].match(URL_RE) || []) {
        add(u.startsWith("http") ? u : "https://" + u);
      }
    }
  }
  entries.push({ id: place.id, name: place.name, urls: [...new Set(urls)], contact: c, website: place.website, sourceUrl: place.sourceUrl });
}

// Check URL with fetch
async function check(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "veganhearts-map-audit/1.0" },
    });
    clearTimeout(t);
    return { status: res.status, finalUrl: res.url };
  } catch (e) {
    clearTimeout(t);
    return { status: 0, error: e.cause?.code || e.message };
  }
}

// Run checks
const allUrls = [...new Set(entries.flatMap((e) => e.urls))];
const results = new Map();
let i = 0;
for (const u of allUrls) {
  results.set(u, await check(u));
  i++;
  if (i % 20 === 0) console.error(`checked ${i}/${allUrls.length}`);
}

// Classify
const DEAD = (r) => r.status === 0 || r.status === 404 || r.status === 410 || r.status === 451;
const BAD = (r) => r.status >= 400;

let deadCount = 0;
let badCount = 0;
for (const [id, e] of entries.map((e, idx) => [idx, e])) {
  const problems = [];
  for (const u of e.urls) {
    const r = results.get(u);
    if (!r) continue;
    if (DEAD(r)) {
      problems.push(`DEAD ${r.status || r.error} ${u}`);
      deadCount++;
    } else if (BAD(r)) {
      problems.push(`HTTP ${r.status} ${u}`);
      badCount++;
    }
  }
  // No real contact channel at all?
  const c = e.contact;
  const hasChannel = CHANNELS.some((k) => c[k]);
  const hasLink = e.website || e.sourceUrl || e.urls.length > 0;
  const noContact = !hasChannel && !hasLink;
  if (problems.length || noContact) {
    console.log(`\n### ${e.name} (${e.id})`);
    if (noContact) console.log("  ⚠️ NO CONTACT CHANNEL AND NO LINK ANYWHERE");
    for (const p of problems) console.log(`  ❌ ${p}`);
  }
}

console.log(`\n---\nTotal entries: ${entries.length}`);
console.log(`Dead URLs: ${deadCount}, other HTTP errors: ${badCount}, URLs checked: ${allUrls.length}`);
