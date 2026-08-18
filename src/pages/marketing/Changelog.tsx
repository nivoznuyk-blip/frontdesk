import { Badge } from '@/components/ui';
import { Container } from '@/components/layout/Container';
import { changelog } from '@/mock/changelog';
import type { ChangeKind } from '@/mock/changelog';
import { day } from '@/lib/format';
import { useTitle } from '@/lib/useTitle';

const tone: Record<ChangeKind, 'success' | 'warning' | 'neutral'> = {
  shipped: 'success',
  fixed: 'warning',
  improved: 'neutral',
};

export default function Changelog() {
  useTitle('Changelog');
  return (
    <Container className="flex flex-col gap-12 py-24">
      <header className="flex flex-col gap-3">
        <h1 className="text-h1 font-medium">Changelog</h1>
        <p className="max-w-measure text-lg text-dim">
          What went out, when, and what it changed for you. Three months at a time.
        </p>
      </header>

      <ol className="flex flex-col">
        {changelog.map((entry) => (
          <li
            key={entry.version}
            className="flex gap-12 border-b border-line py-8 first:pt-0 last:border-b-0 max-md:flex-col max-md:gap-4"
          >
            <div className="flex w-sidebar shrink-0 flex-col gap-2 max-md:w-full max-md:flex-row max-md:items-center max-md:gap-4">
              <span className="font-mono text-micro text-faint tnum">{day(entry.date)}</span>
              <span className="font-mono text-sm text-dim tnum">{entry.version}</span>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <Badge tone={tone[entry.kind]}>{entry.kind}</Badge>
                <h2 className="text-lg text-text">{entry.title}</h2>
              </div>
              <ul className="flex max-w-measure flex-col gap-2">
                {entry.points.map((point) => (
                  <li key={point} className="flex gap-3 text-dim">
                    <span className="shrink-0 text-faint">—</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Container>
  );
}
