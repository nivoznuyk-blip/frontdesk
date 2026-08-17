import { Outlet } from 'react-router-dom';
import { MarketingFooter } from './MarketingFooter';
import { MarketingNav } from './MarketingNav';

export function MarketingLayout() {
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
