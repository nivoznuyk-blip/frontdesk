/** Paths printed while the crawl runs. The counter climbs faster than the list prints. */
export const crawlPaths = [
  '/', '/getting-started', '/getting-started/workspaces', '/getting-started/regions',
  '/guides/import', '/guides/import/csv', '/guides/import/api', '/guides/exports',
  '/guides/alerting', '/guides/alerting/rules', '/guides/alerting/channels',
  '/account/team', '/account/team/roles', '/account/team/invites', '/account/billing',
  '/account/billing/invoices', '/account/billing/vat', '/account/security',
  '/account/security/sso', '/account/security/audit-log', '/api', '/api/authentication',
  '/api/limits', '/api/pagination', '/api/errors', '/api/webhooks', '/api/changelog',
  '/integrations', '/integrations/slack', '/integrations/github', '/integrations/notion',
  '/troubleshooting', '/troubleshooting/imports', '/troubleshooting/login',
  '/troubleshooting/performance', '/faq', '/faq/billing', '/faq/data', '/status',
  '/legal/terms', '/legal/privacy', '/legal/dpa',
];

export const crawlSummary = {
  found: 128,
  indexed: 124,
  skipped: 4,
  reasons: [
    { count: 3, reason: 'sit behind a login' },
    { count: 1, reason: 'is a PDF with no text layer' },
  ],
};

/** How long the whole run takes, and how often a line prints. */
export const CRAWL_MS = 6000;
export const CRAWL_TICK = CRAWL_MS / crawlPaths.length;
