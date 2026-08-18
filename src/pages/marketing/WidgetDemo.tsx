import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { LiveWidget } from '@/components/widget/LiveWidget';
import { useWidget } from '@/store/widget';
import { onAccent } from '@/lib/contrast';
import { company } from '@/mock/company';
import { useTitle } from '@/lib/useTitle';

const nav = ['Product', 'Pricing', 'Docs', 'Company'];

export default function WidgetDemo() {
  useTitle('Widget demo');
  const accent = useWidget((state) => state.settings.accent);

  return (
    <div className="flex min-h-screen flex-col bg-sunken">
      <div className="flex flex-wrap items-center gap-4 border-b border-line bg-bg px-6 py-2">
        <span className="font-mono text-micro text-faint">
          a Frontdesk demo page — the widget in the corner is the real one
        </span>
        <Link
          to="/app/widget"
          className="ml-auto inline-flex items-center gap-2 font-mono text-micro text-dim transition-colors duration-fast ease-std hover:text-text"
        >
          <ArrowLeft size={12} aria-hidden />
          back to the builder
        </Link>
      </div>

      <header className="border-b border-line">
        <div className="mx-auto flex h-16 max-w-container items-center gap-8 px-6">
          <span className="text-sm font-medium text-text">{company.name}</span>
          <nav className="hidden gap-6 sm:flex">
            {nav.map((item) => (
              <span key={item} className="text-sm text-dim">
                {item}
              </span>
            ))}
          </nav>
          <span
            className="ml-auto inline-flex h-9 items-center rounded-sm px-4 text-sm font-medium"
            style={{ background: accent, color: onAccent(accent) }}
          >
            Try it free
          </span>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-line">
          <div className="mx-auto flex max-w-container flex-col gap-6 px-6 py-24">
            <h1 className="max-w-measure text-h1 font-medium">
              Infrastructure that gets out of the way
            </h1>
            <p className="max-w-measure text-lg text-dim">
              {company.name} runs your services across two regions, with the boring parts — backups,
              certificates, failover — handled before you have to think about them.
            </p>
            <div className="flex flex-wrap gap-4">
              <span
                className="inline-flex h-9 items-center rounded-sm px-4 text-sm font-medium"
                style={{ background: accent, color: onAccent(accent) }}
              >
                Start a project
              </span>
              <span className="inline-flex h-9 items-center rounded-sm border border-line-strong px-4 text-sm font-medium text-text">
                Read the docs
              </span>
            </div>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto flex max-w-container flex-col gap-8 px-6 py-24">
            <h2 className="text-h2 font-medium">Two regions, one workspace</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <p className="max-w-measure text-dim">
                Pick eu-central in Frankfurt or us-east in Virginia when you create a workspace. Data
                stays in the region you chose, including backups and search indexes, and moving one
                later is a migration request rather than a toggle.
              </p>
              <p className="max-w-measure text-dim">
                Every service runs on managed Kubernetes with encryption at rest and TLS 1.3 in
                transit. Audit logs are kept for twelve months on the plans that include them.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-container flex-col gap-8 px-6 py-24">
            <h2 className="text-h2 font-medium">Built for teams that ship on Fridays</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <p className="text-dim">
                Rollbacks are one command and take about eleven seconds, because the previous build
                is still warm.
              </p>
              <p className="text-dim">
                Preview environments come up per branch and are torn down when the branch is merged.
              </p>
              <p className="text-dim">
                Alerting goes where your team already is, with a digest instead of one message per
                event.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-container flex-wrap items-center gap-4 px-6 py-8">
          <span className="font-mono text-micro text-faint">
            {company.name} — a fictional company, for the purpose of this demo
          </span>
        </div>
      </footer>

      <LiveWidget />
    </div>
  );
}
