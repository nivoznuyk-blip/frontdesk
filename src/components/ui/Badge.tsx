import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Tone = 'neutral' | 'amber' | 'success' | 'danger' | 'warning' | 'cite';

const tones: Record<Tone, string> = {
  neutral: 'bg-raised text-dim border-line',
  amber: 'bg-amber-wash text-amber border-amber-dim',
  success: 'bg-success-wash text-success border-success',
  danger: 'bg-danger-wash text-danger border-danger',
  warning: 'bg-warning-wash text-warning border-warning',
  cite: 'bg-cite-wash text-cite border-cite',
};

export function Badge({
  tone = 'neutral',
  dot,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-sm border px-2 py-px',
        'font-mono text-micro',
        tones[tone],
      )}
    >
      {dot && <span className="h-1 w-1 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}
