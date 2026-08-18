export type Device = 'desktop' | 'mobile' | 'tablet';

export interface Turn {
  role: 'visitor' | 'bot';
  text: string;
  citation?: string;
  /** Set when the bot had nothing to answer from. */
  unanswered?: boolean;
}

export interface Conversation {
  id: string;
  startedAt: string;
  /** The page the visitor was on when they opened the widget. */
  page: string;
  device: Device;
  rating: 'up' | 'down' | null;
  email?: string;
  escalated?: boolean;
  language?: string;
  turns: Turn[];
}

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const conversations: Conversation[] = [
  {
    id: 'c-01',
    startedAt: daysAgo(0.2),
    page: '/pricing',
    device: 'desktop',
    rating: 'up',
    turns: [
      { role: 'visitor', text: 'Is annual billing cheaper?' },
      {
        role: 'bot',
        text: 'Annual billing is charged once and includes two months at no cost.',
        citation: 'pricing-sheet-2026.pdf, p.8',
      },
    ],
  },
  {
    id: 'c-02',
    startedAt: daysAgo(0.6),
    page: '/docs/api',
    device: 'desktop',
    rating: 'down',
    turns: [
      { role: 'visitor', text: 'Does the API support webhooks for seat changes?' },
      {
        role: 'bot',
        text: 'The API allows 60 requests per minute on Starter and 600 on Growth.',
        citation: 'docs.acmecloud.com/api/limits',
      },
      { role: 'visitor', text: 'That is not what I asked.' },
    ],
  },
  {
    id: 'c-03',
    startedAt: daysAgo(1.1),
    page: '/security',
    device: 'mobile',
    rating: null,
    email: 'lena@northwind.io',
    turns: [
      { role: 'visitor', text: 'Do you have a SOC 2 report we can review?' },
      {
        role: 'bot',
        text: 'I could not find this in the sources I have been given, so I am not going to guess at it.',
        unanswered: true,
      },
      { role: 'visitor', text: 'lena@northwind.io — send it over when you can.' },
    ],
  },
  {
    id: 'c-04',
    startedAt: daysAgo(2.3),
    page: '/docs/getting-started',
    device: 'desktop',
    rating: 'up',
    turns: [
      { role: 'visitor', text: 'How do I invite a teammate?' },
      {
        role: 'bot',
        text: 'Settings → Team → Invite member. Pick a role: admin, editor or viewer.',
        citation: 'onboarding-guide.pdf, p.4',
      },
    ],
  },
  {
    id: 'c-05',
    startedAt: daysAgo(3.4),
    page: '/pricing',
    device: 'mobile',
    rating: 'down',
    turns: [
      { role: 'visitor', text: 'Can I pay by invoice instead of a card?' },
      {
        role: 'bot',
        text: 'Invoices are charged to the card on file on the first of each month.',
        citation: 'pricing-sheet-2026.pdf, p.8',
      },
      { role: 'visitor', text: 'I meant bank transfer.' },
    ],
  },
  {
    id: 'c-06',
    startedAt: daysAgo(4.8),
    page: '/',
    device: 'desktop',
    rating: null,
    escalated: true,
    email: 'tom@brightfold.com',
    turns: [
      { role: 'visitor', text: 'Our workspace is locked out after an SSO change.' },
      {
        role: 'bot',
        text: 'SAML single sign-on is configured under Settings → Security.',
        citation: 'security-overview.pdf, p.14',
      },
      { role: 'visitor', text: 'I need a person. This is blocking the whole team.' },
      { role: 'bot', text: 'Passing this to the support team at support@acmecloud.com.' },
    ],
  },
  {
    id: 'c-07',
    startedAt: daysAgo(6.2),
    page: '/docs/regions',
    device: 'tablet',
    rating: 'up',
    turns: [
      { role: 'visitor', text: 'Where is my data stored?' },
      {
        role: 'bot',
        text: 'In the region you pick at creation: eu-central in Frankfurt or us-east in Virginia.',
        citation: 'security-overview.pdf, p.6',
      },
    ],
  },
  {
    id: 'c-08',
    startedAt: daysAgo(8.5),
    page: '/pricing',
    device: 'desktop',
    rating: null,
    language: 'German',
    turns: [
      { role: 'visitor', text: 'Wie viele Sitze sind im Starter-Tarif enthalten?' },
      {
        role: 'bot',
        text: 'Starter includes 3 seats. Additional seats are $12 per seat per month.',
        citation: 'pricing-sheet-2026.pdf, p.2',
      },
    ],
  },
  {
    id: 'c-09',
    startedAt: daysAgo(11.7),
    page: '/docs/api',
    device: 'desktop',
    rating: 'down',
    turns: [
      { role: 'visitor', text: 'What happens to my data if we cancel?' },
      {
        role: 'bot',
        text: 'Backups are retained for 30 days.',
        citation: 'security-overview.pdf, p.11',
      },
      { role: 'visitor', text: 'Does that mean it is deleted on day 31 or kept?' },
    ],
  },
  {
    id: 'c-10',
    startedAt: daysAgo(16.4),
    page: '/integrations',
    device: 'mobile',
    rating: null,
    turns: [
      { role: 'visitor', text: 'Do you integrate with Zapier?' },
      {
        role: 'bot',
        text: 'Nothing in the current sources covers this. I would rather tell you that than improvise.',
        unanswered: true,
      },
    ],
  },
  {
    id: 'c-11',
    startedAt: daysAgo(24.9),
    page: '/docs/getting-started',
    device: 'desktop',
    rating: 'up',
    turns: [
      { role: 'visitor', text: 'How long does the trial run?' },
      {
        role: 'bot',
        text: 'Free has no time limit. It caps at 100 answers a month and one seat.',
        citation: 'pricing-sheet-2026.pdf, p.2',
      },
    ],
  },
  {
    id: 'c-12',
    startedAt: daysAgo(34.2),
    page: '/security',
    device: 'desktop',
    rating: null,
    turns: [
      { role: 'visitor', text: 'Is there an audit log?' },
      {
        role: 'bot',
        text: 'Audit logs are retained for 12 months on the Growth plan.',
        citation: 'security-overview.pdf, p.11',
      },
    ],
  },
];

export const isUnanswered = (c: Conversation) => c.turns.some((t) => t.unanswered);
