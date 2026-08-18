import { Send, X } from 'lucide-react';
import { WidgetLauncher } from './WidgetLauncher';
import { cn } from '@/lib/cn';
import { onAccent } from '@/lib/contrast';
import { sampleAnswers, sampleCitation, sampleQuestion } from '@/mock/widget';
import type { WidgetSettings } from '@/mock/widget';
import { company } from '@/mock/company';

/** The customer's site, sketched rather than drawn, so the widget is what reads. */
function SiteMock() {
  return (
    <div className="flex flex-col gap-6 p-6" aria-hidden>
      <div className="flex items-center gap-4 border-b border-line pb-4">
        <div className="h-3 w-16 rounded-sm bg-raised" />
        <div className="ml-auto flex gap-3">
          <div className="h-2 w-8 rounded-sm bg-raised" />
          <div className="h-2 w-8 rounded-sm bg-raised" />
          <div className="h-2 w-8 rounded-sm bg-raised" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="h-4 w-2/3 rounded-sm bg-raised" />
        <div className="h-2 w-full rounded-sm bg-surface" />
        <div className="h-2 w-full rounded-sm bg-surface" />
        <div className="h-2 w-1/2 rounded-sm bg-surface" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="h-16 rounded-sm bg-surface" />
        <div className="h-16 rounded-sm bg-surface" />
        <div className="h-16 rounded-sm bg-surface" />
      </div>
    </div>
  );
}

export function WidgetPreview({
  settings,
  open,
  onToggle,
  className,
}: {
  settings: WidgetSettings;
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const accentText = onAccent(settings.accent);

  return (
    <div className={cn('relative overflow-hidden rounded-md border border-line bg-sunken', className)}>
      <div className="flex h-8 items-center border-b border-line px-3">
        <span className="font-mono text-micro text-faint">{company.domain}</span>
      </div>

      <SiteMock />

      <div
        className={cn(
          // Inset on all four sides, so the widget is bounded by the frame in both axes.
          'absolute inset-x-4 bottom-4 top-12 flex flex-col justify-end gap-3',
          settings.position === 'bottom-right' ? 'items-end' : 'items-start',
        )}
      >
        {open && (
          <div className="flex min-h-0 w-context max-h-widget max-w-full flex-1 flex-col overflow-hidden rounded-md border border-line bg-bg">
            <header
              className="flex h-11 shrink-0 items-center gap-3 px-3"
              style={{ background: settings.accent, color: accentText }}
            >
              {settings.avatar && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current">
                  <span className="font-mono text-micro" style={{ color: settings.accent }}>
                    AC
                  </span>
                </span>
              )}
              <span className="text-sm">{company.name}</span>
              <button
                type="button"
                onClick={onToggle}
                aria-label="Close the chat"
                className="ml-auto"
                style={{ color: accentText }}
              >
                <X size={14} aria-hidden />
              </button>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
              <p className="border-l-2 border-line-strong pl-3 text-sm text-text">{settings.greeting}</p>

              {settings.emailTiming === 'before' ? (
                <div className="flex flex-col gap-2 rounded-sm border border-line bg-surface p-3">
                  <span className="text-micro text-dim">Where should we send the answer?</span>
                  <div className="flex h-8 items-center rounded-sm border border-line bg-bg px-2">
                    <span className="font-mono text-micro text-faint">you@company.com</span>
                  </div>
                </div>
              ) : (
                <>
                  {settings.starters.length > 0 && (
                    <div className="flex flex-col items-start gap-2">
                      {settings.starters.map((starter, index) => (
                        <span
                          key={`${starter}-${index}`}
                          className="rounded-sm border border-line px-2 py-1 text-micro text-dim"
                        >
                          {starter}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="ml-auto max-w-bubble rounded-md bg-raised px-3 py-2 text-sm text-text">
                    {sampleQuestion}
                  </p>

                  <div className="flex flex-col gap-2 border-l-2 border-line-strong pl-3">
                    <p className="text-sm text-text">{sampleAnswers[settings.tone]}</p>
                    {settings.showCitations && (
                      <span className="self-start rounded-sm border border-cite-edge bg-cite-wash px-2 py-px font-mono text-micro text-cite">
                        {sampleCitation}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2 border-t border-line p-3">
              <div className="flex h-8 flex-1 items-center rounded-sm border border-line bg-surface px-2">
                <span className="font-mono text-micro text-faint">Ask a question</span>
              </div>
              <span
                className="flex h-8 w-8 items-center justify-center rounded-sm"
                style={{ background: settings.accent, color: accentText }}
              >
                <Send size={14} aria-hidden />
              </span>
            </div>

            {settings.showBadge && (
              <div className="shrink-0 border-t border-line px-3 py-2 text-center font-mono text-micro text-faint">
                Powered by Frontdesk
              </div>
            )}
          </div>
        )}

        <WidgetLauncher
          accent={settings.accent}
          shape={settings.shape}
          avatar={settings.avatar}
          onClick={onToggle}
        />
      </div>
    </div>
  );
}
