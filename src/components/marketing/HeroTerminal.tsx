import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { company } from '@/mock/company';
import { count } from '@/lib/format';
import { delay } from '@/lib/delay';

const command = `frontdesk crawl ${company.docsDomain}`;

const steps = [
  { path: '/getting-started', pages: 12 },
  { path: '/api/limits', pages: 87 },
  { path: '/security/sso', pages: 214 },
  { path: '/legal/dpa', pages: 356 },
];

const TOTAL_PAGES = 412;
const CHUNKS = 3184;

/** Types itself once on load: the same crawl the product runs, in miniature. */
export function HeroTerminal() {
  const reduced = useReducedMotion();
  const [typed, setTyped] = useState(reduced ? command.length : 0);
  const [shown, setShown] = useState(reduced ? steps.length : 0);
  const [done, setDone] = useState(Boolean(reduced));

  useEffect(() => {
    if (reduced) return;
    let live = true;

    (async () => {
      for (let i = 1; i <= command.length; i += 1) {
        await delay(24);
        if (!live) return;
        setTyped(i);
      }
      for (let i = 1; i <= steps.length; i += 1) {
        await delay(260);
        if (!live) return;
        setShown(i);
      }
      await delay(320);
      if (!live) return;
      setDone(true);
    })();

    return () => {
      live = false;
    };
  }, [reduced]);

  return (
    <div className="flex h-terminal flex-col gap-1 overflow-hidden rounded-md border border-line bg-sunken p-4 font-mono text-micro">
      <span className="flex shrink-0 gap-2">
        <span className="text-amber-dim">$</span>
        <span className="min-w-0 truncate text-dim">{command.slice(0, typed)}</span>
        {typed < command.length && (
          <span className="inline-block h-3 w-caret shrink-0 animate-blink bg-amber" aria-hidden />
        )}
      </span>

      {steps.slice(0, shown).map((step) => (
        <span key={step.path} className="flex shrink-0 items-baseline gap-3">
          <span className="min-w-0 flex-1 truncate text-faint">
            reading {company.docsDomain}
            {step.path}
          </span>
          <span className="shrink-0 text-dim tnum">{count(step.pages)}</span>
        </span>
      ))}

      {done && (
        <span className="flex shrink-0 items-baseline gap-2 text-text">
          <span className="tnum">{count(TOTAL_PAGES)}</span> pages indexed
          <span className="text-faint">·</span>
          <span className="tnum">{count(CHUNKS)}</span> chunks
          <span className="ml-1 inline-block h-3 w-caret animate-blink bg-amber" aria-hidden />
        </span>
      )}
    </div>
  );
}
