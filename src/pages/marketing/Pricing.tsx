import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from '@/components/ui';
import type { Column } from '@/components/ui';
import { Container } from '@/components/layout/Container';
import { plans } from '@/mock/plans';
import type { Plan, PlanId } from '@/mock/plans';
import { count, money } from '@/lib/format';
import { cn } from '@/lib/cn';

const order: PlanId[] = ['free', 'starter', 'growth'];

/** Two months off the yearly total, per PRD §9. */
const MONTHS_BILLED_ANNUALLY = 10;

const summary: Record<PlanId, string> = {
  free: 'One bot, enough answers to see whether it works on your docs.',
  starter: 'A bot on your site, without our name on it, and a person to hand off to.',
  growth: 'Several bots, the API, and history that does not get cut off.',
};

interface Row {
  id: string;
  feature: string;
  free: string;
  starter: string;
  growth: string;
}

const yes = 'yes';
const no = '—';
const seats = (plan: Plan) =>
  plan.teamMembers === 'unlimited' ? 'unlimited' : count(plan.teamMembers);
const history = (plan: Plan) =>
  plan.insightsHistoryDays === 'unlimited' ? 'unlimited' : `${count(plan.insightsHistoryDays)} days`;

const rows: Row[] = [
  { id: 'bots', feature: 'Bots', ...pick((p) => count(p.bots)) },
  { id: 'answers', feature: 'Answers per month', ...pick((p) => count(p.answersPerMonth)) },
  { id: 'pages', feature: 'Pages indexed', ...pick((p) => count(p.pages)) },
  { id: 'badge', feature: 'Remove Powered by badge', ...pick((p) => (p.removesBadge ? yes : no)) },
  { id: 'leads', feature: 'Lead capture', ...pick((p) => (p.leadCapture ? yes : no)) },
  { id: 'history', feature: 'Insights history', ...pick(history) },
  { id: 'review', feature: 'Answer review queue', ...pick((p) => (p.reviewQueue ? yes : no)) },
  { id: 'team', feature: 'Team members', ...pick(seats) },
  { id: 'api', feature: 'API and webhooks', ...pick((p) => (p.api ? yes : no)) },
  { id: 'handoff', feature: 'Human handoff', ...pick((p) => (p.humanHandoff ? yes : no)) },
];

function pick(read: (plan: Plan) => string) {
  return { free: read(plans.free), starter: read(plans.starter), growth: read(plans.growth) };
}

const billingFaq = [
  {
    q: 'What happens when I go over a limit?',
    a: 'Answers keep going out to your visitors for the rest of the month, and we write to you when you pass 80%. Pages and seats are the hard ones: once you are at the cap, the next source or the next invite is blocked until you move up a plan.',
  },
  {
    q: 'Do you refund?',
    a: 'Within 14 days of a charge, in full, without a conversation about why. After that we refund the unused part of an annual plan if you ask.',
  },
  {
    q: 'Can I change plan in the middle of a month?',
    a: 'Upgrades take effect immediately and you pay the difference for the days left. Downgrades take effect at the end of the period you have already paid for, so nothing disappears the moment you click.',
  },
  {
    q: 'What happens to my bot if I stop paying?',
    a: 'It drops to Free limits and the Powered by badge comes back. Your sources and conversations stay where they are for 30 days, so picking the plan back up puts everything back as it was.',
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [annual, setAnnual] = useState(false);

  const columns: Array<Column<Row>> = [
    { key: 'feature', header: '', render: (row) => <span className="text-sm text-text">{row.feature}</span> },
    ...order.map((id) => ({
      key: id,
      header: plans[id].name.toLowerCase(),
      align: 'right' as const,
      width: '132px',
      render: (row: Row) => (
        <span className={cn('font-mono text-sm tnum', row[id] === no ? 'text-faint' : 'text-dim')}>
          {row[id]}
        </span>
      ),
    })),
  ];

  return (
    <Container className="flex flex-col gap-24 py-24">
      <header className="flex flex-col gap-6">
        <h1 className="text-h1 font-medium">Pricing</h1>
        <p className="max-w-measure text-lg text-dim">
          Every workspace starts on Free and stays there until it runs into a limit. The paid plans
          exist for volume, for taking our name off the widget, and for handing a visitor to a person.
        </p>

        <div
          className="flex w-fit items-center gap-px rounded-sm border border-line p-px"
          role="group"
          aria-label="Billing period"
        >
          {[
            { value: false, label: 'Monthly' },
            { value: true, label: 'Annual — two months free' },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={annual === option.value}
              onClick={() => setAnnual(option.value)}
              className={cn(
                'rounded-sm px-3 py-2 font-mono text-micro transition-colors duration-fast ease-std',
                annual === option.value ? 'bg-raised text-text' : 'text-faint hover:text-dim',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-3">
          {order.map((id) => {
            const plan = plans[id];
            const perMonth = annual
              ? Math.round((plan.price * MONTHS_BILLED_ANNUALLY) / 12)
              : plan.price;
            const recommended = id === 'starter';

            return (
              <div
                key={id}
                className={cn(
                  'flex flex-col gap-6 rounded-md border bg-surface p-6',
                  recommended ? 'border-amber-dim' : 'border-line',
                )}
              >
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-micro text-faint">
                    {plan.name.toLowerCase()}
                    {recommended && <span className="pl-3 text-amber-dim">recommended</span>}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-h1 text-text tnum">{money(perMonth)}</span>
                    <span className="font-mono text-micro text-faint">a month</span>
                  </div>
                  <span className="font-mono text-micro text-faint tnum">
                    {plan.price === 0
                      ? 'no card, no time limit'
                      : annual
                      ? `${money(plan.price * MONTHS_BILLED_ANNUALLY)} a year, billed once`
                      : `or ${money(plan.price * MONTHS_BILLED_ANNUALLY)} a year on annual billing`}
                  </span>
                </div>

                <p className="text-sm text-dim">{summary[id]}</p>

                <div className="mt-auto">
                  <Button
                    variant={recommended ? 'primary' : 'secondary'}
                    onClick={() => navigate('/start')}
                  >
                    Start free
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <p className="font-mono text-micro text-faint">
          Every workspace starts on Free. You move up when you hit a limit, not before.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium">What each plan includes</h2>
        <Table columns={columns} rows={rows} rowKey={(row) => row.id} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-h2 font-medium">What counts as an answer</h2>
        <p className="max-w-measure text-dim">
          One answer is one reply the bot writes to a visitor. A conversation with four questions in
          it counts as four. Two things never count: a reply where the bot says it could not find
          something in your sources, and anything you ask yourself in the playground. Testing your
          own bot is free, and so is it admitting what it does not know.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-h2 font-medium">Billing questions</h2>
        <dl className="flex flex-col">
          {billingFaq.map((item) => (
            <div key={item.q} className="flex flex-col gap-2 border-b border-line py-6 first:pt-0 last:border-b-0">
              <dt className="text-lg text-text">{item.q}</dt>
              <dd className="max-w-measure text-dim">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-wrap items-baseline gap-4 border-t border-line pt-8">
        <p className="max-w-measure text-dim">
          More than 10 bots, a review of our security posture, or an invoice your finance team can
          process? That is a conversation, not a plan.
        </p>
        <a
          href="mailto:hello@frontdesk.io"
          className="font-mono text-micro text-cite transition-colors duration-fast ease-std hover:text-text"
        >
          talk to us
        </a>
      </section>
    </Container>
  );
}
