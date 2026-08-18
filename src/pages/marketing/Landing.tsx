import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Database, ListChecks, MailOpen, Quote, SearchX, UserRound } from 'lucide-react';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout/Container';
import { WidgetLauncher } from '@/components/widget/WidgetLauncher';
import { HeroTerminal } from '@/components/marketing/HeroTerminal';
import { LiveDemo } from '@/components/marketing/LiveDemo';
import { WidgetLab } from '@/components/marketing/WidgetLab';
import { defaultWidget } from '@/mock/widget';
import { plans } from '@/mock/plans';
import type { PlanId } from '@/mock/plans';
import { count, money } from '@/lib/format';
import { cn } from '@/lib/cn';
import { useAttentionPulse } from '@/lib/motion';
import type { ReactNode } from 'react';

const planOrder: PlanId[] = ['free', 'starter', 'growth'];

const steps = [
  {
    id: 'sources',
    label: 'connect sources',
    title: 'Point it at what you already wrote',
    body: 'A help centre URL, a handful of PDFs, or a Notion workspace. The crawl reports what it skipped and why.',
    shot: 'app/sources',
    file: 'sources.png',
    alt: 'The sources table, with a crawled help centre, three PDFs and one that failed to parse.',
  },
  {
    id: 'playground',
    label: 'test it',
    title: 'Ask it the questions you actually get',
    body: 'Every answer shows the passages behind it. Wrong ones get corrected in place and become a written answer.',
    shot: 'app · playground',
    file: 'playground.png',
    alt: 'The playground, with an answer streaming and its citation chips underneath.',
  },
  {
    id: 'embed',
    label: 'paste the code',
    title: 'One script tag, then it is live',
    body: 'Colour, position and greeting stay editable afterwards, so tuning the widget never needs a deploy.',
    shot: 'app/widget',
    file: 'widget.png',
    alt: 'The widget builder, with settings on the left and a live preview on the right.',
  },
];

const capabilities = [
  { icon: Database, title: 'Sources', body: 'Crawls, files, written answers and Notion, in one index.' },
  { icon: Quote, title: 'Citations', body: 'Every answer carries the passages it was written from.' },
  { icon: ListChecks, title: 'Answer review', body: 'Thumbs down lands in a queue, and the fix becomes a source.' },
  { icon: SearchX, title: 'Gap analysis', body: 'The questions it could not answer, ranked by how often they came.' },
  { icon: MailOpen, title: 'Lead capture', body: 'Ask for an address before or after the first answer.' },
  { icon: UserRound, title: 'Human handoff', body: 'A visitor who wants a person gets one, with the transcript.' },
];

const uses = [
  {
    id: 'support',
    label: 'customer support',
    title: 'On your website',
    body: 'The twelve questions your inbox is full of, answered before they reach a person.',
    turns: [
      { role: 'visitor', text: 'Do you offer refunds?' },
      {
        role: 'bot',
        text: 'Within 14 days of a charge, in full. Write to billing@acmecloud.com with the invoice number and it goes back the same way it came.',
      },
    ],
  },
  {
    id: 'internal',
    label: 'internal helpdesk',
    title: 'For your own team',
    body: 'The handbook nobody reads, answering for itself in the channel where people ask.',
    turns: [
      { role: 'visitor', text: 'How much notice do I need for holiday?' },
      {
        role: 'bot',
        text: 'Two weeks for up to five days, a month for anything longer. Your manager approves it in the people portal.',
      },
    ],
  },
  {
    id: 'in-product',
    label: 'in-product help',
    title: 'Next to the thing being used',
    body: 'Answers where the confusion happens, instead of in a tab someone has to go and find.',
    turns: [
      { role: 'visitor', text: 'Why is my import stuck?' },
      {
        role: 'bot',
        text: 'Imports over 50 MB queue behind smaller ones. If it has been going more than 15 minutes, cancel it and split the file.',
      },
    ],
  },
];

interface Comparison {
  id: string;
  need: string;
  chatgpt: string;
  frontdesk: string;
}

