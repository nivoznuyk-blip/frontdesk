export interface Citation {
  id: string;
  sourceId: string;
  /** What the chip reads, usually a page or section title. */
  label: string;
  passage: string;
}

export interface ChatScript {
  id: string;
  keywords: string[];
  answer: string;
  citations: Citation[];
}

/** Shown as clickable chips above the composer on an empty thread. */
export const suggestedQuestions = [
  'How do I invite a teammate?',
  'What are the API rate limits?',
  'Where is my data stored?',
];

export const chatScripts: ChatScript[] = [
  {
    id: 'invite',
    keywords: ['invite', 'teammate', 'team member', 'colleague', 'seat', 'add a user', 'role'],
    answer:
      'Open Settings, then Team, and use Invite member. You enter an email address and pick a role: admin, editor or viewer. The invite expires after 7 days, and you can resend it from the same screen.\n\nSeats are counted per plan. Starter includes 3, Growth is unlimited.',
    citations: [
      {
        id: 'cit-invite-1',
        sourceId: 'src-onboarding-guide',
        label: 'onboarding-guide.pdf, p.4',
        passage:
          'To add a teammate, go to Settings → Team → Invite member. Enter the email address and choose a role. Admins manage billing and members. Editors change content. Viewers read only. Invitations expire after 7 days.',
      },
      {
        id: 'cit-invite-2',
        sourceId: 'src-pricing-sheet',
        label: 'pricing-sheet-2026.pdf, p.2',
        passage:
          'Seats by plan: Free 1 seat, Starter 3 seats, Growth unlimited seats. Additional seats on Starter are billed at $12 per seat per month.',
      },
    ],
  },
  {
    id: 'rate-limits',
    keywords: ['rate limit', 'ratelimit', 'throttle', 'requests per', 'api limit', '429'],
    answer:
      'The API allows 60 requests per minute on Starter and 600 on Growth, measured per workspace rather than per key. Going over returns 429 with a Retry-After header, and the counter resets on a rolling 60 second window.\n\nBulk imports have their own limit of 5 concurrent jobs.',
    citations: [
      {
        id: 'cit-rate-1',
        sourceId: 'src-help-center',
        label: 'docs.acmecloud.com/api/limits',
        passage:
          'Rate limits are applied per workspace. Starter: 60 requests per minute. Growth: 600 requests per minute. Exceeding the limit returns HTTP 429 with a Retry-After header. The window is rolling, not fixed.',
      },
    ],
  },
  {
    id: 'data-location',
    keywords: ['data stored', 'where is my data', 'region', 'residency', 'gdpr', 'eu', 'hosted'],
    answer:
      'Workspace data sits in the region you pick when you create it: eu-central in Frankfurt or us-east in Virginia. It does not move between regions, and backups stay in the same region.\n\nRegion is set once, at creation. Moving an existing workspace needs a support request.',
    citations: [
      {
        id: 'cit-region-1',
        sourceId: 'src-security',
        label: 'security-overview.pdf, p.6',
        passage:
          'Customer data is stored in the region selected at workspace creation: eu-central (Frankfurt) or us-east (Virginia). Data, including backups and search indexes, does not leave the selected region. Region changes require a migration request to support.',
      },
    ],
  },
  {
    id: 'retention',
    keywords: ['retention', 'how long', 'delete my data', 'deleted', 'backup', 'erase'],
    answer:
      'Deleted records stay in backups for 30 days, then they are removed. If you delete a workspace, everything in it is purged after the same 30 days, and you can ask for immediate deletion instead.\n\nAudit logs are kept for 12 months on Growth.',
    citations: [
      {
        id: 'cit-retention-1',
        sourceId: 'src-security',
        label: 'security-overview.pdf, p.11',
        passage:
          'Backups are retained for 30 days. Records deleted through the app are removed from primary storage immediately and from backups within 30 days. Immediate purge is available on request. Audit logs are retained for 12 months on the Growth plan.',
      },
    ],
  },
  {
    id: 'sso',
    keywords: ['sso', 'saml', 'okta', 'single sign', 'entra', 'azure ad'],
    answer:
      'SAML single sign-on is on the Growth plan. You paste your identity provider metadata URL into Settings → Security, we return the ACS URL and entity ID, and you map email, first name and last name.\n\nOkta, Entra ID and Google Workspace are the tested providers. SCIM provisioning is not supported yet.',
    citations: [
      {
        id: 'cit-sso-1',
        sourceId: 'src-security',
        label: 'security-overview.pdf, p.14',
        passage:
          'SAML 2.0 single sign-on is available on Growth. Configure it under Settings → Security by supplying your IdP metadata URL. Required attribute mappings: email, firstName, lastName. Tested with Okta, Microsoft Entra ID and Google Workspace. SCIM is on the roadmap.',
      },
    ],
  },
  {
    id: 'billing',
    keywords: ['billing', 'invoice', 'receipt', 'card', 'annual', 'upgrade', 'downgrade', 'vat'],
    answer:
      'Invoices are charged to the card on file on the first of each month and land in Settings → Billing as PDFs. Annual billing takes two months off the yearly total.\n\nDowngrades take effect at the end of the current period, so you keep the higher plan until then.',
    citations: [
      {
        id: 'cit-billing-1',
        sourceId: 'src-pricing-sheet',
        label: 'pricing-sheet-2026.pdf, p.8',
        passage:
          'Monthly plans are charged on the first of the month. Annual plans are charged once and include two months at no cost. Downgrades apply at the end of the paid period. Invoices are available as PDF under Settings → Billing and include your VAT number when set.',
      },
    ],
  },
];

/**
 * The answer shape for anything the sources do not cover. Several phrasings,
 * because two unanswered questions in a row should not read as one canned string.
 */
export const fallbacks = [
  {
    answer: 'I could not find this in the sources I have been given, so I am not going to guess at it.',
    closing: 'If this is something the bot should know, add an answer and it is indexed straight away.',
  },
  {
    answer: 'Nothing in the current sources covers this. I would rather tell you that than improvise.',
    closing: 'Add an answer here and the next visitor who asks will get it.',
  },
  {
    answer:
      'That is outside what I have been trained on — there is no passage I can point at for it.',
    closing: 'If someone on your team knows the answer, add it and it becomes part of the sources.',
  },
  {
    answer:
      'I have no answer for this in the sources. Guessing would put words in your product’s mouth.',
    closing: 'Write it once here and every visitor after this one gets it.',
  },
];

/** Cycles through the phrasings so consecutive misses never repeat. */
export const fallbackFor = (turn: number) => fallbacks[turn % fallbacks.length];
