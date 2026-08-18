import type { ChatScript } from './chatScripts';

/** Frontdesk's own bot, trained on the four articles in /docs. */
export const landingScripts: ChatScript[] = [
  {
    id: 'receipts',
    keywords: ['making things up', 'make things up', 'invent', 'hallucinat', 'accurate', 'trust', 'citation'],
    answer:
      'Every answer ends with the passages it was written from. Clicking one expands the passage under the answer, so you can check it without leaving the conversation.\n\nThe strictness setting decides how far an answer may travel from that text. New bots start near the strict end: answer from a passage, or say there is none.',
    citations: [
      {
        id: 'cit-receipts',
        sourceId: 'docs/citations-and-strictness',
        label: 'docs/citations-and-strictness',
        passage:
          'An answer ends with the passages it was written from. Clicking one expands the passage underneath the answer — it does not navigate away, because checking a citation should not cost you the conversation.',
      },
    ],
  },
  {
    id: 'unknown',
    keywords: ['does not know', 'doesn t know', 'no answer', 'cannot find', 'unanswered', 'gap'],
    answer:
      'It says so. The reply names the closest document it has and offers to take an answer from you, rather than padding the response to look useful.\n\nThose moments are collected and ranked by how often they happen, so the gaps that cost you most are at the top of the list.',
    citations: [
      {
        id: 'cit-unknown',
        sourceId: 'docs/citations-and-strictness',
        label: 'docs/citations-and-strictness',
        passage:
          'The bot says so, names the closest document it has, and offers an Add an answer button. It does not improvise, and it does not pad the reply to look busy.',
      },
    ],
  },
  {
    id: 'install',
    keywords: ['install', 'embed', 'set up', 'setup', 'react', 'wordpress', 'webflow', 'script'],
    answer:
      'One script tag before the closing body tag, with your bot id. There are packages for React, a WordPress plugin and a Webflow snippet that do the same thing.\n\nOnly the bot id lives in your markup. Colour, position, greeting and starter questions are read at load time, so changing them never needs a deploy.',
    citations: [
      {
        id: 'cit-install',
        sourceId: 'docs/install-the-widget',
        label: 'docs/install-the-widget',
        passage:
          'Only the bot id has to be in your markup. Accent, position, greeting, starter questions and whether citations show are read at load time from the builder, so a change goes live without touching your site.',
      },
    ],
  },
];

export const landingQuestions = [
  'How do I know it is not making things up?',
  'What happens when it does not know?',
  'How do I install it?',
];

/** The same honest shape the product uses, without the operator-only action. */
export const landingFallback =
  'I could not find that in the Frontdesk docs, so I am not going to guess at it. The four articles cover setup, sources, installing the widget, and how citations work — or ask one of the questions above.';
