import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: ReactNode;
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, prefix, mono, className, id, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="font-mono text-micro text-faint">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex h-9 items-center gap-2 rounded-sm border bg-surface px-3',
          'transition-colors duration-fast ease-std',
          error ? 'border-danger' : 'border-line focus-within:border-amber-dim',
        )}
      >
        {prefix && <span className="text-faint">{prefix}</span>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          className={cn(
            'w-full bg-transparent text-sm text-text outline-none',
            'placeholder:text-faint',
            mono && 'font-mono',
            className,
          )}
          {...rest}
        />
      </div>
      {error ? (
        <p className="text-micro text-danger">{error}</p>
      ) : hint ? (
        <p className="text-micro text-faint">{hint}</p>
      ) : null}
    </div>
  );
});
