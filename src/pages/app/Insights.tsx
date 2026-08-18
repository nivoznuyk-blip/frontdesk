import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button, Panel, Skeleton, Textarea, useToast } from '@/components/ui';
import { addManualAnswer } from '@/store/sources';
import { usePlan } from '@/store/plan';
import { plans } from '@/mock/plans';
import { answeredQuestions, summary, unansweredQuestions } from '@/mock/insights';
import { count, percent, relative } from '@/lib/format';
import { delay } from '@/lib/delay';
import { useTitle } from '@/lib/useTitle';
import { DesktopOnly } from '@/components/layout/DesktopOnly';

export default function Insights() {
  useTitle('Insights');
  const toast = useToast();
  const plan = plans[usePlan((state) => state.plan)];

  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    let live = true;
    delay(450).then(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  function save(question: string, id: string) {
    if (!draft.trim()) return;
    addManualAnswer(question, draft.trim());
    setSaved((prev) => [...prev, id]);
    setOpenId(null);
    setDraft('');
    toast.push('saved to Manual answers', 'success');
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
      </div>
    );
  }

  return (
    <DesktopOnly screen="Insights">
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-h2 font-medium">Insights</h1>
        <span className="font-mono text-micro text-faint">
          last {plan.insightsHistoryDays === 'unlimited' ? 'all time' : `${plan.insightsHistoryDays} days`} · {plan.name} plan
        </span>
      </div>

      <div className="grid gap-px border border-line bg-line sm:grid-cols-3">
        <Figure label="conversations" value={count(summary.conversations)} />
        <Figure label="resolved without a human" value={percent(summary.resolvedWithoutHuman)} />
        <Figure label="positive ratings" value={percent(summary.positiveRatings)} />
      </div>

      <Panel title="Questions the bot could not answer" meta={`${count(unansweredQuestions.length)} in this window`}>
        <ul className="flex flex-col">
          {unansweredQuestions.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 border-b border-line py-3 last:border-b-0">
              <div className="flex flex-wrap items-baseline gap-4">
                <span className="font-mono text-sm text-text tnum">{count(item.count)}</span>
                <span className="min-w-0 flex-1 text-sm text-text">{item.question}</span>
                <span className="font-mono text-micro text-faint tnum">{relative(item.lastAsked)}</span>
                {saved.includes(item.id) ? (
                  <span className="font-mono text-micro text-faint">
                    saved to{' '}
                    <Link to="/app/sources" className="text-cite">
                      Manual answers
                    </Link>
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={<Plus size={14} />}
                    onClick={() => {
                      setOpenId(openId === item.id ? null : item.id);
                      setDraft('');
                    }}
                  >
                    Add an answer
                  </Button>
                )}
              </div>

              {openId === item.id && (
                <div className="flex flex-col gap-3 rounded-md border border-line bg-bg p-4">
                  <Textarea
                    label="The answer it should give"
                    labelTone="prose"
                    rows={3}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write it in full, the way you would say it to a customer."
                  />
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => save(item.question, item.id)}
                      disabled={!draft.trim()}
                    >
                      Save to Manual answers
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setOpenId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Most asked, and answered" meta="answered from the sources">
        <ul className="flex flex-col">
          {answeredQuestions.map((item) => (
            <li
              key={item.id}
              className="flex items-baseline gap-4 border-b border-line py-3 last:border-b-0"
            >
              <span className="font-mono text-sm text-dim tnum">{count(item.count)}</span>
              <span className="min-w-0 flex-1 text-sm text-dim">{item.question}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
    </DesktopOnly>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2 bg-surface p-4">
      <span className="font-mono text-h2 text-text tnum">{value}</span>
      <span className="font-mono text-micro text-faint">{label}</span>
    </div>
  );
}
