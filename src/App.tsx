import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { MarketingLayout } from '@/components/layout/MarketingLayout';
import KitchenSink from '@/pages/KitchenSink';
import Onboarding from '@/pages/Onboarding';
import Changelog from '@/pages/marketing/Changelog';
import Docs from '@/pages/marketing/Docs';
import Landing from '@/pages/marketing/Landing';
import Login from '@/pages/marketing/Login';
import NotFound from '@/pages/marketing/NotFound';
import Pricing from '@/pages/marketing/Pricing';
import WidgetDemo from '@/pages/marketing/WidgetDemo';
import Inbox from '@/pages/app/Inbox';
import Insights from '@/pages/app/Insights';
import Playground from '@/pages/app/Playground';
import Settings from '@/pages/app/Settings';
import Sources from '@/pages/app/Sources';
import WidgetBuilder from '@/pages/app/WidgetBuilder';
import { useRouteMotion } from '@/lib/motion';

export default function App() {
  const location = useLocation();
  const routeMotion = useRouteMotion();

  /**
   * Everything inside /app is one key, so moving between app screens animates
   * the content pane in AppShell and leaves the shell itself still. Every other
   * route change animates the whole page, including going from a marketing page
   * into onboarding, which crosses layouts.
   */
  const group = location.pathname.startsWith('/app') ? 'app' : location.pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={group} {...routeMotion}>
        <Routes location={location}>
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/docs/:slug" element={<Docs />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/widget-demo" element={<WidgetDemo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/start" element={<Onboarding />} />
          <Route path="/kitchen-sink" element={<KitchenSink />} />

          <Route path="/app" element={<AppShell />}>
            <Route index element={<Playground />} />
            <Route path="sources" element={<Sources />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="widget" element={<WidgetBuilder />} />
            <Route path="insights" element={<Insights />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
