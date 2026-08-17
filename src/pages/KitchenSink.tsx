import { useState } from 'react';
import { ArrowRight, Plus, RefreshCw, Trash2 } from 'lucide-react';
import {
  Badge, Button, CodeBlock, Input, Panel, Select, Skeleton, Slider,
  Switch, Table, Tabs, Textarea, Tooltip, useToast,
} from '@/components/ui';
import type { Column } from '@/components/ui';
import { LogLine } from '@/components/layout/LogLine';
import { count } from '@/lib/format';

interface Source {
  id: string;
  name: string;
  type: string;
  pages: number;
  status: 'indexed' | 'crawling' | 'failed';
}

const sources: Source[] = [
  { id: '1', name: 'docs.acmecloud.com', type: 'crawl', pages: 412, status: 'indexed' },
  { id: '2', name: 'security-overview.pdf', type: 'file', pages: 18, status: 'indexed' },
  { id: '3', name: 'pricing-2026.pdf', type: 'file', pages: 4, status: 'crawling' },
  { id: '4', name: 'onboarding-scan.pdf', type: 'file', pages: 0, status: 'failed' },
];

const statusTone = { indexed: 'success', crawling: 'amber', failed: 'danger' } as const;

const columns: Array<Column<Source>> = [
  { key: 'name', header: 'source', render: (r) => <span className="font-mono text-sm">{r.name}</span> },
  {
    key: 'type',
    header: 'type',
    width: '120px',
    render: (r) => <span className="font-mono text-micro text-faint">{r.type}</span>,
  },
  { key: 'pages', header: 'pages', align: 'right', width: '96px', render: (r) => count(r.pages) },
  {
    key: 'status',
    header: 'status',
    width: '160px',
    render: (r) => <Badge tone={statusTone[r.status]} dot>{r.status}</Badge>,
  },
];

const swatches = [
  ['--bg', 'bg'], ['--surface', 'surface'], ['--surface-raised', 'raised'],
  ['--surface-sunken', 'sunken'], ['--border', 'border'], ['--border-strong', 'border-strong'],
  ['--text', 'text'], ['--text-dim', 'text-dim'], ['--text-faint', 'text-faint'],
  ['--amber', 'amber'], ['--amber-hover', 'amber-hover'], ['--amber-dim', 'amber-dim'],
  ['--amber-wash', 'amber-wash'], ['--cite', 'cite'], ['--cite-wash', 'cite-wash'],
  ['--success', 'success'], ['--danger', 'danger'], ['--warning', 'warning'],
];

const typeScale: Array<{ name: string; cls: string }> = [
  { name: 'display', cls: 'text-display font-medium' },
  { name: 'h1', cls: 'text-h1 font-medium' },
  { name: 'h2', cls: 'text-h2 font-medium' },
  { name: 'h3', cls: 'text-h3 font-medium' },
  { name: 'lg', cls: 'text-lg' },
  { name: 'base', cls: 'text-base' },
  { name: 'sm', cls: 'text-sm text-dim' },
];

