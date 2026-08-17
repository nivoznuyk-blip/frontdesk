# Working in this repository

Read `PRD.md` for what to build and `DESIGN.md` for how it should look. Those two files are authoritative. If something here conflicts with them, they win.

## What this is

Frontdesk — a clickable prototype of a chatbot builder, deployed as a static site on GitHub Pages. It is a portfolio piece judged on design quality, product thinking, and attention to detail.

## Hard constraints

- **No backend. No server code. No API calls to anything.** Every piece of data comes from `src/mock/`. If a task seems to need a server, mock it with a timed promise.
- **Static build only.** The output of `npm run build` is uploaded to GitHub Pages as-is.
- **No secrets in the repository.** There are none to leak, and none should be introduced.
- **No raw hex values outside `src/styles/tokens.css`.** Use CSS variables. If a needed color does not exist, stop and ask rather than inventing one.
- **No new dependencies without asking.** The list in the next section is the whole list.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS, configured to read the CSS variables from `tokens.css` — no arbitrary color values in class names
- Framer Motion for animation
- React Router v6, `BrowserRouter`
- Zustand for the small amount of shared state
- lucide-react for icons

## Structure

```
public/
  fonts/              Satoshi and Geist Mono woff2, self-hosted
  CNAME               only if a custom domain is used
src/
  styles/
    tokens.css        single source of truth for color, type, spacing, motion
  components/
    ui/               Button, Input, Panel, Table, Badge, CodeBlock, Toast, Tabs, Tooltip
    layout/           MarketingNav, MarketingFooter, AppShell, AppSidebar, LogLine
    chat/             ChatThread, ChatMessage, CitationChip, Composer, StreamingText
    widget/           WidgetPreview, WidgetLauncher, EmbedCode
  mock/
    company.ts        Acme Cloud
    sources.ts
    conversations.ts
    insights.ts
    chatScripts.ts    scripted answers plus the mandatory fallback
    plans.ts
  store/              Zustand slices, persisted to localStorage
  pages/
    marketing/        Landing, Pricing, Docs, Changelog, WidgetDemo, Login, NotFound
    app/              Playground, Sources, Inbox, WidgetBuilder, Insights, Settings
    Onboarding.tsx
  lib/                formatting helpers, keyword matcher, fake streaming
```

## Conventions

- Function components, named exports, no default exports except pages.
- Props typed inline, no `any`, no `React.FC`.
- Tailwind for layout and spacing. CSS variables for color and type. If a class list passes about 12 utilities, extract a component.
- All user-visible strings live in the component, not in a translation layer. There is no i18n.
- Every number rendered to the screen goes through a formatter in `src/lib/format.ts`. No raw floats.
- Fake async uses `src/lib/delay.ts`, never a bare `setTimeout` scattered in components.
- State that a user would expect to survive a refresh (widget settings, onboarding progress, plan) persists to localStorage. Chat history does not.

## Build order

Do not skip ahead. Each layer is reviewed before the next begins.

1. **Tokens and primitives.** `tokens.css`, Tailwind config, and every component in `components/ui`. Ship a `/kitchen-sink` route showing all of them in all states. Nothing else is built until this route looks right.
2. **Shells.** `MarketingNav`, `MarketingFooter`, `AppShell` with sidebar and the log line, routing, and empty page stubs.
3. **App screens**, one per session, in this order: Playground, Sources, Widget builder, Inbox, Insights, Settings.
4. **Onboarding.**
5. **Marketing pages**, last, so real screenshots of the app can be used inside them: Landing, Pricing, Docs, Changelog, Widget demo, Login, 404.
6. **Motion pass.** All animation defined once as shared Framer Motion variants in `src/lib/motion.ts`, then applied.
7. **Copy pass.** Rewrite every string in the product against the voice rules in `PRD.md` section 4, including empty states, errors, placeholders, and button labels.
8. **Detail pass.** Favicon, per-route titles, OG image, keyboard shortcuts, focus rings, responsive check, reduced motion.

## Definition of done, per screen

A screen is not finished until it has: the loaded state, a skeleton loading state, an empty state, at least one error or edge state, working keyboard focus, and no string that a real product would not ship.

## Commands

```
npm run dev        local development
npm run build      production build, then copies dist/index.html to dist/404.html
npm run preview    check the production build locally
```

## Deployment

GitHub Pages via Actions on push to `main`.

- If the repository is named `<user>.github.io`, leave `base` as `/` in `vite.config.ts`.
- Otherwise set `base: '/<repo-name>/'`. Getting this wrong produces a blank page in production.
- The `dist/404.html` copy is what makes deep links like `/app/widget` work on Pages. Do not remove it from the build script.
- The build must produce no console errors and no console warnings.

## When you are unsure

Ask rather than invent. Specifically: never invent a color, never invent a plan limit, never invent a product feature that is not in `PRD.md`, and never add a section to a page that the PRD does not list.
