import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, RefreshCw, Trash2, UploadCloud, X } from 'lucide-react';
import {
  Badge, Button, Input, Modal, Panel, Skeleton, Table, Tabs, Textarea, useToast,
} from '@/components/ui';
import type { Column } from '@/components/ui';
import { indexedPages, useSources } from '@/store/sources';
import { usePlan } from '@/store/plan';
import { nextPlanUp, plans } from '@/mock/plans';
import type { Plan } from '@/mock/plans';
import type { Source } from '@/mock/sources';
import { count, money, relative } from '@/lib/format';
import { delay } from '@/lib/delay';
import { sourceIcon } from '@/lib/sourceIcon';
import { cn } from '@/lib/cn';

const statusTone = { indexed: 'success', crawling: 'amber', failed: 'danger' } as const;

/** Pages a crawl of one site brings in, and the parser's yield per page. */
const CRAWL_PAGES = 128;
const NOTION_PAGES = 38;
const CHUNKS_PER_PAGE = 7;
const KB_PER_PAGE = 45_000;

const newId = () => `src-${Date.now().toString(36)}`;

interface Upload {
  id: string;
  name: string;
  progress: number;
  pages?: number;
  failed?: boolean;
}

export default function Sources() {
  const navigate = useNavigate();
  const toast = useToast();
  const { sources, add, remove, update } = useSources();
  const plan = plans[usePlan((state) => state.plan)];

  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upload');
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [dragging, setDragging] = useState(false);
  const [extractId, setExtractId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<number | null>(null);
  const [crawlUrl, setCrawlUrl] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [connecting, setConnecting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let live = true;
    delay(500).then(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  const used = indexedPages(sources);
  const extract = sources.find((s) => s.id === extractId);
  const doomed = sources.find((s) => s.id === deleteId);

  /** True when the pages would not fit, and the paywall takes over instead. */
  function overCap(pages: number) {
    if (used + pages <= plan.pages) return false;
    setBlocked(pages);
    return true;
  }

  async function acceptFiles(files: File[]) {
    const sized = files.map((file) => ({
      file,
      pages: Math.max(1, Math.round(file.size / KB_PER_PAGE)),
    }));
    const scans = sized.filter(({ file }) => /scan/i.test(file.name));
    const readable = sized.filter(({ file }) => !/scan/i.test(file.name));

    if (readable.length > 0 && overCap(readable.reduce((total, f) => total + f.pages, 0))) return;

    for (const [index, { file, pages }] of sized.entries()) {
      const failed = scans.some((s) => s.file === file);
      const id = `${newId()}-${index}`;
      setUploads((prev) => [...prev, { id, name: file.name, progress: 0 }]);

      for (let step = 1; step <= 5; step += 1) {
        await delay(180);
        setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, progress: step * 20 } : u)));
      }

      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, pages: failed ? 0 : pages, failed } : u)),
      );

      add({
        id,
        name: file.name,
        kind: 'file',
        pages: failed ? 0 : pages,
        chunks: failed ? 0 : pages * CHUNKS_PER_PAGE,
        status: failed ? 'failed' : 'indexed',
        lastIndexed: new Date().toISOString(),
        topics: [],
        problem: failed
          ? 'This PDF is a scan with no text layer. Run it through OCR, then upload it again.'
          : undefined,
        extract: failed ? undefined : `${file.name}\n\nParsed ${pages} pages, ${pages * CHUNKS_PER_PAGE} chunks.`,
      });
    }
  }

  async function startCrawl() {
    const url = crawlUrl.trim();
    if (!url || overCap(CRAWL_PAGES)) return;

    const id = newId();
    setCrawlUrl('');
    add({
      id,
      name: url.replace(/^https?:\/\//, ''),
      kind: 'crawl',
      pages: 0,
      chunks: 0,
      status: 'crawling',
      lastIndexed: new Date().toISOString(),
      topics: [],
    });

    await delay(1600);
    update(id, {
      pages: CRAWL_PAGES,
      chunks: CRAWL_PAGES * CHUNKS_PER_PAGE,
      status: 'indexed',
      lastIndexed: new Date().toISOString(),
      extract: `${url}\n\nCrawled ${CRAWL_PAGES} pages. The parser followed links inside the same domain and skipped anything behind a login.`,
    });
    toast.push(`crawled ${count(CRAWL_PAGES)} pages`, 'success');
  }

  function savePair() {
    if (!question.trim() || !answer.trim() || overCap(1)) return;

    const existing = sources.find((s) => s.kind === 'qa');
    if (existing) {
      update(existing.id, {
        pages: existing.pages + 1,
        chunks: existing.chunks + 1,
        lastIndexed: new Date().toISOString(),
        extract: `Q: ${question.trim()}\nA: ${answer.trim()}\n\n${existing.extract ?? ''}`,
      });
    } else {
      add({
        id: newId(),
        name: 'Manual answers',
        kind: 'qa',
        pages: 1,
        chunks: 1,
        status: 'indexed',
        lastIndexed: new Date().toISOString(),
        topics: [],
        extract: `Q: ${question.trim()}\nA: ${answer.trim()}`,
      });
    }

    setQuestion('');
    setAnswer('');
    toast.push('answer added to the sources', 'success');
  }

  async function connectNotion() {
    if (overCap(NOTION_PAGES)) return;
    setConnecting(true);
    await delay(1300);
    setConnecting(false);
    add({
      id: newId(),
      name: 'Product handbook · Notion',
      kind: 'notion',
      pages: NOTION_PAGES,
      chunks: NOTION_PAGES * CHUNKS_PER_PAGE,
      status: 'indexed',
      lastIndexed: new Date().toISOString(),
      topics: ['handbook', 'process'],
      extract: 'Product handbook\n\nHow we ship: a change lands behind a flag, gets a week of use inside the team, then goes out.',
    });
    toast.push('Notion workspace connected', 'success');
  }

  async function reindex(source: Source) {
    update(source.id, { status: 'crawling' });
    await delay(1400);
    update(source.id, { status: 'indexed', lastIndexed: new Date().toISOString() });
    toast.push(`reindexed ${source.name}`, 'success');
  }

  function confirmDelete() {
    if (!doomed) return;
    remove(doomed.id);
    if (extractId === doomed.id) setExtractId(null);
    setDeleteId(null);
    toast.push(`removed ${doomed.name}`, 'neutral');
  }

  const columns: Array<Column<Source>> = [
    {
      key: 'kind',
      header: 'type',
      width: '44px',
      render: (row) => {
        const Icon = sourceIcon[row.kind];
        return <Icon size={14} aria-label={row.kind} className="text-faint" />;
      },
    },
    {
      key: 'name',
      header: 'source',
      render: (row) => (
        <span className="flex items-baseline gap-3">
          <span className="truncate font-mono text-sm">{row.name}</span>
          {row.status === 'failed' && (
            <span className="shrink-0 font-mono text-micro text-danger">needs a fix</span>
          )}
        </span>
      ),
    },
    {
      key: 'pages',
      header: 'pages',
      align: 'right',
      width: '88px',
      render: (row) => count(row.pages),
    },
    {
      key: 'chunks',
      header: 'chunks',
      align: 'right',
      width: '88px',
      render: (row) => count(row.chunks),
    },
    {
      key: 'status',
      header: 'status',
      width: '116px',
      render: (row) => (
        <Badge tone={statusTone[row.status]} dot>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'lastIndexed',
      header: 'indexed',
      width: '112px',
      render: (row) => (
        <span className="font-mono text-micro text-faint tnum">{relative(row.lastIndexed)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '124px',
      render: (row) => (
        <div className="flex items-center justify-end gap-px">
          <Button size="sm" variant="ghost" aria-label={`Reindex ${row.name}`} onClick={(e) => { e.stopPropagation(); reindex(row); }}>
            <RefreshCw size={14} aria-hidden />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-label={`View the text extracted from ${row.name}`}
            onClick={(e) => { e.stopPropagation(); setExtractId(extractId === row.id ? null : row.id); }}
          >
            <Eye size={14} aria-hidden />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-label={`Delete ${row.name}`}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(row.id);
            }}
          >
            <Trash2 size={14} aria-hidden />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-6">
          <h1 className="text-h2 font-medium">Sources</h1>
          <span className="font-mono text-micro text-faint tnum">
            {count(used)} of {count(plan.pages)} pages · {plan.name} plan
          </span>
        </div>
        <UsageMeter used={used} plan={plan} />
      </header>

      {blocked !== null && (
        <Paywall
          plan={plan}
          used={used}
          needed={blocked}
          onDismiss={() => setBlocked(null)}
          onSeePlans={() => navigate('/pricing')}
        />
      )}

      <Panel title="Add a source">
        <div className="flex flex-col gap-6">
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { value: 'upload', label: 'Upload files' },
              { value: 'crawl', label: 'Crawl a site' },
              { value: 'qa', label: 'Question and answer' },
              { value: 'notion', label: 'Notion' },
            ]}
          />

          {tab === 'upload' && (
            <div className="flex flex-col gap-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  acceptFiles(Array.from(e.dataTransfer.files));
                }}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-md border border-dashed p-8',
                  'transition-colors duration-fast ease-std',
                  dragging ? 'border-amber-dim bg-amber-wash' : 'border-line bg-sunken',
                )}
              >
                <UploadCloud size={20} className="text-faint" aria-hidden />
                <p className="text-sm text-dim">Drop PDFs, Word files or plain text here</p>
                <Button size="sm" variant="secondary" onClick={() => fileInput.current?.click()}>
                  Choose files
                </Button>
                <input
                  ref={fileInput}
                  type="file"
                  multiple
                  className="hidden"
                  aria-label="Choose files to upload"
                  onChange={(e) => {
                    acceptFiles(Array.from(e.target.files ?? []));
                    e.target.value = '';
                  }}
                />
              </div>

              {uploads.length > 0 && (
                <ul className="flex flex-col gap-3">
                  {uploads.map((upload) => (
                    <li key={upload.id} className="flex flex-col gap-2">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="truncate font-mono text-micro text-dim">{upload.name}</span>
                        <span className="shrink-0 font-mono text-micro text-faint tnum">
                          {upload.failed
                            ? 'no text layer'
                            : upload.pages !== undefined
                            ? `${count(upload.pages)} pages parsed`
                            : `${count(upload.progress)}%`}
                        </span>
                      </div>
                      <div className="h-1 w-full rounded-sm bg-raised">
                        <div
                          className={cn('h-1 rounded-sm', upload.failed ? 'bg-danger' : 'bg-amber')}
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'crawl' && (
            <form
              className="flex max-w-control flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                startCrawl();
              }}
            >
              <Input
                label="url"
                mono
                value={crawlUrl}
                onChange={(e) => setCrawlUrl(e.target.value)}
                placeholder="docs.yourcompany.com"
                hint="We follow links inside the same domain and skip anything behind a login."
              />
              <div>
                <Button variant="secondary" type="submit" disabled={!crawlUrl.trim()}>
                  Start crawl
                </Button>
              </div>
            </form>
          )}

          {tab === 'qa' && (
            <div className="flex max-w-measure flex-col gap-4">
              <Input
                label="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Do you offer refunds?"
              />
              <Textarea
                label="The answer it should give"
                labelTone="prose"
                rows={3}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write it in full, the way you would say it to a customer."
              />
              <div>
                <Button variant="secondary" onClick={savePair} disabled={!question.trim() || !answer.trim()}>
                  Add the pair
                </Button>
              </div>
            </div>
          )}

          {tab === 'notion' && (
            <div className="flex max-w-measure flex-col gap-4">
              <p className="text-sm text-dim">
                Connect a Notion workspace and pick the pages to index. Nested pages come along with
                their parent, and Frontdesk re-reads them once a day.
              </p>
              <div>
                <Button variant="secondary" loading={connecting} onClick={connectNotion}>
                  Connect Notion
                </Button>
              </div>
            </div>
          )}
        </div>
      </Panel>

      {loading ? (
        <Panel title="Sources">
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-11" />
            ))}
          </div>
        </Panel>
      ) : sources.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-md border border-line bg-surface p-6">
          <span className="font-mono text-micro text-faint">no sources yet</span>
          <h2 className="text-h3 font-medium">Nothing behind the desk yet</h2>
          <p className="max-w-measure text-dim">
            The bot answers from what you give it. A help centre URL is the quickest start, and you
            can add files and written answers on top of it.
          </p>
          <Button variant="primary" iconLeft={<Plus size={14} />} onClick={() => setTab('crawl')}>
            Add the first source
          </Button>
        </div>
      ) : (
        <Table
          columns={columns}
          rows={sources}
          rowKey={(row) => row.id}
          detail={(row) =>
            row.status === 'failed' ? (
              <div className="flex flex-col gap-3">
                <p className="max-w-measure text-sm text-dim">{row.problem}</p>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    iconLeft={<UploadCloud size={14} />}
                    onClick={() => {
                      setTab('upload');
                      fileInput.current?.click();
                    }}
                  >
                    Upload the OCR version
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteId(row.id)}>
                    Remove it
                  </Button>
                </div>
              </div>
            ) : null
          }
        />
      )}

      {extract && (
        <Panel
          title={extract.name}
          meta="extracted text"
          actions={
            <Button size="sm" variant="ghost" aria-label="Close the extract" onClick={() => setExtractId(null)}>
              <X size={14} aria-hidden />
            </Button>
          }
        >
          {extract.extract ? (
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-code text-dim">
              {extract.extract}
            </pre>
          ) : (
            <p className="max-w-measure text-sm text-dim">
              {extract.problem ?? 'Nothing was extracted from this source.'}
            </p>
          )}
        </Panel>
      )}

      <Modal
        open={Boolean(doomed)}
        title={`Delete ${doomed?.name ?? ''}?`}
        onClose={() => setDeleteId(null)}
        actions={
          <>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
          </>
        }
      >
        The bot stops answering from it straight away. {count(doomed?.chunks ?? 0)} chunks are
        removed from the index, and this cannot be undone.
      </Modal>
    </div>
  );
}

