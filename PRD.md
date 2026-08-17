# Frontdesk — product requirements

## 1. What this is

Frontdesk turns a company's existing documentation into a support chatbot. The bot lives in two places: a testing playground inside the app, and an embeddable widget the customer pastes onto their own website.

One sentence for the hero: **ship a support bot that answers from your own docs, and shows where every answer came from.**

## 2. Who it is for

Primary: a technical founder or first support hire at a 5–50 person B2B SaaS company. They already have docs. They are drowning in repeat questions. They do not want to configure conversation trees.

The job they hire us for: *stop answering the same twelve questions, without putting words in my product's mouth that I never wrote.*

## 3. Non-goals

Explicitly out of scope. Do not build these, do not reference them in copy.

- Visual flow builders, intent trees, dialogue nodes
- Voice, phone, WhatsApp, SMS channels
- CRM, ticketing, or helpdesk features beyond a simple inbox
- Team chat, internal messaging
- Anything with the word "agentic" in it

## 4. Brand and voice

Name: **Frontdesk**. The widget in the corner of a website is a front desk — where visitors get met, answered, and pointed somewhere useful.

The visual world is an instrument panel: dark, dense, precise, monospace metadata everywhere. The tension is deliberate — an engineer's tool that produces your company's friendliest surface.

Voice rules:

- Sentence case everywhere. No Title Case, no ALL CAPS.
- Plain verbs. `Add source`, not `Get started with content ingestion`.
- Never say: unleash, supercharge, seamless, empower, revolutionize, effortlessly, powered by AI, transform your.
- Never use exclamation marks in system copy.
- Numbers are specific. `412 pages indexed`, not `thousands of pages`.
- The theme (front desk, shift, logbook) lives in headlines and empty states only. Never in button labels or nav items.
- No emoji anywhere in the product UI.

## 5. Sitemap

```
/                  landing
/pricing           plans
/docs              4 short articles
/docs/:slug
/changelog         8 dated entries
/widget-demo       fake third-party site with the widget installed
/login             fake auth
/start             onboarding, 3 steps
/app               playground (default app screen)
/app/sources
/app/inbox
/app/widget
/app/insights
/app/settings
*                  404
```

## 6. Landing page

Sections in order. Each one earns its place; do not add a testimonial wall, a fake logo bar, or a "trusted by 10,000 teams" counter.

**6.1 Nav** — wordmark `frontdesk_`, links: docs, pricing, changelog. Right side: `sign in`, then the primary button `start free`. Sticky, gains a hairline bottom border on scroll.

**6.2 Hero** — headline, one supporting line, a terminal block that types itself out on load showing a crawl in progress, then two buttons: `start free` (primary) and `see a live bot` (ghost, scrolls to 6.3). Right side, lower: the widget, closed, with a subtle attention pulse once after load.

**6.3 Live demo** — the widget opened, already trained on Frontdesk's own docs. Three suggested questions as clickable chips so the visitor does not have to invent one. Answers stream and carry citation chips. This is the strongest section on the page; give it room.

**6.4 How it works** — three steps, real interface screenshots, not icons: connect sources → test in the playground → paste the embed code.

**6.5 Answers with receipts** — split view. Left: a bot answer. Right: the source document with the cited passage highlighted. Copy addresses the real objection: what stops it from making things up in front of my customers. Mention the strictness control.

**6.6 Widget customizer** — live controls (accent color, position, button shape, greeting) with an instant preview. The visitor touches the product before signing up.

**6.7 Capabilities** — six items, hairline grid, no cards: sources, citations, answer review, gap analysis, lead capture, human handoff. One line each.

**6.8 Three uses** — customer support, internal helpdesk, in-product help. Each with a two-turn example conversation.

**6.9 Why not just ChatGPT** — a short honest comparison. Four rows. This section signals market understanding; do not cut it.

**6.10 Pricing preview** — three plans, condensed, link to `/pricing`.

**6.11 FAQ** — six questions, including the uncomfortable ones: where does my data go, what languages, what happens when it does not know, can I turn it off.

**6.12 Footer** — nav columns, status link, changelog, and an honest note that the Powered by badge stays on the free plan.

## 7. App screens

### 7.1 Playground — `/app`

Two panes. Left is the conversation, right is context.

- Streaming answers, token by token. Never render a whole reply at once.
- Thinking indicator moves through three labelled stages: `searching sources` → `reading 3 documents` → `writing`.
- Every answer ends with citation chips. Clicking one expands the cited passage inline, it does not navigate away.
- Under each answer: thumbs up, thumbs down, and `fix this answer`.
- Right pane: source list with the used ones highlighted for the current answer, a model selector, and a strictness slider from `only answer from sources` to `allowed to infer`.
- Header: bot name, status dot, `last trained 4 minutes ago`, and a `share test link` button.
- Empty state on a brand new bot: an invitation to add the first source, not a blank canvas.

