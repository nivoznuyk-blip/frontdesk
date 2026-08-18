import { useId } from 'react';
import type { ReactNode } from 'react';

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  readout,
  hint,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  readout?: ReactNode;
  /** One line under the track describing where the handle is. */
  hint?: ReactNode;
}) {
  const id = useId();

  return (
    <div className="flex max-w-control flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="whitespace-nowrap font-mono text-micro text-faint">
          {label}
        </label>
        <span className="whitespace-nowrap font-mono text-micro text-dim tnum">{readout ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="fd-range"
      />
      {hint && <p className="text-micro text-faint">{hint}</p>}
    </div>
  );
}