const comparison: Comparison[] = [
  {
    id: 'knows',
    need: 'Knows your documentation',
    chatgpt: 'Only what it was trained on, which does not include your pages',
    frontdesk: 'Indexes the sources you connect, and re-reads them daily',
  },
  {
    id: 'shows',
    need: 'Shows where an answer came from',
    chatgpt: 'No passage to check',
    frontdesk: 'Every answer carries the passages it was written from',
  },
  {
    id: 'lives',
    need: 'Sits where your customers already are',
    chatgpt: 'A separate site they have to think to visit',
    frontdesk: 'A widget in the corner of your own pages',
  },
  {
    id: 'learns',
    need: 'Tells you what it could not answer',
    chatgpt: 'The conversation ends and you never see it',
    frontdesk: 'Unanswered questions ranked, with a place to write the answer',
  },
];

const faq = [
  {
    q: 'Where does my data go?',
    a: 'Into the region you pick when you create the workspace, and nowhere else. Your documents are used to answer your visitors, not to train a model that anyone else benefits from.',
  },
  {
    q: 'What languages does it handle?',
    a: 'It answers in the language the question was asked in, from sources in any language. A visitor writing in German gets German, even when your docs are in English — the citation still points at the English passage.',
  },
  {
    q: 'What happens when it does not know?',
    a: 'It says so, names the closest document it has, and offers to take an answer from you. It does not improvise, and the question goes onto the list of gaps in Insights.',
  },
  {
    q: 'Can I turn it off?',
    a: 'Remove the script tag and it is gone from your site immediately. Your sources and conversations stay in the workspace until you delete them.',
  },
  {
    q: 'Who can see the conversations?',
    a: 'Anyone you invite to the workspace, in the roles you give them. Visitors see only their own conversation, and it is not shown to anyone else who visits.',
  },
  {
    q: 'How long does setup take?',
    a: 'The crawl of a normal help centre runs in under a minute, and the embed is one script tag. Most of the time goes on the part worth doing: reading the first answers and correcting the ones that are wrong.',
  },
];

function Section({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line">
      <Container className="flex flex-col gap-8 py-24 max-md:py-14">{children}</Container>
    </section>
  );
}

/**
 * A real capture of the screen, with the sketch as a fallback until the file is
 * in public/screens. The base path matters here the way it does for the router.
 */