export default function KitchenSink() {
  const [tab, setTab] = useState('html');
  const [strict, setStrict] = useState(70);
  const [badge, setBadge] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto flex max-w-container flex-col gap-16 px-6 py-16">
        <header className="flex flex-col gap-2">
          <span className="font-mono text-micro text-amber-dim">layer 01</span>
          <h1 className="text-h1 font-medium">Kitchen sink</h1>
          <p className="max-w-measure text-dim">
            Every primitive in every state. Nothing ships until this page reads as one system.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-micro text-faint">color</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {swatches.map(([token, name]) => (
              <div key={token} className="flex flex-col gap-2">
                <div
                  className="h-12 rounded-sm border border-line"
                  style={{ background: `var(${token})` }}
                />
                <span className="font-mono text-micro text-faint">{name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-micro text-faint">type</h2>
          <div className="flex flex-col gap-4 border-t border-line pt-4">
            {typeScale.map((step) => (
              <div key={step.name} className="flex items-baseline gap-6">
                <span className="w-16 shrink-0 font-mono text-micro text-faint">{step.name}</span>
                <span className={step.cls}>Answers with receipts</span>
              </div>
            ))}
            <div className="flex items-baseline gap-6">
              <span className="w-16 shrink-0 font-mono text-micro text-faint">mono</span>
              <span className="font-mono text-label text-dim tnum">14:02:11 — 412 pages indexed</span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-micro text-faint">button</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" iconRight={<ArrowRight size={14} />}>Start free</Button>
            <Button variant="secondary" iconLeft={<Plus size={14} />}>Add source</Button>
            <Button variant="ghost" iconLeft={<RefreshCw size={14} />}>Reindex</Button>
            <Button variant="danger" iconLeft={<Trash2 size={14} />}>Delete bot</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button
              variant="secondary"
              loading={loading}
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  toast.push('12 pages reindexed', 'success');
                }, 1200);
              }}
            >
              Trigger toast
            </Button>
            <Button size="sm" variant="secondary">Small</Button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Form controls" meta="all states">
            <div className="flex flex-col gap-6">
              <Input label="crawl url" placeholder="docs.yourcompany.com" mono />
              <Input label="workspace" defaultValue="Acme Cloud" hint="Shown to visitors in the widget." />
              <Input label="email" defaultValue="not-an-email" error="Enter a valid email address." />
              <Select
                label="model"
                options={[
                  { value: 'fast', label: 'Fast — cheaper, shorter answers' },
                  { value: 'balanced', label: 'Balanced' },
                ]}
              />
              <Textarea label="greeting" defaultValue="Hi. Ask me anything about Acme Cloud." />
              <Slider
                label="strictness"
                value={strict}
                onChange={setStrict}
                readout={strict > 60 ? 'sources only' : 'may infer'}
              />
              <Switch
                checked={badge}
                onChange={setBadge}
                label="Show Powered by Frontdesk"
                hint="Included on the free plan."
              />
              <Switch checked={false} onChange={() => {}} label="API access" hint="Growth plan." disabled />
            </div>
          </Panel>

          <div className="flex flex-col gap-6">
            <Panel title="Badges">
              <div className="flex flex-wrap gap-2">
                <Badge dot tone="success">indexed</Badge>
                <Badge dot tone="amber">crawling</Badge>
                <Badge dot tone="danger">failed</Badge>
                <Badge tone="warning">limit near</Badge>
                <Badge tone="cite">billing.md</Badge>
                <Badge>free plan</Badge>
              </div>
            </Panel>

            <Panel title="Tabs and code">
              <div className="flex flex-col gap-4">
                <Tabs
                  value={tab}
                  onChange={setTab}
                  items={[
                    { value: 'html', label: 'HTML' },
                    { value: 'react', label: 'React' },
                    { value: 'wordpress', label: 'WordPress' },
                  ]}
                />
                <CodeBlock
                  code={
                    tab === 'react'
                      ? `import { Frontdesk } from '@frontdesk/react';\n\n<Frontdesk botId="acme-cloud" />`
                      : tab === 'wordpress'
                      ? `Install the Frontdesk plugin, then paste\nyour bot id: acme-cloud`
                      : `<script\n  src="https://cdn.frontdesk.io/w.js"\n  data-bot="acme-cloud"\n  defer\n></script>`
                  }
                />
              </div>
            </Panel>

            <Panel>
              <div className="flex flex-col gap-4">
                <h3 className="font-mono text-micro text-faint">skeleton</h3>
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </Panel>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-mono text-micro text-faint">table</h2>
            <Tooltip label="Hover a row">
              <span className="font-mono text-micro text-amber-dim">?</span>
            </Tooltip>
          </div>
          <Table columns={columns} rows={sources} rowKey={(r) => r.id} onRowClick={() => {}} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-micro text-faint">signature — log line</h2>
          <div className="overflow-hidden rounded-md border border-line">
            <LogLine
              entries={[
                { time: '14:02:11', message: 'reindexed 12 pages from docs.acmecloud.com' },
              ]}
              className="border-t-0"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
