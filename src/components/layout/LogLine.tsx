import { useEffect, useState } from 'react';
import { clock } from '@/lib/format';
import { cn } from '@/lib/cn';

export interface LogEntry {
  time: string;
  message: string;
}

export function LogLine({ entries, className }: { entries: LogEntry[]; className?: string }) {
  const latest = entries[entries.length - 1];
  const [now, setNow] = useState(clock());

  useEffect(() => {
    const id = setInterval(() => setNow(clock()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        'flex h-8 items-center gap-3 border-t border-line bg-sunken px-4',
        'font-mono text-micro text-faint',
        className,
      )}
    >
      <span className="text-amber-dim">frontdesk</span>
      <span className="tnum">{latest?.time ?? now}</span>
      <span className="truncate text-dim">{latest?.message ?? 'idle'}</span>
      <span className="ml-auto h-3 w-caret animate-blink bg-amber-dim" aria-hidden />
    </div>
  );
}
