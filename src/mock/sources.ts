export type SourceKind = 'crawl' | 'file' | 'qa';
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
