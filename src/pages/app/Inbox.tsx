import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Monitor, Smartphone, Tablet, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Badge, Button, Skeleton, Tabs, Textarea, useToast } from '@/components/ui';
import { addManualAnswer } from '@/store/sources';
import { usePlan } from '@/store/plan';
import { plans } from '@/mock/plans';
import { conversations, isUnanswered } from '@/mock/conversations';
import type { Conversation, Device } from '@/mock/conversations';
import { relative } from '@/lib/format';
import { delay } from '@/lib/delay';
import { cn } from '@/lib/cn';

const deviceIcon: Record<Device, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const filters = [
  { value: 'all', label: 'All' },
  { value: 'down', label: 'Thumbs down' },
  { value: 'unanswered', label: 'Unanswered' },
  { value: 'contact', label: 'Left contact' },
];

const DAY = 24 * 60 * 60 * 1000;

export default function Inbox() {
  const toast = useToast();
  const plan = plans[usePlan((state) => state.plan)];

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(conversations[0].id);
  const [correcting, setCorrecting] = useState(false);
  const [draft, setDraft] = useState('');
  const [savedTo, setSavedTo] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    delay(450).then(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const windowDays =
    plan.insightsHistoryDays === 'unlimited' ? Infinity : plan.insightsHistoryDays;

  const withinWindow = (c: Conversation) => Date.now() - new Date(c.startedAt).getTime() <= windowDays * DAY;

  const shown = conversations.filter((c) => {
    if (filter === 'down') return c.rating === 'down';
    if (filter === 'unanswered') return isUnanswered(c);
    if (filter === 'contact') return Boolean(c.email);
    return true;
  });

  const kept = shown.filter(withinWindow);
  const cut = shown.length - kept.length;
  const open = conversations.find((c) => c.id === openId) ?? kept[0];

  function saveCorrection() {
    if (!open || !draft.trim()) return;
    const question = open.turns.find((t) => t.role === 'visitor')?.text ?? 'Visitor question';
    addManualAnswer(question, draft.trim());
    setCorrecting(false);
    setDraft('');
    setSavedTo(open.id);
    toast.push('saved to Manual answers', 'success');
  }

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 gap-6">
        <div className="flex w-context shrink-0 flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-md border border-line bg-surface p-6">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-h2 font-medium">Inbox</h1>
        <span className="font-mono text-micro text-faint tnum">
          {kept.length} of {conversations.length} conversations
        </span>
      </div>

      <Tabs items={filters} value={filter} onChange={setFilter} />

      <div className="flex min-h-0 flex-1 gap-6 max-md:flex-col max-md:overflow-y-auto">
        <div className="flex w-context shrink-0 flex-col overflow-y-auto pr-2 max-md:w-full max-md:overflow-visible">
          {kept.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-md border border-line bg-surface p-4">
              <span className="font-mono text-micro text-faint">nothing here</span>
              <p className="text-sm text-dim">No conversation matches this filter.</p>
              <Button size="sm" variant="ghost" onClick={() => setFilter('all')}>
                Show every conversation
              </Button>
            </div>
          ) : (
            kept.map((c) => {
              const Icon = deviceIcon[c.device];
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setOpenId(c.id);
                    setCorrecting(false);
                  }}
                  className={cn(
                    'flex w-full min-w-0 flex-col gap-2 border-b border-line px-3 py-3 text-left',
                    'transition-colors duration-fast ease-std hover:bg-surface',
                    c.id === open?.id && 'bg-surface',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon size={12} className="shrink-0 text-faint" aria-label={c.device} />
                    <span className="min-w-0 truncate font-mono text-micro text-faint">{c.page}</span>
                    <span className="ml-auto shrink-0 font-mono text-micro text-faint tnum">
                      {relative(c.startedAt)}
                    </span>
                  </span>
                  <span className="w-full truncate text-sm text-text">{c.turns[0].text}</span>
                  <span className="flex flex-wrap items-center gap-2">
                    {c.rating === 'down' && <Badge tone="danger">thumbs down</Badge>}
                    {c.rating === 'up' && <Badge tone="success">thumbs up</Badge>}
                    {isUnanswered(c) && <Badge tone="warning">unanswered</Badge>}
                    {c.email && <Badge>left contact</Badge>}
                    {c.escalated && <Badge tone="amber">escalated</Badge>}
                  </span>
                </button>
              );
            })
          )}

          {cut > 0 && (
            <div className="flex flex-col gap-2 border-t border-dashed border-line px-3 py-4">
              <span className="font-mono text-micro text-faint">
                {cut} older {cut === 1 ? 'conversation' : 'conversations'} not kept
              </span>
              <p className="text-micro text-faint">
                {plan.name} keeps {plan.insightsHistoryDays} days of history.
              </p>
              <Link to="/pricing" className="font-mono text-micro text-faint transition-colors duration-fast ease-std hover:text-dim">
                See plans
              </Link>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto max-md:overflow-visible">
          {open && (
            <div className="flex flex-col gap-6 rounded-md border border-line bg-surface p-6">
              <div className="flex flex-wrap items-center gap-4 border-b border-line pb-4 font-mono text-micro text-faint">
                <span>{open.page}</span>
                <span>{open.device}</span>
                <span className="tnum">{relative(open.startedAt)}</span>
                {open.rating === 'up' && (
                  <span className="flex items-center gap-2 text-success">
                    <ThumbsUp size={12} aria-hidden /> rated helpful
                  </span>
                )}
                {open.rating === 'down' && (
                  <span className="flex items-center gap-2 text-danger">
                    <ThumbsDown size={12} aria-hidden /> rated wrong
                  </span>
                )}
                {open.language && <span>asked in {open.language}</span>}
                {open.email && <span className="text-dim">{open.email}</span>}
              </div>

              <div className="flex flex-col gap-4">
                {open.turns.map((turn, index) =>
                  turn.role === 'visitor' ? (
                    <p
                      key={index}
                      className="ml-auto max-w-bubble rounded-md bg-raised px-4 py-2 text-sm text-text"
                    >
                      {turn.text}
                    </p>
                  ) : (
                    <div key={index} className="flex flex-col gap-2 border-l-2 border-line-strong pl-4">
                      <p className="text-sm text-text">{turn.text}</p>
                      {turn.citation && (
                        <span className="self-start rounded-sm border border-cite-edge bg-cite-wash px-2 py-px font-mono text-micro text-cite">
                          {turn.citation}
                        </span>
                      )}
                    </div>
                  ),
                )}
              </div>

              {(open.rating === 'down' || isUnanswered(open)) && (
                <div className="flex flex-col gap-3 border-t border-line pt-4">
                  {savedTo === open.id ? (
                    <span className="font-mono text-micro text-faint">
                      saved to{' '}
                      <Link to="/app/sources" className="text-cite">
                        Manual answers
                      </Link>{' '}
                      — the bot uses it from the next question on
                    </span>
                  ) : correcting ? (
                    <>
                      <Textarea
                        label="The answer it should have given"
                        labelTone="prose"
                        rows={3}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Write it in full, the way you would say it to a customer."
                      />
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="secondary" onClick={saveCorrection} disabled={!draft.trim()}>
                          Save to Manual answers
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setCorrecting(false)}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div>
                      <Button size="sm" variant="secondary" onClick={() => setCorrecting(true)}>
                        Fix this answer
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
