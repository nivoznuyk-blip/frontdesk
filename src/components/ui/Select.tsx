import { forwardRef, useId } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, className, id, ...rest },
  ref,
) {
  const auto = useId();
  const selectId = id ?? auto;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={selectId} className="font-mono text-micro text-faint">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-9 w-full appearance-none rounded-sm border border-line bg-surface',
            'pl-3 pr-9 text-sm text-text outline-none',
            'transition-colors duration-fast ease-std focus:border-amber-dim',
            className,
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint"
          aria-hidden
        />
      </div>
    </div>
  );
});
