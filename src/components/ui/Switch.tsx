import { useId } from 'react';
import { cn } from '@/lib/cn';

export function Switch({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  hint?: string;
  disabled?: boolean;
}) {
  const id = useId();

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-px">
        <label htmlFor={id} className={cn('text-sm', disabled ? 'text-faint' : 'text-text')}>
          {label}
        </label>
        {hint && <span className="text-micro text-faint">{hint}</span>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-[20px] w-9 shrink-0 rounded-sm border transition-colors duration-fast ease-std',
          checked ? 'border-amber-dim bg-amber-wash' : 'border-line bg-surface',
          disabled && 'opacity-40 pointer-events-none',
        )}
      >
        <span
          className={cn(
            'absolute left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-sm',
            'transition-[transform,background-color] duration-fast ease-std',
            checked ? 'translate-x-[14px] bg-amber' : 'translate-x-0 bg-faint',
          )}
        />
      </button>
    </div>
  );
}
