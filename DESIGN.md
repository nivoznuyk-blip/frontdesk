# Frontdesk — design system

## 1. Direction

An instrument panel, not a landing page template. Dark, warm, dense, precise. Every number is monospace. Structure comes from hairlines and alignment, never from stacked cards with shadows.

The reference feeling: a well-built piece of measurement equipment. Nothing decorative survives.

**Deliberate deviation from the obvious.** Near-black plus acid green is the default that every generated dark interface arrives at. We keep the dark base but move two things: the black is warm, not neutral, and the accent is sodium amber — the color of an actual amber phosphor terminal. It belongs to the subject's world and is not the reflex choice.

## 2. Forbidden

Non-negotiable. If any of these appear, the work is wrong.

- Purple or violet in any role
- Gradients of any kind, including subtle ones on buttons and backgrounds
- Glow, neon, bloom, box-shadow used decoratively
- Glassmorphism, backdrop blur, frosted panels
- Mesh backgrounds, noise textures, animated blobs, particle fields
- Fully rounded pill buttons
- Icons inside colored circular badges
- Emoji anywhere in the interface
- Inter as the interface typeface
- Center-aligned body paragraphs
- Generic stock illustration or 3D blobs
- Any color value not defined in section 3
- The words: unleash, supercharge, seamless, empower, transform your, revolutionize, effortlessly

## 3. Color

Defined once in `src/styles/tokens.css`. Nothing in the codebase may write a raw hex value outside this file.

```css
:root {
  --bg:              #0C0B0A;
  --surface:         #131211;
  --surface-raised:  #1A1918;
  --surface-sunken:  #080807;

  --border:          #26241F;
  --border-strong:   #3A3730;

  --text:            #F0EDE6;
  --text-dim:        #A09B90;
  --text-faint:      #7D776B;

  --amber:           #E5A33C;
  --amber-hover:     #F2B658;
  --amber-dim:       #8A6220;
  --amber-wash:      #201808;
  --on-amber:        #201400;

  --cite:            #7FA4C4;
  --cite-wash:       #101820;

  --success:         #7FB069;
  --danger:          #D9605A;
  --danger-wash:     #241211;
  --warning:         #C9A227;
}
```

Rules:

- Amber is the single accent. One amber element per view, and it is the primary action. Never two.
- `--cite` is reserved for citations and source references. It never becomes a general secondary color.
- Semantic colors appear only on status, never as decoration.
- Text on an amber fill is `--on-amber`, never white and never black.

## 4. Type

Two families, self-hosted in `public/fonts` as woff2 with `font-display: swap`. Never load from Google Fonts — GitHub Pages should serve everything.

- **Satoshi** — interface and display. Free from Fontshare.
- **Geist Mono** — data, metadata, code, timestamps, counts, IDs, statuses, and the labels on data fields. Free from Vercel.

The monospace is not just for code blocks. It is the signal that this is an instrument. Any number a user reads is monospace.

The exception is prose. A field someone writes sentences into — a greeting, a corrected answer — is labelled in Satoshi, sentence case. Monospace labels a reading; the interface font labels a piece of writing.

Scale, in px:

| Role | Size | Weight | Tracking | Line height |
|---|---|---|---|---|
| Display | 60 | 500 | -0.03em | 1.05 |
| H1 | 44 | 500 | -0.025em | 1.1 |
| H2 | 30 | 500 | -0.02em | 1.15 |
| H3 | 22 | 500 | -0.01em | 1.25 |
| Body large | 18 | 400 | 0 | 1.55 |
| Body | 15 | 400 | 0 | 1.6 |
| Small | 13 | 400 | 0 | 1.5 |
| Code | 12.5 | 400 | 0 | 1.7 |
| Mono label | 12 | 400 | 0.02em | 1.4 |
| Mono micro | 11 | 400 | 0.03em | 1.4 |

Two weights only: 400 and 500. Never 600 or 700 — heavy weights on a dark background bloom and read cheap.

No step between 30 and 44. The jump is intentional: contrast instead of gradation.

## 5. Space, radius, border

Base unit 4px. Allowed values: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.

Radius: `--r-sm: 4px` for controls, `--r-md: 6px` for panels, `0` for table rows and full-bleed sections. Nothing above 6px. No pills.

