export type ChangeKind = 'shipped' | 'improved' | 'fixed';

export interface ChangelogEntry {
  version: string;
  date: string;
  kind: ChangeKind;
  title: string;
  points: string[];
}

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const changelog: ChangelogEntry[] = [
  {
    version: '1.9.0',
    date: daysAgo(4),
    kind: 'shipped',
    title: 'Notion as a source',
    points: [
      'Connect a workspace and pick pages to index. Nested pages come with their parent.',
      'Re-read once a day, at the same time as website crawls.',
      'Notion pages count towards your page limit like any other source.',
    ],
  },
  {
    version: '1.8.2',
    date: daysAgo(9),
    kind: 'fixed',
    title: 'Scanned PDFs failed without saying why',
    points: [
      'A PDF with no text layer used to sit at 0 pages with an indexed badge.',
      'It now reports failed, explains that it is a scan, and tells you to run OCR and upload again.',
      'The row expands to the explanation instead of showing a toast that disappears.',
    ],
  },
  {
    version: '1.8.1',
    date: daysAgo(15),
    kind: 'improved',
    title: 'Crawler stops indexing the same page twice',
    points: [
      'Query strings and trailing slashes now resolve to one page.',
      'A 412 page help centre came out at 389 pages after the change, with no loss in answers.',
      'Existing sources pick this up on their next daily run.',
    ],
  },
  {
    version: '1.8.0',
    date: daysAgo(23),
    kind: 'shipped',
    title: 'Answer review queue',
    points: [
      'Every thumbs down lands in a queue instead of only a chart.',
      'Correcting one writes a Manual answers entry and links it from the conversation.',
      'Starter and Growth. The free plan keeps the inbox without the queue.',
    ],
  },
  {
    version: '1.7.1',
    date: daysAgo(38),
    kind: 'fixed',
    title: 'Widget sat on top of cookie banners',
    points: [
      'The launcher used a z-index high enough to cover consent dialogs on three customer sites.',
      'It now sits below anything with a higher stacking context and shifts up when a banner is present.',
    ],
  },
  {
    version: '1.7.0',
    date: daysAgo(52),
    kind: 'improved',
    title: 'Citations expand where you are reading',
    points: [
      'Clicking a citation used to open the source document in a new tab.',
      'The passage now expands under the answer, so you keep the conversation while you check it.',
      'Long passages are trimmed to the matched section with the surrounding sentence kept.',
    ],
  },
  {
    version: '1.6.0',
    date: daysAgo(67),
    kind: 'shipped',
    title: 'Strictness slider',
    points: [
      'Three positions: sources only, mostly sources, may infer.',
      'New workspaces start near the strict end.',
      'The setting is per bot, not per conversation.',
    ],
  },
  {
    version: '1.5.0',
    date: daysAgo(84),
    kind: 'shipped',
    title: 'Human handoff by email',
    points: [
      'A visitor who asks for a person gets the conversation forwarded to an address you set.',
      'The transcript and the page they were on go with it, so nobody starts from nothing.',
      'Starter and Growth.',
    ],
  },
];
