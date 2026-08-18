import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Plus, X } from 'lucide-react';
import { Button, Input, Panel, Select, Switch, Textarea } from '@/components/ui';
import { EmbedCode } from '@/components/widget/EmbedCode';
import { WidgetPreview } from '@/components/widget/WidgetPreview';
import { useWidget } from '@/store/widget';
import { usePlan } from '@/store/plan';
import { useLogger } from '@/store/log';
import { plans } from '@/mock/plans';
import {
  MAX_STARTERS, accentPresets, emailTimings, mobileBehaviours, positions, shapes, tones,
} from '@/mock/widget';
import type { EmailTiming, LauncherShape, MobileBehaviour, Position, Tone } from '@/mock/widget';
import { isHex } from '@/lib/contrast';
import { useDebounced } from '@/lib/debounce';
import { count } from '@/lib/format';
import { cn } from '@/lib/cn';

const isEmail = (value: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

/** Keeps a log line short enough to read at 11px. */
const clip = (text: string) => (text.length > 32 ? `${text.slice(0, 32)}…` : text);

export default function WidgetBuilder() {
  const navigate = useNavigate();
  const { settings, set } = useWidget();
  const plan = plans[usePlan((state) => state.plan)];
  const log = useLogger();
  const [open, setOpen] = useState(true);

  // Text fields update the preview on every keystroke; the log waits for a pause.
  useDebounced(settings.greeting, 600, (value) => log(`greeting → "${clip(value)}"`));
  useDebounced(settings.handoffEmail, 600, (value) => log(`handoff → ${value}`));
  useDebounced(settings.starters.join('|'), 600, () =>
    log(`starters → ${count(settings.starters.length)} questions`),
  );

  function change<K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
    line?: string,
  ) {
    set(key, value);
    if (line) log(line);
  }

  function setStarter(index: number, value: string) {
    const next = [...settings.starters];
    next[index] = value;
    set('starters', next);
  }

  function addStarter() {
    if (settings.starters.length >= MAX_STARTERS) return;
    set('starters', [...settings.starters, '']);
    log(`starters → ${count(settings.starters.length + 1)} questions`);
  }

  function removeStarter(index: number) {
    set('starters', settings.starters.filter((_, i) => i !== index));
    log(`starters → ${count(settings.starters.length - 1)} questions`);
  }

  const badgeLocked = !plan.removesBadge;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-h2 font-medium">Widget</h1>
        <Button
          size="sm"
          variant="ghost"
          iconRight={<ExternalLink size={14} />}
          onClick={() => navigate('/widget-demo')}
        >
          Preview on a real site
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 gap-6 max-md:flex-col max-md:overflow-y-auto">
        <div className="flex w-settings min-w-0 shrink-0 flex-col gap-4 overflow-y-auto pb-6 pr-2 max-md:w-full max-md:overflow-visible">
          <Panel title="Appearance">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-micro text-faint">accent</span>
                <div className="flex flex-wrap items-center gap-2">
                  {accentPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      aria-label={preset.label}
                      aria-pressed={settings.accent.toLowerCase() === preset.value.toLowerCase()}
                      onClick={() => change('accent', preset.value, `accent → ${preset.value}`)}
                      style={{ background: preset.value }}
                      className={cn(
                        'h-6 w-6 rounded-sm border transition-colors duration-fast ease-std',
                        settings.accent.toLowerCase() === preset.value.toLowerCase()
                          ? 'border-text'
                          : 'border-transparent',
                      )}
                    />
                  ))}
                </div>
                <Input
                  aria-label="Accent colour as hex"
                  mono
                  value={settings.accent}
                  onChange={(e) => set('accent', e.target.value)}
                  onBlur={(e) => isHex(e.target.value) && log(`accent → ${e.target.value}`)}
                  error={isHex(settings.accent) ? undefined : 'Six digit hex, like #E5A33C.'}
                />
              </div>

              <Select
                label="position"
                value={settings.position}
                options={positions}
                onChange={(e) =>
                  change('position', e.target.value as Position, `position → ${e.target.value}`)
                }
              />

              <Select
                label="launcher shape"
                value={settings.shape}
                options={shapes}
                onChange={(e) =>
                  change('shape', e.target.value as LauncherShape, `launcher → ${e.target.value}`)
                }
              />

              <Switch
                checked={settings.avatar}
                onChange={(next) => change('avatar', next, `avatar → ${next ? 'on' : 'off'}`)}
                label="Show the avatar"
                hint="A monogram on the launcher and in the header."
              />
            </div>
          </Panel>

          <Panel title="What it says">
            <div className="flex flex-col gap-6">
              <Textarea
                label="Greeting"
                labelTone="prose"
                rows={2}
                value={settings.greeting}
                onChange={(e) => set('greeting', e.target.value)}
              />

              <div className="flex flex-col gap-3">
                <span className="font-mono text-micro text-faint">
                  starter questions · {count(settings.starters.length)} of {count(MAX_STARTERS)}
                </span>
                {settings.starters.map((starter, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        aria-label={`Starter question ${index + 1}`}
                        value={starter}
                        onChange={(e) => setStarter(index, e.target.value)}
                        placeholder="Do you offer refunds?"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={`Remove starter question ${index + 1}`}
                      onClick={() => removeStarter(index)}
                    >
                      <X size={14} aria-hidden />
                    </Button>
                  </div>
                ))}
                <div>
                  <Button
                    size="sm"
                    variant="secondary"
                    iconLeft={<Plus size={14} />}
                    onClick={addStarter}
                    disabled={settings.starters.length >= MAX_STARTERS}
                  >
                    Add a question
                  </Button>
                </div>
              </div>

              <Select
                label="tone"
                value={settings.tone}
                options={tones}
                onChange={(e) => change('tone', e.target.value as Tone, `tone → ${e.target.value}`)}
              />

              <Switch
                checked={settings.showCitations}
                onChange={(next) =>
                  change('showCitations', next, `citations → ${next ? 'shown' : 'hidden'}`)
                }
                label="Show citations"
                hint="Visitors see which page an answer came from."
              />
            </div>
          </Panel>

          <Panel title="Behaviour">
            <div className="flex flex-col gap-6">
              <Select
                label="on mobile"
                value={settings.mobile}
                options={mobileBehaviours}
                onChange={(e) =>
                  change('mobile', e.target.value as MobileBehaviour, `mobile → ${e.target.value}`)
                }
              />

              <Select
                label="ask for an email"
                value={settings.emailTiming}
                options={emailTimings}
                onChange={(e) =>
                  change('emailTiming', e.target.value as EmailTiming, `email → ${e.target.value}`)
                }
              />

              <Input
                label="hand off to"
                mono
                value={settings.handoffEmail}
                onChange={(e) => set('handoffEmail', e.target.value)}
                error={isEmail(settings.handoffEmail) ? undefined : 'This needs to be an address a person reads.'}
                hint="Where a conversation goes when the visitor asks for a human."
              />

              <div className="flex flex-col gap-3">
                <Switch
                  checked={!settings.showBadge}
                  disabled={badgeLocked}
                  onChange={(next) =>
                    change('showBadge', !next, `badge → ${next ? 'hidden' : 'shown'}`)
                  }
                  label="Remove Powered by Frontdesk"
                  hint="The badge sits at the bottom of the widget."
                />
                {badgeLocked && <BadgePaywall onSeePlans={() => navigate('/pricing')} />}
              </div>
            </div>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-auto max-md:overflow-visible">
          <WidgetPreview
            settings={settings}
            open={open}
            onToggle={() => setOpen((v) => !v)}
            className="min-h-preview flex-1"
          />

          <Panel title="Embed code" className="shrink-0">
            <EmbedCode settings={settings} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function BadgePaywall({ onSeePlans }: { onSeePlans: () => void }) {
  const starter = plans.starter;

  return (
    <div className="flex flex-col gap-3 rounded-md border border-line bg-surface p-4">
      <span className="font-mono text-micro text-warning">free plan</span>
      <p className="max-w-measure text-sm text-text">
        The badge stays on Free. {starter.name} takes it off, and adds lead capture and human
        handoff, for ${count(starter.price)} a month.
      </p>
      <div>
        <Button size="sm" variant="secondary" onClick={onSeePlans}>
          See plans
        </Button>
      </div>
    </div>
  );
}
