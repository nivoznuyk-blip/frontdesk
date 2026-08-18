export const company = {
  name: 'Acme Cloud',
  domain: 'acmecloud.com',
  docsDomain: 'docs.acmecloud.com',
};

export const bot = {
  id: 'acme-cloud',
  name: 'Acme Cloud support',
  status: 'ready' as const,
  /** Minutes since the last index run, read by the playground header. */
  lastTrainedMinutes: 4,
  models: [
    { value: 'balanced', label: 'Balanced — the default' },
    { value: 'fast', label: 'Fast — cheaper, shorter answers' },
    { value: 'thorough', label: 'Thorough — reads more of each source' },
  ],
  /** 0 answers only from sources, 100 allows the bot to infer. */
  defaultStrictness: 25,
};

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export const team: TeamMember[] = [
  { id: 't-1', name: 'Nina Alvarez', email: 'nina@acmecloud.com', role: 'admin' },
  { id: 't-2', name: 'Pavel Roth', email: 'pavel@acmecloud.com', role: 'editor' },
  { id: 't-3', name: 'Iris Chen', email: 'iris@acmecloud.com', role: 'viewer' },
];

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'refunded';
}

const monthsAgo = (months: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  date.setDate(1);
  return date.toISOString();
};

export const invoices: Invoice[] = [
  { id: 'INV-2026-006', date: monthsAgo(0), amount: 39, status: 'paid' },
  { id: 'INV-2026-005', date: monthsAgo(1), amount: 39, status: 'paid' },
  { id: 'INV-2026-004', date: monthsAgo(2), amount: 39, status: 'paid' },
  { id: 'INV-2026-003', date: monthsAgo(3), amount: 39, status: 'refunded' },
  { id: 'INV-2026-002', date: monthsAgo(4), amount: 39, status: 'paid' },
];

/** Shown masked until the plan includes API access. */
export const apiKey = 'fd_live_7Q2x9Kd3mZpR8vN4tB6yH1cW';

export const usage = {
  answersThisMonth: 1284,
  seatsUsed: 3,
};
