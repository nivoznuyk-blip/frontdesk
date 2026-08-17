import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** The one content container. Nav, footer and every page measure from here. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto max-w-container px-6', className)}>{children}</div>;
}