Borders are always 1px `--border`. `--border-strong` only on hover and focus. Never a border and a shadow on the same element.

Content container: 1180px. Landing sections have 96px vertical padding on desktop, 56px on mobile.

## 6. Components

**Button** — height 36px, radius 4, padding 0 16px, 13px/500.
- Primary: `--amber` fill, `--on-amber` text. Hover `--amber-hover`. One per view.
- Secondary: transparent, 1px `--border-strong`, `--text`. Hover background `--surface-raised`.
- Ghost: transparent, no border, `--text-dim`. Hover `--text`.
- Active state on all: `transform: scale(0.985)`.

**Input** — height 36px, `--surface` background, 1px `--border`, radius 4. Focus: border becomes `--amber-dim` plus a 1px inset ring. Placeholder in `--text-faint`.

The placeholder follows the field. A short data field — url, email, name — takes a real example and never a repeat of the label: `docs.yourcompany.com`, not `Enter a URL`. A free text field takes an invitation to write, because no single example fits every case, and a concrete one either contradicts the context it appears in or repeats a suggestion already on screen.

**Panel** — `--surface`, 1px `--border`, radius 6, padding 16 or 24. No shadow. Panels do not nest more than one deep.

**Table** — no outer border, no zebra striping. 1px `--border` between rows only. Row height 44px. Header row in mono 11px `--text-faint`. Hover: row background `--surface`. Numeric columns right-aligned and monospace with tabular figures.

**Badge** — mono 11px, radius 4, padding 3px 8px, background is the matching wash, text is the matching color.

**Code block** — `--surface-sunken`, 1px `--border`, radius 6, Geist Mono 12.5px, line height 1.7. Copy button in the top right, and it swaps to a check for 2 seconds after copying.

**Chat bubble** — bot messages have no bubble at all: plain text on the page with a 2px `--border-strong` left rule. User messages get a `--surface-raised` fill, radius 6, max width 80%. This asymmetry is deliberate — the bot's words read as content, the user's as input.

**Citation chip** — inline, mono 11px, `--cite-wash` background, `--cite` text, 1px `--cite` border at 30% opacity. Click expands the passage inline beneath the answer.

**Toast** — bottom left, not center. `--surface-raised`, 1px `--border-strong`, mono 12px. Auto-dismiss at 4s.

**Modal** — used only for destructive confirmation. Everything else is inline or a side panel.

## 7. Motion

Durations: `--d-fast: 120ms`, `--d-base: 180ms`, `--d-slow: 260ms`.
Easing: `--ease: cubic-bezier(0.2, 0.8, 0.2, 1)`.

Animate `transform` and `opacity` only. Nothing longer than 320ms except the deliberate crawl sequence in onboarding.

Where motion is spent, in priority order:

1. Token-by-token streaming of every bot answer, with a blinking block cursor at the tail
2. The crawl sequence: URLs streaming past with a running counter
3. Widget preview reacting to settings with no perceptible delay
4. Route transitions: 8px rise plus fade, 180ms
5. Copy button morphing to a check
6. Row hover, focus ring, button press

Everything else stays still. `prefers-reduced-motion: reduce` cuts all of it except the streaming, which jumps straight to the finished text.

## 8. Signature element

**The log line.** A single monospace status strip that runs through the whole product and ties the landing to the app.

- On the landing hero it types out a live crawl.
- In the app it is pinned to the bottom of the shell, showing the last thing the system did: `14:02:11  reindexed 12 pages from docs.acme.com`.
- In onboarding it is the crawl progress itself.
- In the widget builder it echoes each setting change: `14:06:40  accent → #E5A33C`.

It is the one memorable element. Everything around it stays quiet.

## 9. Floor

- Visible focus ring on every interactive element: 2px `--amber` outline with 2px offset, raised above its neighbours so the ring is never painted over. `--amber-dim` at 1px was tried first and reads as another hairline against `--bg` — it clears WCAG's 3:1 by a hair and disappears in practice.
- Contrast: body text against `--bg` clears 4.5:1, `--text-faint` is used only for non-essential metadata
- Every icon-only button has an `aria-label`
- Landing works down to 390px
- Playground and widget builder degrade gracefully on mobile; the remaining app screens may show a note pointing to desktop
- `prefers-reduced-motion` respected
- Every route sets its own `document.title`
