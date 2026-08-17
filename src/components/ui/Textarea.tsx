import { forwardRef, useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, className, id, rows = 4, ...rest },
  ref,
) {
  const auto = useId();
  const areaId = id ?? auto;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={areaId} className="font-mono text-micro text-faint">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        className={cn(
          'rounded-sm border border-line bg-surface px-3 py-2 text-sm text-text',
          'outline-none transition-colors duration-fast ease-std',
          'placeholder:text-faint focus:border-amber-dim resize-none',
          className,
        )}
        {...rest}
      />
      {hint && <p className="text-micro text-faint">{hint}</p>}
    </div>
  );
});
