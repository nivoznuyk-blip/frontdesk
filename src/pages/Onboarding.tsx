import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { ChatThread } from '@/components/chat/ChatThread';
import type { Stage } from '@/components/chat/ChatThread';
import { Composer } from '@/components/chat/Composer';
import type { Message } from '@/components/chat/ChatMessage';
import { LogLine } from '@/components/layout/LogLine';
import { useLog, useLogger } from '@/store/log';
import { CRAWL_TICK, crawlPaths, crawlSummary } from '@/mock/crawl';
import { fallbackFor, suggestedQuestions } from '@/mock/chatScripts';
import { closestSource, matchScript } from '@/lib/match';
import { count } from '@/lib/format';
import { delay } from '@/lib/delay';
import { cn } from '@/lib/cn';

const steps = ['point at your docs', 'crawl', 'ask your bot something'];

const cleanUrl = (value: string) => value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');

export default function Onboarding() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const log = useLogger();
  const entries = useLog((state) => state.entries).filter((entry) => entry.screen === pathname);

  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [lines, setLines] = useState<string[]>([]);
  const [found, setFound] = useState(0);
  const [crawled, setCrawled] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage | null>(null);
  const [documents, setDocuments] = useState(1);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState('');
  const turn = useRef(0);
  const misses = useRef(0);

  const domain = cleanUrl(url) || 'docs.acmecloud.com';
  const answered = messages.some((m) => m.role === 'bot');

  function startCrawl() {
    const target = cleanUrl(url);
    if (!target.includes('.')) {
      setError('That does not look like an address. Try docs.yourcompany.com.');
      return;
    }
    setError(null);
    setStep(2);
  }

  // The crawl itself: lines print bottom to top while the counter runs ahead of them.
  useEffect(() => {
    if (step !== 2 || crawled) return;
    let live = true;

    (async () => {
      for (let i = 0; i < crawlPaths.length; i += 1) {
        await delay(CRAWL_TICK);
        if (!live) return;
        const path = `${domain}${crawlPaths[i]}`;
        setLines((prev) => [...prev, path]);
        setFound(Math.round(((i + 1) / crawlPaths.length) * crawlSummary.found));
        log(`crawling ${path}`);
      }
      if (!live) return;
      setCrawled(true);
      log(`crawled ${count(crawlSummary.found)} pages, ${count(crawlSummary.indexed)} indexed`);
    })();

    return () => {
      live = false;
    };
  }, [step, crawled, domain, log]);

  async function ask(question: string) {
    turn.current += 1;
    const id = turn.current;

    setBusy(true);
    setMessages((prev) => [...prev, { id: `q${id}`, role: 'user', text: question }]);

    setStage('searching');
    await delay(650);
    const script = matchScript(question);
    const used = script ? [...new Set(script.citations.map((c) => c.sourceId))] : [];
    setDocuments(script ? used.length : 1);
    setStage('reading');
    await delay(850);
    setStage('writing');
    await delay(350);
    setStage(null);

    const variant = fallbackFor(misses.current);
    setMessages((prev) => [
      ...prev,
      script
        ? { id: `a${id}`, role: 'bot', text: script.answer, stream: true, citations: script.citations }
        : {
            id: `a${id}`,
            role: 'bot',
            text: variant.answer,
            stream: true,
            unanswered: { closest: closestSource(question), closing: variant.closing },
          },
    ]);
    if (!script) misses.current += 1;
    setBusy(false);
    log(script ? 'answered from the sources' : 'no source covered that question');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="shrink-0 border-b border-line">
        <div className="mx-auto flex h-16 max-w-flow items-center gap-6 px-6">
          <Link to="/" className="font-mono text-sm text-text">
            frontdesk<span className="text-amber-dim">_</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 font-mono text-micro">
            {steps.map((label, index) => (
              <span
                key={label}
                className={cn(
                  index + 1 === step ? 'text-amber' : index + 1 < step ? 'text-dim' : 'text-faint',
                )}
              >
                0{index + 1} {label}
                {index < steps.length - 1 && <span className="pl-3 text-faint">→</span>}
              </span>
            ))}
          </div>
          {step > 1 && (
            <Link
              to="/app"
              className="ml-auto shrink-0 font-mono text-micro text-faint transition-colors duration-fast ease-std hover:text-dim"
            >
              skip and explore sample data
            </Link>
          )}
        </div>
      </header>

      <main className="flex flex-1 justify-center px-6 py-16">
        <div className="flex w-full max-w-flow flex-col gap-8">
          {step === 1 && (
            <>
              <div className="flex flex-col gap-3">
                <h1 className="text-h1 font-medium">Point the bot at your docs</h1>
                <p className="max-w-measure text-lg text-dim">
                  One address is enough. Frontdesk reads what is there, follows the links inside the
                  same domain, and stops at anything behind a login.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  label="documentation url"
                  mono
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && startCrawl()}
                  placeholder="docs.yourcompany.com"
                  error={error ?? undefined}
                />
                <div>
                  <Button variant="primary" iconRight={<ArrowRight size={14} />} onClick={startCrawl}>
                    Start the crawl
                  </Button>
                </div>
                <Link to="/app/sources" className="text-sm text-dim transition-colors duration-fast ease-std hover:text-text">
                  or upload files instead
                </Link>
                <Link to="/app" className="font-mono text-micro text-faint">
                  or skip and explore sample data
                </Link>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex flex-col gap-3">
                <h1 className="text-h1 font-medium">{crawled ? 'Your bot has read it' : 'Reading your docs'}</h1>
                <p className="max-w-measure text-lg text-dim">
                  {crawled
                    ? 'Every page below is now something the bot can answer from, and cite.'
                    : `Following links inside ${domain}. This takes a few seconds.`}
                </p>
              </div>

              <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-6">
                <div className="flex items-baseline justify-between gap-6">
                  <span className="font-mono text-micro text-faint">pages found</span>
                  <span className="font-mono text-h2 text-text tnum">{count(found)}</span>
                </div>

                <div className="flex h-32 flex-col justify-end gap-1 overflow-hidden rounded-sm border border-line bg-sunken p-3">
                  {lines.slice(-5).map((line, index, visible) => (
                    <span
                      key={`${line}-${index}`}
                      className={cn(
                        // shrink-0: truncate sets overflow:hidden, which lets a flex item
                        // shrink to nothing vertically — the lines squash as the list fills.
                        // w-full + min-w-0: without them the item keeps its full text width,
                        // so the ellipsis never fires and the parent clips mid-character.
                        'w-full min-w-0 shrink-0 truncate font-mono text-micro',
                        index === visible.length - 1 ? 'text-dim' : 'text-faint',
                      )}
                    >
                      {line}
                    </span>
                  ))}
                </div>

                {crawled && (
                  <dl className="flex flex-col gap-2 border-t border-line pt-4 font-mono text-micro">
                    <div className="flex justify-between gap-4">
                      <dt className="text-faint">found</dt>
                      <dd className="text-dim tnum">{count(crawlSummary.found)} pages</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-faint">indexed</dt>
                      <dd className="text-dim tnum">{count(crawlSummary.indexed)} pages</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-faint">skipped</dt>
                      <dd className="text-dim tnum">{count(crawlSummary.skipped)} pages</dd>
                    </div>
                    {crawlSummary.reasons.map((item) => (
                      <div key={item.reason} className="flex justify-between gap-4">
                        <dt className="text-faint">why</dt>
                        <dd className="max-w-measure text-right text-faint">
                          {count(item.count)} {item.reason}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              {crawled && (
                <div>
                  <Button variant="primary" iconRight={<ArrowRight size={14} />} onClick={() => setStep(3)}>
                    Ask it something
                  </Button>
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex flex-col gap-3">
                <h1 className="text-h1 font-medium">Ask your bot something</h1>
                <p className="max-w-measure text-lg text-dim">
                  It answers from the pages it just read, and shows which one each answer came from.
                </p>
              </div>

              <section className="flex flex-col rounded-md border border-line bg-surface">
                <ChatThread
                  messages={messages}
                  stage={stage}
                  documents={documents}
                  showActions={false}
                  onRate={() => {}}
                  onCorrect={() => {}}
                  header={
                    messages.length === 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question) => (
                          <button
                            key={question}
                            type="button"
                            onClick={() => ask(question)}
                            className="rounded-sm border border-line bg-bg px-3 py-2 text-sm text-dim transition-colors duration-fast ease-std hover:border-line-strong hover:text-text"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    ) : undefined
                  }
                />
                <Composer onSend={ask} busy={busy} />
              </section>

              {answered && (
                <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-6">
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-micro text-amber-dim">one last thing</span>
                    <h2 className="text-h3 font-medium">Save this bot</h2>
                    <p className="max-w-measure text-dim">
                      Leave an address and this bot, its sources and its answers are waiting when you
                      come back. Nothing is sent to your visitors yet.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-0 flex-1">
                      <Input
                        label="email"
                        mono
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                      />
                    </div>
                    <Button
                      variant="primary"
                      iconRight={<ArrowRight size={14} />}
                      disabled={!email.trim()}
                      onClick={() => navigate('/app')}
                    >
                      Save this bot
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <LogLine entries={entries} className="shrink-0" />
    </div>
  );
}
