import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * Dense screens — a table, an inbox, a settings page — need width to be worth
 * reading. DESIGN.md §9 allows them to point at a desktop instead of degrading.
 */
export function DesktopOnly({ screen, children }: { screen: string; children: ReactNode }) {
  return (
    <>
      <div className="hidden md:contents">{children}</div>

      <div className="flex flex-col items-start gap-3 md:hidden">
        <span className="font-mono text-micro text-faint">narrow window</span>
        <h1 className="text-h3 font-medium">{screen} needs a wider window</h1>
        <p className="max-w-measure text-dim">
          This screen is a dense table, and squeezing it here would make it worse rather than
          smaller. The playground and the widget builder work at this width.
        </p>
        <Link
          to="/app"
          className="text-sm text-dim transition-colors duration-fast ease-std hover:text-text"
        >
          Go to the playground
        </Link>
      </div>
    </>
  );
}
