'use client';

import { useState } from 'react';
import Image from 'next/image';

// ── Types ─────────────────────────────────────────────────────────────────────

type NavKey = 'home' | 'education' | 'ebook' | 'contact';

// ── Data ──────────────────────────────────────────────────────────────────────

// SVG ellipse coordinates in native image space (1093 × 1280 px).
const HOTSPOTS: Record<NavKey, { cx: number; cy: number; rx: number; ry: number }> = {
  home:      { cx: 197, cy: 456, rx: 100, ry: 36 },
  education: { cx: 204, cy: 565, rx: 112, ry: 38 },
  ebook:     { cx: 196, cy: 670, rx: 106, ry: 44 },
  contact:   { cx: 196, cy: 773, rx:  99, ry: 36 },
};

const NAV: { key: NavKey; label: string }[] = [
  { key: 'home',      label: 'Home' },
  { key: 'education', label: 'Education' },
  { key: 'ebook',     label: 'Free E-book' },
  { key: 'contact',   label: 'Contact' },
];

const CONTENT: Record<NavKey, { title: string; body: string[] }> = {
  home: {
    title: 'Welcome',
    body: [
      'We are so happy you found this space — where everyone is loved as a living being and a precious soul.',
      'Vegan Hearts is a non-profit project of love, an invitation to make a positive change in the world.',
      'May you be vegan, in transition, or just curious — we welcome you with open arms.',
    ],
  },
  education: {
    title: 'Education',
    body: [
      'Our programmes help people understand the connection between food, animals, health, and the planet.',
      'From online courses to workshops, retreats to community gatherings — we meet people where they are and walk with them.',
    ],
  },
  ebook: {
    title: 'Free E-book',
    body: [
      'Awakening your Vegan Heart — a free guide to compassionate living.',
      'Practical tools, gentle wisdom, and real stories from people who have made the shift.',
      'Download it, share it, live it.',
    ],
  },
  contact: {
    title: 'Get in Touch',
    body: [
      'We would love to hear from you — whether you want to collaborate, volunteer, or simply say hello.',
      'We are a small passionate team and every message matters.',
    ],
  },
};

const BACKDROP_W = 1093;
const BACKDROP_H = 1280;

/** Logo position (px from top-left of backdrop container). Edit these. */
const LOGO_LEFT_PX = 24;
const LOGO_TOP_PX = 100;

// ── Component ─────────────────────────────────────────────────────────────────

export default function NatureLanding() {
  const [active, setActive] = useState<NavKey>('home');

  return (
    <div className="flex w-full justify-center bg-white">
      <div
        className="
          relative w-full max-w-[900px]
          shadow-[0_6px_24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)]
          max-md:pb-14
        "
      >
        {/* Intrinsic image height = full backdrop visible; page scrolls */}
        <Image
          src="/nature-backdrop.jpeg"
          alt="Nature backdrop with hand-painted stone navigation"
          width={BACKDROP_W}
          height={BACKDROP_H}
          sizes="(max-width: 900px) 100vw, 900px"
          priority
          className="block h-auto w-full select-none"
        />

        <svg
          viewBox={`0 0 ${BACKDROP_W} ${BACKDROP_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {NAV.map(({ key, label }) => {
            const h = HOTSPOTS[key];
            const isActive = active === key;
            return (
              <ellipse
                key={key}
                cx={h.cx}
                cy={h.cy}
                rx={h.rx}
                ry={h.ry}
                fill={isActive ? 'rgba(255,255,200,0.18)' : 'transparent'}
                stroke={isActive ? 'rgba(255,255,150,0.65)' : 'transparent'}
                strokeWidth="2"
                strokeDasharray={isActive ? '5 4' : '0'}
                className="pointer-events-auto cursor-pointer transition-all duration-200 hover:fill-[rgba(255,255,255,0.12)]"
                role="button"
                tabIndex={0}
                aria-label={label}
                onClick={() => setActive(key)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActive(key)}
              />
            );
          })}
        </svg>

        <div
          className="absolute z-10"
          style={{ left: LOGO_LEFT_PX, top: LOGO_TOP_PX }}
        >
          <div className="rounded-full bg-white/20 p-2 shadow-md backdrop-blur-sm">
            <Image src="/logo.png" alt="Vegan Hearts" width={88} height={88} />
          </div>
        </div>

        {/* top % is relative to backdrop height; long copy extends page scroll */}
        <div
          key={active}
          className="
            font-typewriter animate-fadein
            relative z-10 flex w-full flex-col gap-4 border border-white/20 bg-white/20 p-6 shadow-lg backdrop-blur-sm
            rounded-t-2xl max-md:rounded-b-none
            md:absolute md:right-6 md:top-[22%] md:w-[48%] md:translate-y-[77px] md:rounded-2xl md:p-9
          "
          aria-live="polite"
          aria-label="Page content"
        >
          <h2 className="border-b border-[#1e3a12]/15 pb-3 text-xl tracking-wide text-[#1e3a12] md:text-2xl">
            {CONTENT[active].title}
          </h2>
          <div>
            {CONTENT[active].body.map((para, i) => (
              <p
                key={i}
                className="mb-3 text-sm leading-relaxed text-[#2a4a1a]/80 last:mb-0 md:text-[0.95rem]"
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        <nav
          className="fixed bottom-0 left-1/2 z-20 flex h-14 w-full max-w-[900px] -translate-x-1/2 items-center justify-center gap-2 border-t border-white/10 bg-black/35 px-4 backdrop-blur-sm md:hidden"
          aria-label="Navigation"
        >
          {NAV.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`
                rounded-full border px-3 py-1.5 font-typewriter text-xs transition-all duration-200
                ${active === key
                  ? 'border-[#8bc34a]/60 bg-[#2d6a3a]/80 text-[#e8f5d0]'
                  : 'border-white/20 bg-black/30 text-white/70 hover:border-white/40 hover:text-white/90'}
              `}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
