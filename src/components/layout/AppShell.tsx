import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { LogLine } from './LogLine';
import { useRouteMotion } from '@/lib/motion';

export function AppShell() {
  const location = useLocation();
  const routeMotion = useRouteMotion();

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

          <main className="min-h-0 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={location.pathname} {...routeMotion} className="h-full p-6">
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <LogLine entries={[]} className="shrink-0" />
    </div>
  );
}
