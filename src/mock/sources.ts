export type SourceKind = 'crawl' | 'file' | 'qa' | 'notion';
export type SourceStatus = 'indexed' | 'crawling' | 'failed';

export interface Source {
  id: string;
  name: string;
  kind: SourceKind;
  /** Pages for a crawl or a file, question and answer pairs for a qa source. */
  pages: number;
  chunks: number;
  status: SourceStatus;
  lastIndexed: string;
  /** Why a source failed, and what to do about it. Only set when status is failed. */
  problem?: string;
  /** Loose subject tags, used to pick the closest document when nothing matches. */
  topics: string[];
  /** The first of what the parser pulled out, shown by the view extracted text action. */
  extract?: string;
}

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export const sources: Source[] = [
  {
    id: 'src-help-center',
    name: 'docs.acmecloud.com',
    kind: 'crawl',
    pages: 412,
    chunks: 3184,
    status: 'indexed',
    lastIndexed: minutesAgo(4),
    topics: ['help', 'guide', 'setup', 'account', 'general'],
    extract:
      'Getting started with Acme Cloud\n\nA workspace is the top level container for your projects, members and billing. Every workspace has a region, set once at creation, and a plan that governs seats and limits. Members are invited by email and hold one of three roles.\n\nNext: Connecting your first project →',
  },
  {
    id: 'src-pricing-sheet',
    name: 'pricing-sheet-2026.pdf',
    kind: 'file',
    pages: 12,
    chunks: 74,
    status: 'indexed',
    lastIndexed: minutesAgo(41),
    topics: ['pricing', 'billing', 'invoice', 'plan', 'seat', 'trial'],
    extract:
      'Acme Cloud — plans and pricing, 2026\n\nFree: 1 seat, 100 answers per month, community support.\nStarter, $39/mo: 3 seats, 2,000 answers, email support, additional seats $12/mo.\nGrowth, $129/mo: unlimited seats, 10,000 answers, priority support, SAML.\n\nAnnual billing is charged once and includes two months at no cost.',
  },
  {
    id: 'src-security',
    name: 'security-overview.pdf',
    kind: 'file',
    pages: 18,
    chunks: 121,
    status: 'indexed',
    lastIndexed: minutesAgo(41),
    topics: ['security', 'retention', 'encryption', 'gdpr', 'region', 'sso', 'saml'],
    extract:
      'Security overview\n\n1. Infrastructure. Acme Cloud runs on managed Kubernetes in two regions, eu-central (Frankfurt) and us-east (Virginia). Customer data does not cross region boundaries.\n\n2. Encryption. Data is encrypted at rest with AES-256 and in transit with TLS 1.3.',
  },
  {
    id: 'src-onboarding-guide',
    name: 'onboarding-guide.pdf',
    kind: 'file',
    pages: 9,
    chunks: 58,
    status: 'indexed',
    lastIndexed: minutesAgo(41),
    topics: ['onboarding', 'invite', 'team', 'role', 'workspace'],
    extract:
      'Onboarding guide\n\nDay one: create the workspace, pick a region, invite the team.\nDay two: connect your first data source and run an import.\nDay three: set up alerting and hand the workspace to the team lead.\n\nSettings → Team → Invite member adds a person by email.',
  },
  {
    id: 'src-manual-qa',
    name: 'Manual answers',
    kind: 'qa',
    pages: 8,
    chunks: 8,
    status: 'indexed',
    lastIndexed: minutesAgo(96),
    topics: ['support', 'refund', 'contact'],
    extract:
      'Q: Do you offer refunds?\nA: Yes, within 14 days of a charge, no questions asked. Write to billing@acmecloud.com with the invoice number.\n\nQ: Can I talk to a person?\nA: Yes. Support is staffed 09:00 to 18:00 CET on working days.',
  },
  {
    id: 'src-scanned-contract',
    name: 'msa-scanned-2019.pdf',
    kind: 'file',
    pages: 0,
    chunks: 0,
    status: 'failed',
    lastIndexed: minutesAgo(96),
    problem: 'This PDF is a scan with no text layer. Run it through OCR, then upload it again.',
    topics: ['contract', 'legal', 'msa'],
  },
];

export const sourceById = (id: string) => sources.find((source) => source.id === id);

/** The broadest source, used as the fallback suggestion when nothing else fits. */
export const helpCenter = sources[0];