function Screenshot({ file, alt, label }: { file: string; alt: string; label: string }) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <div className="flex aspect-video flex-col justify-between rounded-md border border-line bg-sunken p-4">
        <div className="flex gap-2">
          <div className="h-2 w-12 rounded-sm bg-raised" />
          <div className="h-2 w-8 rounded-sm bg-raised" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-2 w-2/3 rounded-sm bg-raised" />
          <div className="h-2 w-1/2 rounded-sm bg-raised" />
        </div>
        <span className="font-mono text-micro text-faint">{label}</span>
      </div>
    );
  }

  return (
    <img
      src={`${import.meta.env.BASE_URL}screens/${file}`}
      alt={alt}
      loading="lazy"
      onError={() => setMissing(true)}
      className="aspect-video w-full rounded-md border border-line bg-sunken object-cover object-left-top"
    />
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [pulse, setPulse] = useState(false);
  const pulseMotion = useAttentionPulse(pulse);

  useEffect(() => {
    if (reduced) return;
    const id = setTimeout(() => setPulse(true), 900);
    return () => clearTimeout(id);
  }, [reduced]);

  return (
    <div className="flex flex-col">
      {/* 1 — hero */}
      <section className="relative">
        <Container className="flex flex-col gap-8 py-24 max-md:py-14">
          <div className="flex flex-col gap-6">
            <h1 className="max-w-measure text-display font-medium">
              Stop answering the same twelve questions.
            </h1>
            <p className="max-w-measure text-lg text-dim">
              Frontdesk turns the documentation you already wrote into a support bot that answers
              from it, and shows the passage behind every answer.
            </p>
          </div>

          <div className="max-w-flow">
            <HeroTerminal />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/start')}>
              Start free
            </Button>
            <a
              href="#live-demo"
              className="inline-flex h-9 items-center rounded-sm border border-line-strong px-4 text-sm font-medium text-text transition hover:bg-raised active:scale-press"
            >
              See a live bot
            </a>
          </div>
        </Container>

        <motion.div
          className="absolute bottom-12 right-12 max-md:hidden"
          {...pulseMotion}
          onAnimationComplete={() => setPulse(false)}
        >
          <WidgetLauncher
            accent={defaultWidget.accent}
            shape={defaultWidget.shape}
            avatar
            onClick={() => document.getElementById('live-demo')?.scrollIntoView({ block: 'start' })}
          />
        </motion.div>
      </section>

      {/* 2 — live demo */}
      <Section id="live-demo">
        <div className="flex flex-col gap-3">
          <span className="font-mono text-micro text-amber-dim">live</span>
          <h2 className="text-h2 font-medium">Ask our bot about our product</h2>
          <p className="max-w-measure text-lg text-dim">
            Trained on the four articles in our docs, answering with the passages it used. If it
            does not know something, watch what it does instead.
          </p>
        </div>
        <LiveDemo />
        <p className="font-mono text-micro text-faint">
          the same four articles are at{' '}
          <Link to="/docs" className="text-dim transition-colors duration-fast ease-std hover:text-text">
            /docs
          </Link>
        </p>
      </Section>

      {/* 3 — how it works */}
      <Section>
        <h2 className="text-h2 font-medium">Three steps, about ten minutes</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col gap-4">
              <Screenshot file={step.file} alt={step.alt} label={step.shot} />
              <div className="flex flex-col gap-2">
                <span className="font-mono text-micro text-faint">
                  0{index + 1} {step.label}
                </span>
                <h3 className="text-h3 font-medium">{step.title}</h3>
                <p className="text-dim">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 4 — answers with receipts */}
      <Section>
        <div className="flex flex-col gap-3">
          <h2 className="text-h2 font-medium">Answers with receipts</h2>
          <p className="max-w-measure text-lg text-dim">
            The question behind every support bot is the same one: what stops it saying something
            we never wrote, in front of a customer. The answer is that it can only speak from
            passages it can point at — and the strictness setting decides how far it may travel
            from them. New bots start near the strict end.
          </p>
        </div>

        <div className="grid overflow-hidden rounded-md border border-line md:grid-cols-2 md:divide-x md:divide-line">
          <div className="flex flex-col gap-4 bg-surface p-6">
            <span className="font-mono text-micro text-faint">the answer</span>
            <div className="flex flex-col gap-3 border-l-2 border-line-strong pl-4">
              <p className="text-text">
                Backups are retained for 30 days. Records deleted through the app are removed from
                primary storage immediately and from backups within 30 days.
              </p>
              <span className="self-start rounded-sm border border-cite-edge bg-cite-wash px-2 py-px font-mono text-micro text-cite">
                security-overview.pdf, p.11
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-sunken p-6 max-md:border-t max-md:border-line">
            <span className="font-mono text-micro text-faint">security-overview.pdf · page 11</span>
            <div className="flex flex-col gap-3 text-sm text-faint">
              <p>5. Data retention</p>
              <p>
                <span className="bg-cite-wash text-cite">
                  Backups are retained for 30 days. Records deleted through the app are removed from
                  primary storage immediately and from backups within 30 days.
                </span>{' '}
                Immediate purge is available on request.
              </p>
              <p>Audit logs are retained for 12 months on the Growth plan.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* 5 — widget customiser */}
      <Section>
        <div className="flex flex-col gap-3">
          <h2 className="text-h2 font-medium">Make it look like your site</h2>
          <p className="max-w-measure text-lg text-dim">
            These are the real controls. Change something and the preview moves with it, the same
            way it does inside the product.
          </p>
        </div>
        <WidgetLab />
      </Section>

      {/* 6 — capabilities */}
      <Section>
        <h2 className="text-h2 font-medium">What it does</h2>
        <div className="grid gap-px border border-line bg-line md:grid-cols-3">
          {capabilities.map((item) => (
            <div key={item.title} className="flex gap-4 bg-bg p-6">
              <item.icon size={16} aria-hidden className="mt-1 shrink-0 text-faint" />
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-medium text-text">{item.title}</h3>
                <p className="text-sm text-dim">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      {/* 7 — three uses */}
      <Section>
        <div className="flex flex-col gap-3">
          <h2 className="text-h2 font-medium">Three places people put it</h2>
          <p className="max-w-measure text-lg text-dim">
            The same bot with a different audience. What changes is the material you point it at.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {uses.map((use) => (
            <div key={use.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-micro text-faint">{use.label}</span>
                <h3 className="text-h3 font-medium">{use.title}</h3>
                <p className="text-dim">{use.body}</p>
              </div>
              <div className="flex flex-1 flex-col gap-4 border-t border-line pt-4">
                {use.turns.map((turn) => (
                  <div key={turn.text} className="flex flex-col gap-2">
                    <span className="font-mono text-micro text-faint">
                      {turn.role === 'visitor' ? 'a visitor asks' : 'the bot answers'}
                    </span>
                    {turn.role === 'visitor' ? (
                      <p className="rounded-md bg-raised px-3 py-2 text-sm text-text">{turn.text}</p>
                    ) : (
                      <p className="border-l-2 border-line-strong pl-3 text-sm text-text">{turn.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* 8 — why not just ChatGPT */}
      <Section>
        <div className="flex flex-col gap-3">
          <h2 className="text-h2 font-medium">Why not just ChatGPT</h2>
          <p className="max-w-measure text-lg text-dim">
            A fair question, and the honest answer is a narrow one. ChatGPT is better at general
            questions than we will ever be. This is about answering from your material, in front of
            your customers.
          </p>
        </div>

        {/* Hand-built rather than <Table>: the frontdesk column carries its own
            weight — an accent header and a lighter ground — so the comparison
            reads down one column instead of across four rows. */}
        <div className="overflow-hidden rounded-md border border-line">
          <div className="grid grid-cols-3">
            <div className="border-b border-line p-6 font-mono text-micro text-faint">
              what you need
            </div>
            <div className="border-b border-l border-line p-6 font-mono text-micro text-faint">
              a general chatbot
            </div>
            <div className="border-b border-l border-line bg-surface p-6 font-mono text-micro text-amber">
              frontdesk
            </div>

            {comparison.map((row, index) => {
              const line = index < comparison.length - 1 ? 'border-b border-line' : '';
              return (
                <Fragment key={row.id}>
                  <div className={cn('p-6 text-sm text-text', line)}>{row.need}</div>
                  <div className={cn('border-l border-line p-6 text-sm text-faint', line)}>
                    {row.chatgpt}
                  </div>
                  <div className={cn('border-l border-line bg-surface p-6 text-sm text-dim', line)}>
                    {row.frontdesk}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </Section>

      {/* 9 — pricing preview */}
      <Section>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-h2 font-medium">Pricing</h2>
          <Link
            to="/pricing"
            className="inline-flex h-9 items-center gap-2 rounded-sm px-4 text-sm font-medium text-dim transition-colors duration-fast ease-std hover:bg-raised hover:text-text"
          >
            All the limits, side by side
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {planOrder.map((id) => {
            const plan = plans[id];
            return (
              <div
                key={id}
                className={cn(
                  'flex flex-col gap-4 rounded-md border bg-surface p-6',
                  id === 'starter' ? 'border-amber-dim' : 'border-line',
                )}
              >
                <span className="font-mono text-micro text-faint">
                  {plan.name.toLowerCase()}
                  {id === 'starter' && <span className="pl-3 text-amber-dim">recommended</span>}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-h2 text-text tnum">{money(plan.price)}</span>
                  <span className="font-mono text-micro text-faint">a month</span>
                </div>
                <dl className="flex flex-col gap-2 font-mono text-micro">
                  <div className="flex justify-between gap-4">
                    <dt className="text-faint">answers</dt>
                    <dd className="text-dim tnum">{count(plan.answersPerMonth)} a month</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-faint">pages</dt>
                    <dd className="text-dim tnum">{count(plan.pages)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-faint">our badge</dt>
                    <dd className="text-dim">{plan.removesBadge ? 'comes off' : 'stays on'}</dd>
                  </div>
                </dl>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 10 — faq */}
      <Section>
        <h2 className="text-h2 font-medium">Questions we get</h2>
        <dl className="flex flex-col">
          {faq.map((item) => (
            <div
              key={item.q}
              className="grid gap-4 border-b border-line py-6 first:pt-0 last:border-b-0 md:grid-cols-3 md:gap-8"
            >
              <dt className="text-lg text-text">{item.q}</dt>
              <dd className="max-w-measure text-dim md:col-span-2">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* 11 — closing */}
      <Section>
        <div className="flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-measure text-h3 font-medium">
            Point it at your docs and see what it answers.
          </p>
          <Button
            variant="primary"
            iconRight={<ArrowRight size={14} />}
            onClick={() => navigate('/start')}
          >
            Start free
          </Button>
        </div>
      </Section>
    </div>
  );
}
