# unified news + events feed - complete

**date**: 2026-01-06
**issue**: #42
**status**: ✅ complete

## what was done

created unified feed on homepage that combines news articles and events into single chronological stream.

### new components

**1. UnifiedFeedCard.tsx**
- consistent card design for both content types
- visual badge to distinguish news (green) vs events (orange)
- dynamic metadata display based on type
- hover effects and smooth transitions
- consistent height despite different content

**2. UnifiedFeed.tsx**
- fetches from `/api/news` and `/api/events` in parallel
- merges arrays and sorts by date (newest first)
- configurable item limit (default: 6)
- loading spinner during fetch
- empty state handling
- dual cta buttons: "all news" + "all events"

### homepage updates

**replaced**: separate "latest news" section
**with**: unified "latest updates" section
- shows 6 most recent items (news + events mixed)
- chronological ordering
- responsive 1/2/3 column grid
- cleaner ux with single source for updates

### card features

**news cards show:**
- featured image
- green "news" badge
- title
- publish date
- author
- tags (max 3)
- excerpt
- "read article" cta

**event cards show:**
- poster image
- orange "event" badge
- title
- event date
- location (or "online")
- description
- "view event" cta

## technical details

- parallel api fetching with `Promise.all`
- type-safe unions with discriminated types (`type: 'news' | 'event'`)
- date sorting using `.getTime()` comparison
- responsive grid with tailwind breakpoints
- consistent hover/transition animations
- proper typescript typing throughout

## user experience improvements

- single place to see latest updates (both news and events)
- chronological stream feels more dynamic
- visual badges make content type immediately clear
- consistent card sizing improves visual flow
- dual cta buttons provide clear next steps

## testing

- build: ✅ successful (no errors)
- dev server: ✅ running on http://localhost:3000
- responsive: grid adapts 1/2/3 columns
- loading state: spinner displays during fetch
- empty state: handled gracefully

## outcome

homepage now has engaging mixed-content feed showing latest news and events chronologically. users see most recent updates regardless of type, with clear visual distinction and consistent design.

