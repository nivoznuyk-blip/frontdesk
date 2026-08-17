import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

const links = [
  { to: '/docs', label: 'docs' },
  { to: '/pricing', label: 'pricing' },
  { to: '/changelog', label: 'changelog' },
];

export function MarketingNav() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-bg transition-colors duration-fast ease-std',
        scrolled ? 'border-line' : 'border-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-container items-center gap-8 px-6">
        <Link to="/" className="font-mono text-sm text-text">
          frontdesk<span className="text-amber-dim">_</span>
        </Link>

        <ul className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'text-sm transition-colors duration-fast ease-std',
                    isActive ? 'text-text' : 'text-dim hover:text-text',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-4">
          <Link to="/login" className="text-sm text-dim transition-colors duration-fast ease-std hover:text-text">
            sign in
          </Link>
          <Button variant="primary" onClick={() => navigate('/start')}>
            start free
          </Button>
        </div>
      </nav>
    </header>
  );
}
