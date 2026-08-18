import { useState } from 'react';
import { Input } from '@/components/ui';
import { WidgetPreview } from '@/components/widget/WidgetPreview';
import { accentPresets, defaultWidget, positions } from '@/mock/widget';
import type { Position } from '@/mock/widget';
import { cn } from '@/lib/cn';

/**
 * The builder's controls, on the marketing page. Local state on purpose: a
 * visitor playing here must not write into a real workspace's settings.
 */
export function WidgetLab() {
  const [accent, setAccent] = useState(defaultWidget.accent);
  const [position, setPosition] = useState<Position>(defaultWidget.position);
  const [greeting, setGreeting] = useState('Hi. Ask me anything about Acme Cloud.');

  return (
    <div className="flex gap-12 max-md:flex-col">
      <div className="flex w-aside shrink-0 flex-col gap-6 max-md:w-full">
        <div className="flex flex-col gap-2">
          <span className="font-mono text-micro text-faint">accent</span>
          <div className="flex flex-wrap items-center gap-2">
            {accentPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                aria-label={preset.label}
                aria-pressed={accent === preset.value}
                onClick={() => setAccent(preset.value)}
                style={{ background: preset.value }}
                className={cn(
                  'h-6 w-6 rounded-sm border transition-colors duration-fast ease-std',
                  accent === preset.value ? 'border-text' : 'border-transparent',
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-micro text-faint">position</span>
          <div className="flex items-center gap-px rounded-sm border border-line p-px">
            {positions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={position === option.value}
                onClick={() => setPosition(option.value)}
                className={cn(
                  'flex-1 rounded-sm px-3 py-2 font-mono text-micro transition-colors duration-fast ease-std',
                  position === option.value ? 'bg-raised text-text' : 'text-faint hover:text-dim',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="greeting"
          value={greeting}
          onChange={(e) => setGreeting(e.target.value)}
          placeholder="Hi. Ask me anything about Acme Cloud."
        />

        <p className="text-sm text-faint">
          Nothing here is saved. It is the same panel you get after signing up, with the preview
          reacting on every keystroke.
        </p>
      </div>

      <WidgetPreview
        settings={{ ...defaultWidget, accent, position, greeting }}
        open
        onToggle={() => {}}
        className="min-h-preview min-w-0 flex-1"
      />
    </div>
  );
}
