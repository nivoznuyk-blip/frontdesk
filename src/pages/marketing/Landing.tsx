import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout/Container';
import { WidgetLauncher } from '@/components/widget/WidgetLauncher';
import { HeroTerminal } from '@/components/marketing/HeroTerminal';
import { LiveDemo } from '@/components/marketing/LiveDemo';
import { WidgetLab } from '@/components/marketing/WidgetLab';
import { defaultWidget } from '@/mock/widget';
import { EASE } from '@/lib/motion';
import type { ReactNode } from 'react';

const steps = [
  {
    id: 'sources',
    label: 'connect sources',
    title: 'Point it at what you already wrote',
    body: 'A help centre URL, a handful of PDFs, or a Notion workspace. The crawl reports what it skipped and why.',
    shot: 'app/sources',
  },
  {
    id: 'playground',
    label: 'test it',
    title: 'Ask it the questions you actually get',
    body: 'Every answer shows the passages behind it. Wrong ones get corrected in place and become a written answer.',
    shot: 'app · playground',
  },
  {
    id: 'embed',
    label: 'paste the code',
    title: 'One script tag, then it is live',
    body: 'Colour, position and greeting stay editable afterwards, so tuning the widget never needs a deploy.',
    shot: 'app/widget',
  },
];

const capabilities = [
  { title: 'Sources', body: 'Crawls, files, written answers and Notion, in one index.' },
  { title: 'Citations', body: 'Every answer carries the passages it was written from.' },
  { title: 'Answer review', body: 'Thumbs down lands in a queue, and the fix becomes a source.' },
  { title: 'Gap analysis', body: 'The questions it could not answer, ranked by how often they came.' },
  { title: 'Lead capture', body: 'Ask for an address before or after the first answer.' },
  { title: 'Human handoff', body: 'A visitor who wants a person gets one, with the transcript.' },
];

function Section({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="border-t border-line">
      <Container className="flex flex-col gap-8 py-24 max-md:py-14">{children}</Container>
    </section>
  );
}

function ScreenshotSlot({ label }: { label: string }) {
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

export default function Landing() {
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const [pulse, setPulse] = useState(false);

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
              className="inline-flex h-9 items-center rounded-sm px-4 text-sm font-medium text-dim transition-colors duration-fast ease-std hover:text-text"
            >
              See a live bot
            </a>
          </div>
        </Container>

        <motion.div
          className="absolute bottom-12 right-12 max-md:hidden"
          animate={pulse ? { scale: [1, 1.08, 1] } : { scale: 1 }}
          transition={{ duration: 0.52, ease: EASE }}
          onAnimationComplete={() => setPulse(false)}
        >
          <WidgetLauncher accent={defaultWidget.accent} shape={defaultWidget.shape} avatar />
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
              <ScreenshotSlot label={step.shot} />
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

        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-6">
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

          <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-6">
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
            <div key={item.title} className="flex flex-col gap-2 bg-bg p-6">
              <h3 className="text-sm text-text">{item.title}</h3>
              <p className="text-sm text-dim">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
