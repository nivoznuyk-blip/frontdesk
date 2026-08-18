export interface UnansweredQuestion {
  id: string;
  question: string;
  /** How many visitors asked it in the reporting window. */
  count: number;
  lastAsked: string;
}

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

export const summary = {
  conversations: 128,
  /** Share that ended without a person stepping in. */
  resolvedWithoutHuman: 86,
  /** Share of rated answers that got a thumbs up. */
  positiveRatings: 91,
};

export const unansweredQuestions: UnansweredQuestion[] = [
  { id: 'u-1', question: 'Do you have a SOC 2 report?', count: 24, lastAsked: daysAgo(0.3) },
  { id: 'u-2', question: 'Can I pay by bank transfer?', count: 18, lastAsked: daysAgo(1.2) },
  { id: 'u-3', question: 'Do you integrate with Zapier?', count: 12, lastAsked: daysAgo(2.6) },
  { id: 'u-4', question: 'Is there a student discount?', count: 9, lastAsked: daysAgo(4.1) },
  { id: 'u-5', question: 'Can I export everything as CSV?', count: 6, lastAsked: daysAgo(6.8) },
  { id: 'u-6', question: 'Do you support webhooks for seat changes?', count: 4, lastAsked: daysAgo(9.5) },
  { id: 'u-7', question: 'Is the mobile app on Android?', count: 3, lastAsked: daysAgo(12.3) },
];

export const answeredQuestions = [
  { id: 'a-1', question: 'How do I invite a teammate?', count: 46 },
  { id: 'a-2', question: 'Where is my data stored?', count: 38 },
  { id: 'a-3', question: 'What are the API rate limits?', count: 31 },
  { id: 'a-4', question: 'How does annual billing work?', count: 27 },
  { id: 'a-5', question: 'How long do you keep deleted data?', count: 19 },
  { id: 'a-6', question: 'Do you support SAML?', count: 14 },
];
