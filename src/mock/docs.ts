export type DocBlock =
  | { type: 'text'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; text: string };

export interface DocSection {
  id: string;
  heading: string;
  blocks: DocBlock[];
}

export interface DocArticle {
  slug: string;
  title: string;
  summary: string;
  minutes: number;
  sections: DocSection[];
}

export const docs: DocArticle[] = [
  {
    slug: 'quickstart',
    title: 'Quickstart in five minutes',
    summary: 'From a documentation URL to a widget answering on your site, without writing anything.',
    minutes: 4,
    sections: [
      {
        id: 'crawl',
        heading: 'Point it at your docs',
        blocks: [
          {
            type: 'text',
            text: 'Paste one address — usually your help centre root — and start the crawl. Frontdesk follows links inside the same domain and stops at anything that needs a login. A 128 page site takes about six seconds.',
          },
          {
            type: 'text',
            text: 'The summary at the end tells you what was skipped and why. Pages behind a login and PDFs with no text layer are the two common ones. Neither fails silently.',
          },
        ],
      },
      {
        id: 'test',
        heading: 'Ask it the questions you actually get',
        blocks: [
          {
            type: 'text',
            text: 'Open the playground and type the twelve questions your inbox is full of. Every answer shows the passages it came from — click a citation to read the passage without leaving the page.',
          },
          {
            type: 'text',
            text: 'When an answer is wrong, press Fix this answer, write what it should have said, and save. The correction becomes a Manual answers entry and the bot uses it from the next question on.',
          },
        ],
      },
      {
        id: 'embed',
        heading: 'Paste the embed',
        blocks: [
          {
            type: 'text',
            text: 'Copy the snippet from the widget builder and put it before the closing body tag. Nothing else needs to change on your side.',
          },
          {
            type: 'code',
            text: '<script\n  src="https://cdn.frontdesk.io/w.js"\n  data-bot="acme-cloud"\n  defer\n></script>',
          },
          {
            type: 'text',
            text: 'Accent colour, position, greeting and starter questions live in the builder, not in the snippet. Change them and the widget updates without a deploy.',
          },
        ],
      },
      {
        id: 'after',
        heading: 'The first week',
        blocks: [
          {
            type: 'text',
            text: 'Insights ranks the questions the bot could not answer. Working down that list is the whole maintenance job: each answer you add closes a gap that real visitors walked into.',
          },
        ],
      },
    ],
  },
  {
    slug: 'sources',
    title: 'What you can connect',
    summary: 'Crawls, files, written answers and Notion — and what happens when a file cannot be read.',
    minutes: 4,
    sections: [
      {
        id: 'crawl',
        heading: 'A website crawl',
        blocks: [
          {
            type: 'text',
            text: 'Give it a URL and it indexes every page it can reach from there inside the same domain. Subdomains are separate sources. The crawl re-runs once a day, and you can trigger it by hand from the sources table.',
          },
          { type: 'list', items: ['Follows same-domain links only', 'Skips anything behind a login', 'Re-reads daily, or on demand'] },
        ],
      },
      {
        id: 'files',
        heading: 'Files you upload',
        blocks: [
          {
            type: 'text',
            text: 'PDF, Word and plain text. Drag them in and each one reports its parsed page count when it lands. Page counts matter because your plan caps total indexed pages, not files.',
          },
          {
            type: 'text',
            text: 'A scanned PDF has no text layer, so there is nothing to index. Frontdesk marks it failed and tells you the next step rather than quietly ignoring it: run it through OCR and upload it again.',
          },
        ],
      },
      {
        id: 'manual',
        heading: 'Written answers',
        blocks: [
          {
            type: 'text',
            text: 'A question and answer pair you type yourself. These are the highest-precision source you have, because you wrote them for the question that was actually asked. Corrections from the playground and the inbox land here automatically.',
          },
        ],
      },
      {
        id: 'notion',
        heading: 'Notion',
        blocks: [
          {
            type: 'text',
            text: 'Connect a workspace and pick the pages to index. Nested pages come along with their parent, and the pages are re-read once a day.',
          },
        ],
      },
    ],
  },
  {
    slug: 'install-the-widget',
    title: 'Installing the widget',
    summary: 'The same bot on plain HTML, React, WordPress and Webflow.',
    minutes: 3,
    sections: [
      {
        id: 'html',
        heading: 'Plain HTML',
        blocks: [
          { type: 'text', text: 'Before the closing body tag, on every page you want the widget on.' },
          {
            type: 'code',
            text: '<script\n  src="https://cdn.frontdesk.io/w.js"\n  data-bot="acme-cloud"\n  data-accent="#E5A33C"\n  data-position="bottom-right"\n  defer\n></script>',
          },
        ],
      },
      {
        id: 'react',
        heading: 'React',
        blocks: [
          {
            type: 'text',
            text: 'The component mounts the same script and cleans up after itself, so it is safe in a single page app where routes change under it.',
          },
          {
            type: 'code',
            text: "import { Frontdesk } from '@frontdesk/react';\n\nexport function Layout({ children }) {\n  return (\n    <>\n      {children}\n      <Frontdesk botId=\"acme-cloud\" />\n    </>\n  );\n}",
          },
        ],
      },
      {
        id: 'wordpress',
        heading: 'WordPress',
        blocks: [
          {
            type: 'text',
            text: 'Install the Frontdesk plugin, open Settings → Frontdesk, and paste the bot id. The plugin adds the script to every page, including posts.',
          },
        ],
      },
      {
        id: 'webflow',
        heading: 'Webflow',
        blocks: [
          {
            type: 'text',
            text: 'Project settings → Custom code → Footer code, then publish. Webflow only applies custom code on published sites, so the widget will not appear in the designer preview.',
          },
        ],
      },
      {
        id: 'settings',
        heading: 'Everything else is a setting',
        blocks: [
          {
            type: 'text',
            text: 'Only the bot id has to be in your markup. Accent, position, greeting, starter questions and whether citations show are read at load time from the builder, so a change goes live without touching your site.',
          },
        ],
      },
    ],
  },
  {
    slug: 'citations-and-strictness',
    title: 'Citations and the strictness slider',
    summary: 'How an answer proves where it came from, and what to do when it has nothing to prove.',
    minutes: 4,
    sections: [
      {
        id: 'citations',
        heading: 'Every answer carries its sources',
        blocks: [
          {
            type: 'text',
            text: 'An answer ends with the passages it was written from. Clicking one expands the passage underneath the answer — it does not navigate away, because checking a citation should not cost you the conversation.',
          },
          {
            type: 'text',
            text: 'You can turn citations off for visitors in the widget builder. They stay on inside the playground and the inbox either way, because that is where you are judging the bot rather than using it.',
          },
        ],
      },
      {
        id: 'strictness',
        heading: 'What the slider changes',
        blocks: [
          {
            type: 'text',
            text: 'Strictness controls how far an answer may travel from the text it found.',
          },
          {
            type: 'list',
            items: [
              'Sources only — answers verbatim from a passage, or says it could not find one',
              'Mostly sources — rephrases a passage to fit the question, but adds nothing',
              'May infer — joins related passages when nothing matches outright',
            ],
          },
          {
            type: 'text',
            text: 'The default sits near the strict end. Support answers are read by people who will act on them, and a confident wrong answer costs more than an honest gap.',
          },
        ],
      },
      {
        id: 'unanswered',
        heading: 'When nothing matches',
        blocks: [
          {
            type: 'text',
            text: 'The bot says so, names the closest document it has, and offers an Add an answer button. It does not improvise, and it does not pad the reply to look busy.',
          },
          {
            type: 'text',
            text: 'Those moments are collected in Insights, ranked by how often they happen, so the gaps that cost you the most are the ones at the top of the list.',
          },
        ],
      },
    ],
  },
];

export const docBySlug = (slug: string) => docs.find((article) => article.slug === slug);
