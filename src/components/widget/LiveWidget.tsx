import { useRef, useState } from 'react';
import { Send, X } from 'lucide-react';
import { WidgetLauncher } from './WidgetLauncher';
import { CitationChip } from '@/components/chat/CitationChip';
import { StreamingText } from '@/components/chat/StreamingText';
import { useWidget } from '@/store/widget';
import { fallbackFor } from '@/mock/chatScripts';
import type { Citation } from '@/mock/chatScripts';
import { company } from '@/mock/company';
import { matchScript } from '@/lib/match';
import { onAccent } from '@/lib/contrast';
import { delay } from '@/lib/delay';
import { cn } from '@/lib/cn';

interface Turn {
  id: string;
  role: 'visitor' | 'bot';
  text: string;
  stream?: boolean;
  citations?: Citation[];
  handoff?: boolean;
}

/**
 * The widget as a visitor meets it: real answers, real citations, real fallback.
 * Settings come from the builder, so a change there shows up here.
 */
export function LiveWidget() {
  const settings = useWidget((state) => state.settings);
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [thinking, setThinking] = useState(false);
  const [draft, setDraft] = useState('');
  const [openCitation, setOpenCitation] = useState<string | null>(null);
  const counter = useRef(0);
  const misses = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  const accentText = onAccent(settings.accent);

  const scrollDown = () => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  };

  async function ask(question: string) {
    counter.current += 1;
    const id = counter.current;

    setDraft('');
    setTurns((prev) => [...prev, { id: `q${id}`, role: 'visitor', text: question }]);
    setThinking(true);
    setTimeout(scrollDown, 0);

    await delay(900);
    const script = matchScript(question);
    setThinking(false);

    if (script) {
      setTurns((prev) => [
        ...prev,
        { id: `a${id}`, role: 'bot', text: script.answer, stream: true, citations: script.citations },
      ]);
    } else {
      const variant = fallbackFor(misses.current);
      misses.current += 1;
      setTurns((prev) => [
        ...prev,
        { id: `a${id}`, role: 'bot', text: variant.answer, stream: true, handoff: true },
      ]);
    }
    setTimeout(scrollDown, 0);
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 z-50 flex flex-col items-end gap-3',
        settings.position === 'bottom-right' ? 'right-6' : 'left-6 items-start',
      )}
    >
      {open && (
        <div className="flex h-widget-demo w-context max-w-full flex-col overflow-hidden rounded-md border border-line bg-bg">
          <header
            className="flex h-11 shrink-0 items-center gap-3 px-3"
            style={{ background: settings.accent, color: accentText }}
          >
            {settings.avatar && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-current">
                <span className="font-mono text-micro" style={{ color: settings.accent }}>
                  AC
                </span>
              </span>
            )}
            <span className="truncate text-sm">{company.name}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close the chat" className="ml-auto">
              <X size={14} aria-hidden />
            </button>
          </header>

          <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3 pb-4">
            <p className="border-l-2 border-line-strong pl-3 text-sm text-text">{settings.greeting}</p>

            {turns.length === 0 && settings.starters.length > 0 && (
              <div className="flex flex-col items-start gap-2">
                {settings.starters.filter(Boolean).map((starter) => (
                  <button
                    key={starter}
                    type="button"
                    onClick={() => ask(starter)}
                    className="rounded-sm border border-line px-2 py-1 text-left text-micro text-dim transition-colors duration-fast ease-std hover:border-line-strong hover:text-text"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}

            {turns.map((turn) =>
              turn.role === 'visitor' ? (
                <p
                  key={turn.id}
                  className="ml-auto max-w-bubble rounded-md bg-raised px-3 py-2 text-sm text-text"
                >
                  {turn.text}
                </p>
              ) : (
                <div key={turn.id} className="flex flex-col gap-2 border-l-2 border-line-strong pl-3">
                  {turn.stream ? (
                    <StreamingText text={turn.text} onDone={scrollDown} />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-text">{turn.text}</p>
                  )}

                  {settings.showCitations && turn.citations && (
                    <div className="flex flex-wrap gap-2">
                      {turn.citations.map((citation) => (
                        <CitationChip
                          key={citation.id}
                          citation={citation}
                          open={openCitation === citation.id}
                          onToggle={() =>
                            setOpenCitation(openCitation === citation.id ? null : citation.id)
                          }
                        />
                      ))}
                    </div>
                  )}

                  {settings.showCitations &&
                    turn.citations?.some((c) => c.id === openCitation) && (
                      <p className="rounded-sm border border-line bg-surface p-3 text-micro text-dim">
                        {turn.citations.find((c) => c.id === openCitation)?.passage}
                      </p>
                    )}

                  {turn.handoff && (
                    <a
                      href={`mailto:${settings.handoffEmail}`}
                      className="font-mono text-micro text-faint transition-colors duration-fast ease-std hover:text-dim"
                    >
                      write to {settings.handoffEmail}
                    </a>
                  )}
                </div>
              ),
            )}

            {thinking && (
              <span className="font-mono text-micro text-faint" role="status">
                searching sources…
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 border-t border-line p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && draft.trim() && ask(draft.trim())}
              aria-label="Ask a question"
              placeholder="Ask a question"
              className="h-8 min-w-0 flex-1 rounded-sm border border-line bg-surface px-2 text-sm text-text transition-colors duration-fast ease-std placeholder:text-faint focus:border-amber-dim"
            />
            <button
              type="button"
              onClick={() => draft.trim() && ask(draft.trim())}
              disabled={!draft.trim()}
              aria-label="Send"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm disabled:opacity-40"
              style={{ background: settings.accent, color: accentText }}
            >
              <Send size={14} aria-hidden />
            </button>
          </div>

          {settings.showBadge && (
            <div className="shrink-0 border-t border-line px-3 py-2 text-center font-mono text-micro text-faint">
              Powered by Frontdesk
            </div>
          )}
        </div>
      )}

      <WidgetLauncher
        accent={settings.accent}
        shape={settings.shape}
        avatar={settings.avatar}
        onClick={() => setOpen((v) => !v)}
      />
    </div>
  );
}