function UsageMeter({ used, plan }: { used: number; plan: Plan }) {
  const pct = Math.min(100, Math.round((used / plan.pages) * 100));
  const tone = pct >= 100 ? 'bg-danger' : pct >= 85 ? 'bg-warning' : 'bg-dim';

  return (
    <div className="h-1 w-full rounded-sm bg-raised" role="img" aria-label={`${pct}% of the page limit used`}>
      <div className={cn('h-1 rounded-sm', tone)} style={{ width: `${pct}%` }} />
    </div>
  );
}

function Paywall({
  plan,
  used,
  needed,
  onDismiss,
  onSeePlans,
}: {
  plan: Plan;
  used: number;
  needed: number;
  onDismiss: () => void;
  onSeePlans: () => void;
}) {
  const upgradeId = nextPlanUp[plan.id];
  const upgrade = upgradeId ? plans[upgradeId] : null;

  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4">
      <span className="font-mono text-micro text-warning">page limit</span>
      <p className="max-w-measure text-sm text-text">
        {plan.name} indexes {count(plan.pages)} pages and this workspace is at {count(used)}. The
        {' '}
        {count(needed)} pages you are adding would cross that.
      </p>
      {upgrade && (
        <p className="max-w-measure text-sm text-dim">
          {upgrade.name} raises the cap to {count(upgrade.pages)} pages for {money(upgrade.price)} a
          month. Everything already indexed stays as it is.
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button size="sm" variant="secondary" onClick={onSeePlans}>
          See plans
        </Button>
        <Button size="sm" variant="ghost" onClick={onDismiss}>
          Not now
        </Button>
      </div>
    </div>
  );
}
