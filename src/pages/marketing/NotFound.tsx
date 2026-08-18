import { Link } from 'react-router-dom';
import { Container } from '@/components/layout/Container';
import { useTitle } from '@/lib/useTitle';

const elsewhere = [
  { to: '/docs', label: 'Docs', hint: 'Four short articles on setting a bot up' },
  { to: '/changelog', label: 'Changelog', hint: 'What went out, and when' },
  { to: '/pricing', label: 'Pricing', hint: 'Three plans and what each one unlocks' },
];

export default function NotFound() {
  useTitle('Page not found');
  return (
    <Container className="flex flex-col gap-8 py-24">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-micro text-faint">404</span>
        <h1 className="text-h1 font-medium">Nobody is at this address</h1>
        <p className="max-w-measure text-lg text-dim">
          The page you asked for does not exist. These three are the usual next stops.
        </p>
      </div>

      <ul className="flex flex-col">
        {elsewhere.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="flex flex-wrap items-baseline gap-4 border-b border-line py-4 first:pt-0 transition-colors duration-fast ease-std hover:bg-surface"
            >
              <span className="text-lg text-text">{item.label}</span>
              <span className="text-dim">{item.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
