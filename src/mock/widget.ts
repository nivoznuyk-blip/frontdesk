export type Position = 'bottom-right' | 'bottom-left';
export type LauncherShape = 'round' | 'square';
export type Tone = 'plain' | 'warm' | 'formal';
export type MobileBehaviour = 'full' | 'launcher' | 'hidden';
export type EmailTiming = 'before' | 'after';

export interface WidgetSettings {
  /** The customer's brand colour. Applied to the widget by inline style, never to our own UI. */
  accent: string;
  position: Position;
  shape: LauncherShape;
  avatar: boolean;
  greeting: string;
  starters: string[];
  tone: Tone;
  showCitations: boolean;
  mobile: MobileBehaviour;
  emailTiming: EmailTiming;
  handoffEmail: string;
  showBadge: boolean;
}

export const MAX_STARTERS = 4;

export const defaultWidget: WidgetSettings = {
  accent: '#E5A33C',
  position: 'bottom-right',
  shape: 'round',
  avatar: true,
  greeting: 'Hi. Ask me anything about Acme Cloud.',
  starters: ['How do I invite a teammate?', 'What are the API rate limits?'],
  tone: 'plain',
  showCitations: true,
  mobile: 'full',
  emailTiming: 'after',
  handoffEmail: 'support@acmecloud.com',
  showBadge: true,
};

/**
 * Preset swatches. Every value is one this design system already defines, so the
 * palette gains nothing new — a customer can still type their own brand hex.
 */
export const accentPresets = [
  { value: '#E5A33C', label: 'amber' },
  { value: '#7FA4C4', label: 'blue' },
  { value: '#7FB069', label: 'green' },
  { value: '#D9605A', label: 'red' },
  { value: '#C9A227', label: 'gold' },
];

export const positions: Array<{ value: Position; label: string }> = [
  { value: 'bottom-right', label: 'Bottom right' },
  { value: 'bottom-left', label: 'Bottom left' },
];

export const shapes: Array<{ value: LauncherShape; label: string }> = [
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' },
];

export const tones: Array<{ value: Tone; label: string }> = [
  { value: 'plain', label: 'Plain — says the thing and stops' },
  { value: 'warm', label: 'Warm — a little friendlier' },
  { value: 'formal', label: 'Formal — full sentences, no contractions' },
];

export const mobileBehaviours: Array<{ value: MobileBehaviour; label: string }> = [
  { value: 'full', label: 'Open full screen' },
  { value: 'launcher', label: 'Stay a launcher until tapped' },
  { value: 'hidden', label: 'Hide on mobile' },
];

export const emailTimings: Array<{ value: EmailTiming; label: string }> = [
  { value: 'after', label: 'After the first answer' },
  { value: 'before', label: 'Before the first answer' },
];

/** One sample exchange, phrased three ways, so the tone setting is visible in the preview. */
export const sampleQuestion = 'How many seats do we get?';

export const sampleAnswers: Record<Tone, string> = {
  plain: 'Seats are per plan: 1 on Free, 3 on Starter, unlimited on Growth.',
  warm: 'Happy to help — it depends on the plan: 1 seat on Free, 3 on Starter, and unlimited on Growth.',
  formal:
    'Seat allocation depends on your plan. Free includes one seat, Starter includes three, and Growth is unlimited.',
};

export const sampleCitation = 'pricing-sheet-2026.pdf, p.2';
