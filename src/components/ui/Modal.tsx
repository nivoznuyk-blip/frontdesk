import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/** DESIGN.md §6: a modal is used for destructive confirmation and nothing else. */
export function Modal({
  open,
  title,
  children,
  actions,
  onClose,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  actions: ReactNode;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-sunken opacity-90" onClick={onClose} aria-hidden />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative z-50 flex w-full max-w-dialog flex-col gap-4 rounded-md border border-line-strong bg-surface p-6 outline-none"
      >
        <h2 className="text-h3 font-medium">{title}</h2>
        <div className="text-sm text-dim">{children}</div>
        <div className="flex items-center gap-3">{actions}</div>
      </div>
    </div>
  );
}
