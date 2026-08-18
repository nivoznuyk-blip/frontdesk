import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { MarketingFooter } from './MarketingFooter';
import { MarketingNav } from './MarketingNav';

export function MarketingLayout() {
  const { pathname } = useLocation();

  // Without this, a link at the foot of a long page lands you at the foot of the next one.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
}
