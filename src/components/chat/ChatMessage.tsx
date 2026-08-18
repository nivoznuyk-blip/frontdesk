import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button, Textarea, useToast } from '@/components/ui';
import { CitationChip } from './CitationChip';
import { StreamingText } from './StreamingText';
import { count } from '@/lib/format';
import { sourceIcon } from '@/lib/sourceIcon';
import type { Citation } from '@/mock/chatScripts';
import type { Source } from '@/mock/sources';

export interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  /** Streams in on arrival. Older answers render whole. */
  stream?: boolean;
  citations?: Citation[];
  usedSourceIds?: string[];
  /** Set when nothing matched: the answer offers this document instead. */
  unanswered?: { closest: Source | null; closing: string };
  rating?: 'up' | 'down';
  corrected?: boolean;
}

export function ChatMessage({
  message,
  onRate,
  onCorrect,
  onStreamDone,
  showActions = true,
}: {
  message: Message;
  onRate: (id: string, rating: 'up' | 'down') => void;
  onCorrect: (id: string) => void;
  onStreamDone: () => void;
  /** Off during onboarding: rating and fixing are an operator's job, not a visitor's. */
  showActions?: boolean;
}) {
  const [openCitation, setOpenCitation] = useState<string | null>(null);
  const [correcting, setCorrecting] = useState(false);
  const [draft, setDraft] = useState('');
  const toast = useToast();

  // Escape backs out of whatever is open, innermost first.
  useEffect(() => {
    if (!openCitation && !correcting) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (openCitation) setOpenCitation(null);
      else setCorrecting(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openCitation, correcting]);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-bubble rounded-md bg-raised px-4 py-3 text-base text-text">{message.text}</p>
      </div>
    );
  }

  const citation = message.citations?.find((c) => c.id === openCitation);
  const closest = message.unanswered?.closest ?? null;
  const ClosestIcon = closest ? sourceIcon[closest.kind] : null;

  function saveCorrection() {
    if (!draft.trim()) return;
    setCorrecting(false);
    setDraft('');
    onCorrect(message.id);
    toast.push('saved to Manual answers', 'success');
  }

  return (
    <div className="flex flex-col gap-4 border-l-2 border-line-strong pl-4">
      {message.stream ? (
        <StreamingText text={message.text} onDone={onStreamDone} />
      ) : (
        <p className="whitespace-pre-wrap text-base text-text">{message.text}</p>
      )}

      {message.unanswered && (
        <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4">
          {closest && ClosestIcon && (
            <>
              <span className="font-mono text-micro text-faint">closest document</span>
              <div className="flex items-center gap-3">
                <ClosestIcon size={14} className="shrink-0 text-faint" aria-hidden />
                <span className="text-sm text-text">{closest.name}</span>
                <span className="font-mono text-micro text-faint tnum">
                  {count(closest.pages)} pages
                </span>
              </div>
            </>
          )}
          <p className="max-w-measure text-sm text-dim">{message.unanswered.closing}</p>
          <div>
            <Button size="sm" variant="secondary" iconLeft={<Plus size={14} />} onClick={() => setCorrecting(true)}>
              Add an answer
            </Button>
          </div>
        </div>
      )}

      {message.citations && message.citations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {message.citations.map((c) => (
            <CitationChip
              key={c.id}
              citation={c}
              open={openCitation === c.id}
              onToggle={() => setOpenCitation(openCitation === c.id ? null : c.id)}
            />
          ))}
        </div>
      )}

      {/* The open chip is the heading — repeating the label here said it twice. */}
      {citation && (
        <div className="rounded-md border border-line bg-surface p-4">
          <p className="max-w-measure text-sm text-dim">{citation.passage}</p>
        </div>
      )}

      {showActions && (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          aria-label="This answer was helpful"
          aria-pressed={message.rating === 'up'}
          onClick={() => onRate(message.id, 'up')}
        >
          <ThumbsUp size={14} aria-hidden className={message.rating === 'up' ? 'text-success' : undefined} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          aria-label="This answer was wrong"
          aria-pressed={message.rating === 'down'}
          onClick={() => onRate(message.id, 'down')}
        >
          <ThumbsDown size={14} aria-hidden className={message.rating === 'down' ? 'text-danger' : undefined} />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCorrecting((open) => !open)}>
          Fix this answer
        </Button>
        {message.corrected && (
          <span className="font-mono text-micro text-faint">
            saved to{' '}
            <Link to="/app/sources" className="text-cite">
              Manual answers
            </Link>
          </span>
        )}
      </div>
      )}

      {correcting && (
        <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4">
          <Textarea
            label="The answer it should give"
            labelTone="prose"
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Write it in full, the way you would say it to a customer."
          />
          <div className="flex items-center gap-3">
            <Button size="sm" variant="secondary" onClick={saveCorrection} disabled={!draft.trim()}>
              Save as a manual answer
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setCorrecting(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
