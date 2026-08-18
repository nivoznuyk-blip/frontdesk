import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { NavLink } from 'react-router-dom';
import { AppSidebar, appSections } from './AppSidebar';
import { LogLine } from './LogLine';
import { useRouteMotion } from '@/lib/motion';
import { useLog } from '@/store/log';

export function AppShell() {
  const location = useLocation();
  const routeMotion = useRouteMotion();
  const mainRef = useRef<HTMLElement>(null);
  const entries = useLog((state) => state.entries);
  const onThisScreen = entries.filter((entry) => entry.screen === location.pathname);

  // A new screen starts at its own top, never where the last one was scrolled to.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex min-h-0 flex-1">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-11 shrink-0 items-center gap-3 border-b border-line px-4">
            <span className="text-sm text-text">Acme Cloud</span>
            <span className="flex items-center gap-2 font-mono text-micro text-faint">
              <span className="h-1 w-1 rounded-full bg-success" aria-hidden />
              ready
            </span>
          </header>

          <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-line px-2 py-2 md:hidden">
            {appSections.map((section) => (
              <NavLink
                key={section.to}
                to={section.to}
                end={section.end}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-2 rounded-sm px-3 py-2 text-sm transition',
                    isActive ? 'bg-amber-wash text-amber' : 'text-dim',
                  )
                }
              >
                {section.label}
              </NavLink>
            ))}
          </nav>

          <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={location.pathname} {...routeMotion} className="fd-canvas flex min-h-full flex-col px-6 pb-6 pt-8">
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <LogLine entries={onThisScreen} className="shrink-0" />
    </div>
  );
}
