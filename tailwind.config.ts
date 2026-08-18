import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      bg: 'var(--bg)',
      surface: 'var(--surface)',
      raised: 'var(--surface-raised)',
      sunken: 'var(--surface-sunken)',
      line: 'var(--border)',
      'line-strong': 'var(--border-strong)',
      text: 'var(--text)',
      dim: 'var(--text-dim)',
      faint: 'var(--text-faint)',
      amber: 'var(--amber)',
      'amber-hover': 'var(--amber-hover)',
      'amber-dim': 'var(--amber-dim)',
      'amber-wash': 'var(--amber-wash)',
      'on-amber': 'var(--on-amber)',
      cite: 'var(--cite)',
      'cite-wash': 'var(--cite-wash)',
      // DESIGN.md §6: the citation chip border is --cite at 30%. Derived, not a new colour.
      'cite-edge': 'color-mix(in srgb, var(--cite) 30%, transparent)',
      success: 'var(--success)',
      'success-wash': 'var(--success-wash)',
      danger: 'var(--danger)',
      'danger-wash': 'var(--danger-wash)',
      warning: 'var(--warning)',
      'warning-wash': 'var(--warning-wash)',
    },
    borderRadius: { none: '0', sm: 'var(--r-sm)', md: 'var(--r-md)', full: '9999px' },
    fontFamily: { sans: 'var(--font-sans)', mono: 'var(--font-mono)' },
    fontWeight: { normal: '400', medium: '500' },
    fontSize: {
      micro: ['11px', { lineHeight: '1.4', letterSpacing: '0.03em' }],
      label: ['12px', { lineHeight: '1.4', letterSpacing: '0.02em' }],
      code: ['12.5px', { lineHeight: '1.7' }],
      sm: ['13px', { lineHeight: '1.5' }],
      base: ['15px', { lineHeight: '1.6' }],
      lg: ['18px', { lineHeight: '1.55' }],
      h3: ['22px', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      h2: ['30px', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      h1: ['44px', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      display: ['60px', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
    },
    spacing: {
      0: '0', px: '1px', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
      6: '24px', 8: '32px', 9: '36px', 11: '44px', 12: '48px',
      14: '56px', 16: '64px', 24: '96px', 32: '128px',
    },
    extend: {
      maxWidth: {
        container: '1180px',
        measure: '65ch',
        control: '320px',
        bubble: '80%',
        flow: '680px',
        dialog: '440px',
      },
      width: {
        sidebar: '220px',
        context: '320px',
        aside: '360px',
        settings: '480px',
        caret: '7px',
      },
      minHeight: {
        preview: '520px',
      },
      height: {
        switch: '20px',
        terminal: '152px',
      },
      maxHeight: {
        widget: '420px',
      },
      translate: {
        switch: '14px',
      },
      scale: {
        press: '0.985',
      },
      // Defaults, so a bare `transition-colors` is already on the system curve
      // rather than Tailwind's 150ms / cubic-bezier(.4, 0, .2, 1).
      transitionTimingFunction: { DEFAULT: 'var(--ease)', std: 'var(--ease)' },
      transitionDuration: { DEFAULT: '120ms', fast: '120ms', base: '180ms', slow: '260ms' },
      transitionProperty: { 'transform-color': 'transform, background-color' },
      keyframes: {
        blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        breathe: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.45' } },
      },
      animation: {
        // The cursor and the skeleton are the only loops in the product.
        blink: 'blink 1s steps(1) infinite',
        pulse: 'breathe 1.6s var(--ease) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
