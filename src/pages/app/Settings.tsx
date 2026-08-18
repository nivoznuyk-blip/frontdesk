import { useState } from 'react';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { Badge, Button, Modal, Panel, Table, useToast } from '@/components/ui';
import type { Column } from '@/components/ui';
import { indexedPages, useSources } from '@/store/sources';
import { usePlan } from '@/store/plan';
import { useWidget } from '@/store/widget';
import { useLogger } from '@/store/log';
import { plans } from '@/mock/plans';
import type { PlanId } from '@/mock/plans';
import { apiKey, invoices, team, usage } from '@/mock/company';
import type { Invoice, TeamMember } from '@/mock/company';
import { count, money, percent, relative } from '@/lib/format';
import { cn } from '@/lib/cn';

export default function Settings() {
  const toast = useToast();
  const { plan: planId, setPlan } = usePlan();
  const plan = plans[planId];
  const sources = useSources((state) => state.sources);
  const resetSources = useSources((state) => state.reset);
  const resetWidget = useWidget((state) => state.reset);
  const log = useLogger();

  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirm, setConfirm] = useState<'delete' | 'reset' | null>(null);

  const pagesUsed = indexedPages(sources);
  const seatLimit = plan.teamMembers === 'unlimited' ? null : plan.teamMembers;

  function changePlan(next: PlanId) {
    setPlan(next);
    log(`plan → ${plans[next].name.toLowerCase()}`);
    toast.push(`moved to ${plans[next].name}`, 'success');
  }

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.push('could not reach the clipboard', 'danger');
    }
  }

  function resetDemo() {
    resetSources();
    resetWidget();
    setPlan('starter');
    setConfirm(null);
    log('demo data → reset');
    toast.push('demo data reset', 'success');
  }

  const invoiceColumns: Array<Column<Invoice>> = [
    { key: 'id', header: 'invoice', render: (row) => <span className="font-mono text-sm">{row.id}</span> },
    {
      key: 'date',
      header: 'date',
      width: '140px',
      render: (row) => <span className="font-mono text-micro text-faint tnum">{relative(row.date)}</span>,
    },
    { key: 'amount', header: 'amount', align: 'right', width: '100px', render: (row) => money(row.amount) },
    {
      key: 'status',
      header: 'status',
      width: '120px',
      render: (row) => (
        <Badge tone={row.status === 'paid' ? 'success' : 'neutral'} dot>
          {row.status}
        </Badge>
      ),
    },
  ];

  const teamColumns: Array<Column<TeamMember>> = [
    { key: 'name', header: 'member', render: (row) => <span className="text-sm">{row.name}</span> },
    {
      key: 'email',
      header: 'email',
      render: (row) => <span className="font-mono text-micro text-faint">{row.email}</span>,
    },
    {
      key: 'role',
      header: 'role',
      width: '120px',
      render: (row) => <Badge>{row.role}</Badge>,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-h2 font-medium">Settings</h1>

      <Panel title="Plan" meta={`${plan.name} · ${money(plan.price)} a month`}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <Meter label="pages indexed" used={pagesUsed} limit={plan.pages} />
            <Meter label="answers this month" used={usage.answersThisMonth} limit={plan.answersPerMonth} />
            <Meter label="seats" used={team.length} limit={seatLimit} />
          </div>

          <div className="flex flex-col gap-3 border-t border-line pt-4">
            <span className="font-mono text-micro text-faint">change plan</span>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(plans) as PlanId[]).map((id) => (
                <Button
                  key={id}
                  size="sm"
                  variant={id === planId ? 'primary' : 'secondary'}
                  disabled={id === planId}
                  onClick={() => changePlan(id)}
                >
                  {plans[id].name} · {money(plans[id].price)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Billing history">
        <Table columns={invoiceColumns} rows={invoices} rowKey={(row) => row.id} />
      </Panel>

      <Panel title="Team" meta={`${count(team.length)} of ${plan.teamMembers === 'unlimited' ? 'unlimited' : count(plan.teamMembers)}`}>
        <Table columns={teamColumns} rows={team} rowKey={(row) => row.id} />
      </Panel>

      <Panel title="API key" meta={plan.api ? 'active' : 'Growth only'}>
        {plan.api ? (
          <div className="flex flex-wrap items-center gap-3">
            <code className="min-w-0 flex-1 truncate rounded-sm border border-line bg-sunken px-3 py-2 font-mono text-code text-dim">
              {revealed ? apiKey : `${apiKey.slice(0, 8)}${'•'.repeat(18)}`}
            </code>
            <Button
              size="sm"
              variant="ghost"
              aria-label={revealed ? 'Hide the API key' : 'Reveal the API key'}
              onClick={() => setRevealed((v) => !v)}
            >
              {revealed ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Copy the API key"
              onClick={copyKey}
            >
              {copied ? <Check size={14} aria-hidden className="text-success" /> : <Copy size={14} aria-hidden />}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <span className="font-mono text-micro text-warning">{plan.name} plan</span>
            <p className="max-w-measure text-sm text-text">
              The API and webhooks are on Growth. It also lifts pages to {count(plans.growth.pages)} and
              keeps insights history without a cutoff, for {money(plans.growth.price)} a month.
            </p>
            <div>
              <Button size="sm" variant="secondary" onClick={() => changePlan('growth')}>
                Move to Growth
              </Button>
            </div>
          </div>
        )}
      </Panel>

      <Panel title="Danger zone">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-measure text-sm text-dim">
              Put the demo back to how it shipped: the six seed sources, the default widget and the
              Starter plan.
            </p>
            <Button size="sm" variant="secondary" onClick={() => setConfirm('reset')}>
              Reset demo data
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
            <p className="max-w-measure text-sm text-dim">
              Deleting the bot removes its sources, its conversations and the widget on your site.
            </p>
            <Button size="sm" variant="danger" onClick={() => setConfirm('delete')}>
              Delete bot
            </Button>
          </div>
        </div>
      </Panel>

      <Modal
        open={confirm === 'reset'}
        title="Reset the demo data?"
        onClose={() => setConfirm(null)}
        actions={
          <>
            <Button variant="secondary" onClick={resetDemo}>
              Reset
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
          </>
        }
      >
        Sources, widget settings and the plan go back to their starting values. Anything you added
        while exploring is dropped.
      </Modal>

      <Modal
        open={confirm === 'delete'}
        title="Delete this bot?"
        onClose={() => setConfirm(null)}
        actions={
          <>
            <Button
              variant="danger"
              onClick={() => {
                setConfirm(null);
                toast.push('a real bot would be gone — this one is a demo', 'neutral');
              }}
            >
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
          </>
        }
      >
        {count(pagesUsed)} indexed pages and {count(team.length)} members lose access straight away.
        This cannot be undone.
      </Modal>
    </div>
  );
}

/** A null limit means the plan does not cap this, so there is no bar to fill. */
function Meter({ label, used, limit }: { label: string; used: number; limit: number | null }) {
  if (limit === null) {
    return (
      <div className="flex items-baseline justify-between gap-4 font-mono text-micro">
        <span className="text-faint">{label}</span>
        <span className="text-dim tnum">{count(used)} · no limit</span>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((used / limit) * 100));
  const tone = pct >= 100 ? 'bg-danger' : pct >= 85 ? 'bg-warning' : 'bg-dim';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4 font-mono text-micro">
        <span className="text-faint">{label}</span>
        <span className="text-dim tnum">
          {count(used)} of {count(limit)} · {percent(pct)}
        </span>
      </div>
      <div className="h-1 w-full rounded-sm bg-raised">
        <div className={cn('h-1 rounded-sm', tone)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
