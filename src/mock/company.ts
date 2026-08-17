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
