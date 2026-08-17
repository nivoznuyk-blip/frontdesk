import { BarChart3, Code2, Database, Inbox, MessageSquare, Settings } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { cn } from '@/lib/cn';

const sections = [
  { to: '/app', label: 'Playground', icon: MessageSquare, end: true },
  { to: '/app/sources', label: 'Sources', icon: Database, end: false },
  { to: '/app/inbox', label: 'Inbox', icon: Inbox, end: false },
  { to: '/app/widget', label: 'Widget', icon: Code2, end: false },
  { to: '/app/insights', label: 'Insights', icon: BarChart3, end: false },
  { to: '/app/settings', label: 'Settings', icon: Settings, end: false },
];

export function AppSidebar() {
  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-line">
      <div className="flex h-11 shrink-0 items-center border-b border-line px-4">
        <Link to="/" className="font-mono text-sm text-text">
          frontdesk<span className="text-amber-dim">_</span>
        </Link>
      </div>

      <nav className="flex flex-col py-2">
        {sections.map((section) => (
          <NavLink
            key={section.to}
            to={section.to}
            end={section.end}
            className={({ isActive }) =>
              cn(
                'flex h-9 items-center gap-3 border-l-2 pl-3 pr-4 text-sm',
                'transition-colors duration-fast ease-std',
                isActive
                  ? 'border-amber text-amber'
                  : 'border-transparent text-dim hover:bg-surface hover:text-text',
              )
            }
          >
            {({ isActive }) => (
              <>
                <section.icon size={14} aria-hidden className={isActive ? undefined : 'text-faint'} />
                {section.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