### 7.2 Sources — `/app/sources`

A dense table, one row per source: type icon, name, pages, chunks, status, last indexed, actions.

- Add via: file upload with drag and drop, website crawl by URL, manual question and answer pair, Notion.
- Upload shows per-file progress, then a parsed-page count.
- Row actions: reindex, view extracted text, delete.
- Failure state is required: a scanned PDF that could not be read, with a clear next step rather than a red toast.
- Free plan caps at 10 pages; crossing it shows the inline paywall, not a modal wall.

### 7.3 Inbox — `/app/inbox`

Real conversations from the widget. This is the screen that proves the product has a life after launch.

- List on the left with filters: all, thumbs down, unanswered, left contact.
- Conversation on the right with metadata: page URL the visitor was on, device, timestamp, rating.
- A thumbs-down conversation opens a correction form. The corrected answer is saved as a new Q&A source. Show that link explicitly — the user should see the loop close.
- Free plan shows the last 7 days only, with the boundary visible in the list.

### 7.4 Widget builder — `/app/widget`

Settings on the left, live preview on the right, embed code below.

- Settings: accent color, position, launcher shape, avatar, greeting message, up to 4 starter questions, tone, show citations toggle, mobile behaviour, ask for email before or after, human handoff address.
- Preview updates on every keystroke, rendered inside a mock of a third-party website.
- `Remove Powered by Frontdesk` is present but gated on the free plan.
- Embed code block with tabs: HTML, React, WordPress, Webflow. Copy button turns into a check for 2 seconds.
- `Preview on a real site` opens `/widget-demo`.

### 7.5 Insights — `/app/insights`

One genuinely useful report instead of three decorative charts.

- Top strip: three numbers — conversations, share resolved without a human, average rating.
- Main block: **questions the bot could not answer**, ranked by frequency, each with an `add an answer` button that opens the same form as the inbox correction.
- Secondary: most asked questions that were answered.
- No line chart unless it says something. If in doubt, cut it.
- Free plan: 7 days of history, with the cutoff visible.

### 7.6 Settings — `/app/settings`

Current plan with usage bars, billing history, team members with roles, API key masked and gated to Growth, danger zone with delete bot, and `reset demo data`.

## 8. Onboarding — `/start`

Three steps, and the visitor reaches value before any form.

1. **Point at your docs.** One URL field. A link underneath: `or upload files instead`.
2. **Crawl.** Live progress with URLs streaming past and a running page count. Takes about 6 seconds. Ends with a summary: pages found, pages indexed, pages skipped and why.
3. **Ask your bot something.** Three suggested questions plus a free input. The answer streams with citations.

Only after step 3 do we ask for an email, and the framing is `save this bot`, not `create an account`. A `skip and explore sample data` link is available throughout.

## 9. Plans and gating

| | Free | Starter $39/mo | Growth $129/mo |
|---|---|---|---|
| Bots | 1 | 3 | 10 |
| Answers per month | 100 | 2,000 | 10,000 |
| Pages indexed | 10 | 500 | 5,000 |
| Remove Powered by badge | — | yes | yes |
| Lead capture | — | yes | yes |
| Insights history | 7 days | 30 days | unlimited |
| Answer review queue | — | yes | yes |
| Team members | 1 | 3 | unlimited |
| API and webhooks | — | — | yes |
| Human handoff | — | yes | yes |

Annual billing shows two months free.

Paywalls appear where the limit is actually met, inline and explained: removing the badge in the widget builder, adding a second bot, exceeding pages in sources, scrolling past 7 days in insights. Each one names what unlocks it and what it costs. No interstitials, no countdown timers.

## 10. Mock data

Everything is built around **Acme Cloud**, a fictional B2B product.

- Sources: 412 crawled help center pages, 3 uploaded PDFs (pricing sheet, security overview, onboarding guide), 8 manual Q&A pairs, 1 failed scanned PDF.
- Inbox: 12 conversations. 3 rated thumbs down, 2 left an email address, 1 escalated to a human, 1 in another language.
- Insights: 7 unanswered questions with counts between 3 and 24.
- Chat: 6 scripted question-and-answer pairs with citations, keyed by loose keyword match.
- **Fallback is mandatory.** Any unmatched question gets a real answer shape: the bot says it could not find this in the sources, offers the closest related document, and shows an `add an answer` action. A reviewer will type something unscripted — that moment must look designed, not broken.

## 11. Quality bar

Every screen ships with all of these. A screen without them is not done.

- Loading state using skeletons, not spinners
- Empty state with a headline, one line of body, and one action
- Error state that says what happened and what to do next
- Keyboard focus visible on every interactive element
- Works down to 390px on the landing, and does not break on the playground and widget screens
- No lorem ipsum, no placeholder names, no `Button` labelled `Button`
