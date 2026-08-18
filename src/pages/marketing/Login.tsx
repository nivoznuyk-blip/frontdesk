import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useTitle } from '@/lib/useTitle';

export default function Login() {
  useTitle('Sign in');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="shrink-0 border-b border-line">
        <div className="mx-auto flex h-16 max-w-container items-center px-6">
          <Link to="/" className="font-mono text-sm text-text">
            frontdesk<span className="text-amber-dim">_</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="flex w-aside max-w-full flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-h2 font-medium">Sign in</h1>
            <p className="text-dim">Your bots, sources and conversations are where you left them.</p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/app');
            }}
          >
            <Input
              label="email"
              mono
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
            <Button variant="primary" type="submit" iconRight={<ArrowRight size={14} />}>
              Continue
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-micro text-faint">or</span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <Button variant="secondary" onClick={() => navigate('/app')}>
            Continue with Google
          </Button>

          <p className="text-sm text-faint">
            No bot yet?{' '}
            <Link
              to="/start"
              className="text-dim transition-colors duration-fast ease-std hover:text-text"
            >
              Build one in five minutes
            </Link>
            {' '}— it does not ask for an account until it has answered something.
          </p>
        </div>
      </main>
    </div>
  );
}
