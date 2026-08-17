import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  meta?: ReactNode;
  actions?: ReactNode;
  pad?: boolean;
}

export function Panel({ title, meta, actions, pad = true, className, children, ...rest }: PanelProps) {
  return (
    <section className={cn('rounded-md border border-line bg-surface', className)} {...rest}>
      {(title || actions) && (
        <header className="flex h-11 items-center justify-between gap-4 border-b border-line px-4">
          <div className="flex items-baseline gap-3">
            {title && <h3 className="text-sm font-medium text-text">{title}</h3>}
            {meta && <span className="font-mono text-micro text-faint">{meta}</span>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn(pad && 'p-4')}>{children}</div>
    </section>
  );
}
