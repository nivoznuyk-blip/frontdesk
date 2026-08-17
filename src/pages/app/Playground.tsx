import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Globe, Link2, MessageSquareQuote, Plus } from 'lucide-react';
import { Badge, Button, Panel, Select, Skeleton, SkeletonRows, Slider, useToast } from '@/components/ui';
import { ChatThread } from '@/components/chat/ChatThread';
import type { Stage } from '@/components/chat/ChatThread';
import { Composer } from '@/components/chat/Composer';
import type { Message } from '@/components/chat/ChatMessage';
import { bot } from '@/mock/company';
import { fallback, suggestedQuestions } from '@/mock/chatScripts';
import { sources } from '@/mock/sources';
import type { SourceKind } from '@/mock/sources';
import { closestSource, matchScript } from '@/lib/match';
import { count } from '@/lib/format';
import { delay } from '@/lib/delay';
import { cn } from '@/lib/cn';

const kindIcon: Record<SourceKind, typeof Globe> = {
  crawl: Globe,
  file: FileText,
  qa: MessageSquareQuote,
};

export default function Playground() {
  const navigate = useNavigate();
  const toast = useToast();
  const nextId = useRef(0);

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage | null>(null);
  const [documents, setDocuments] = useState(1);
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState(bot.models[0].value);
  const [strictness, setStrictness] = useState(bot.defaultStrictness);

  useEffect(() => {
    let live = true;
    delay(600).then(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const lastAnswer = [...messages].reverse().find((m) => m.role === 'bot');
  const usedSourceIds = lastAnswer?.usedSourceIds ?? [];

  async function ask(question: string) {
    nextId.current += 1;
    const turn = nextId.current;

    setBusy(true);
    setMessages((prev) => [...prev, { id: `q${turn}`, role: 'user', text: question }]);

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

    setMessages((prev) => [
      ...prev,
      script
        ? {
            id: `a${turn}`,
            role: 'bot',
            text: script.answer,
            stream: true,
            citations: script.citations,
            usedSourceIds: used,
          }
        : {
            id: `a${turn}`,
            role: 'bot',
            text: fallback.answer,
            stream: true,
            usedSourceIds: [],
            unanswered: { closest: closestSource(question), closing: fallback.closing },
          },
    ]);
    setBusy(false);
  }

  function rate(id: string, rating: 'up' | 'down') {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, rating } : m)));
    toast.push(rating === 'up' ? 'marked as a good answer' : 'marked for review', 'neutral');
  }

  function markCorrected(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, corrected: true } : m)));
  }

  async function shareTestLink() {
    try {
      await navigator.clipboard.writeText(`https://app.frontdesk.io/t/${bot.id}`);
      toast.push('test link copied', 'success');
    } catch {
      toast.push('could not reach the clipboard', 'danger');
    }
  }

  if (loading) {
    return (
      <div className="flex h-full gap-6">
        <section className="flex min-w-0 flex-1 flex-col gap-6 rounded-md border border-line bg-surface p-6">
          <Skeleton className="h-4 w-1/3" />
          <SkeletonRows rows={3} />
          <Skeleton className="h-4 w-2/3" />
        </section>
        <aside className="flex w-context shrink-0 flex-col gap-4">
          <Panel title="Sources">
            <SkeletonRows rows={4} />
          </Panel>
        </aside>
      </div>
    );
  }

  if (sources.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex max-w-measure flex-col items-start gap-4 rounded-md border border-line bg-surface p-6">
          <span className="font-mono text-micro text-faint">no sources yet</span>
          <h2 className="text-h3 font-medium">Nothing behind the desk yet</h2>
          <p className="text-dim">
            The bot answers from what you give it. Point it at your help centre, or upload a
            handful of PDFs, and it will have something to work with.
          </p>
          <Button variant="primary" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/app/sources')}>
            Add the first source
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="font-mono text-micro text-faint">
          last trained {count(bot.lastTrainedMinutes)} minutes ago
        </span>
        <Button size="sm" variant="ghost" className="ml-auto" iconLeft={<Link2 size={14} />} onClick={shareTestLink}>
          Share test link
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 gap-6">
        <section className="flex min-w-0 flex-1 flex-col rounded-md border border-line bg-surface">
          <ChatThread
            messages={messages}
            stage={stage}
            documents={documents}
            onRate={rate}
            onCorrect={markCorrected}
            header={
              messages.length === 0 ? (
                <div className="flex flex-col gap-4">
                  <p className="max-w-measure text-dim">
                    Ask what a customer would ask. Every answer shows the passages it came from,
                    and anything outside the sources comes back unanswered rather than invented.
                  </p>
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
                </div>
              ) : undefined
            }
          />
          <Composer onSend={ask} busy={busy} />
        </section>

        <aside className="flex w-context shrink-0 flex-col gap-4 overflow-y-auto">
          <Panel title="Sources" meta={`${count(sources.length)} connected`}>
            <ul className="flex flex-col gap-px">
              {sources.map((source) => {
                const Icon = kindIcon[source.kind];
                const used = usedSourceIds.includes(source.id);
                return (
                  <li key={source.id} className="flex flex-col gap-1 py-2">
                    <div className="flex items-center gap-3">
                      <Icon
                        size={14}
                        aria-hidden
                        className={cn(
                          'shrink-0',
                          source.status === 'failed' ? 'text-danger' : used ? 'text-amber' : 'text-faint',
                        )}
                      />
                      <span className={cn('truncate text-sm', used ? 'text-text' : 'text-dim')}>
                        {source.name}
                      </span>
                      {used && <span className="ml-auto font-mono text-micro text-amber">used</span>}
                      {source.status === 'failed' && (
                        <span className="ml-auto">
                          <Badge tone="danger" dot>
                            failed
                          </Badge>
                        </span>
                      )}
                    </div>
                    {source.problem && (
                      <p className="max-w-measure pl-6 text-micro text-faint">{source.problem}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel title="Answering">
            <div className="flex flex-col gap-6">
              <Select
                label="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                options={bot.models}
              />
              <div className="flex flex-col gap-2">
                <Slider
                  label="strictness"
                  value={strictness}
                  onChange={setStrictness}
                  readout={strictness <= 33 ? 'sources only' : strictness <= 66 ? 'mostly sources' : 'may infer'}
                />
                <div className="flex justify-between font-mono text-micro text-faint">
                  <span>only answer from sources</span>
                  <span>allowed to infer</span>
                </div>
              </div>
            </div>
          </Panel>

          <Button variant="secondary" iconLeft={<Plus size={14} />} onClick={() => navigate('/app/sources')}>
            Add a source
          </Button>
        </aside>
      </div>
    </div>
  );
}
