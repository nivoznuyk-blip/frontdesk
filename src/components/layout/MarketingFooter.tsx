import { Link } from 'react-router-dom';
import { Container } from './Container';

const columns = [
  {
    heading: 'product',
    links: [
      { to: '/pricing', label: 'Pricing' },
      { to: '/widget-demo', label: 'Widget demo' },
      { to: '/start', label: 'Start free' },
    ],
  },
  {
    heading: 'resources',
    links: [
      { to: '/docs', label: 'Docs' },
      { to: '/changelog', label: 'Changelog' },
    ],
  },
  {
    heading: 'account',
    links: [{ to: '/login', label: 'Sign in' }],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-col gap-12 py-16">
        <div className="flex flex-col gap-12 sm:flex-row sm:gap-24">
          <Link to="/" className="font-mono text-sm text-text">
            frontdesk<span className="text-amber-dim">_</span>
          </Link>

          <div className="flex flex-1 flex-col gap-8 sm:flex-row sm:justify-end sm:gap-24">
            {columns.map((column) => (
              <nav key={column.heading} className="flex flex-col gap-3">
                <span className="font-mono text-micro text-faint">{column.heading}</span>
                {column.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-dim transition-colors duration-fast ease-std hover:text-text"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-measure text-sm text-faint">
            The Powered by Frontdesk badge stays on the free plan. Starter and Growth remove it.
          </p>
          <span className="flex items-center gap-2 font-mono text-micro text-faint">
            <span className="h-1 w-1 rounded-full bg-success" aria-hidden />
            all systems normal
          </span>
        </div>
      </Container>
    </footer>
  );
}
