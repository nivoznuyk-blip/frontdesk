/**
 * Readable text for an arbitrary customer accent. Returns one of our own tokens
 * rather than black or white, picking whichever actually has more contrast
 * against the accent instead of guessing from a brightness threshold.
 */

const relativeLuminance = (hex: string): number | null => {
  const value = hex.replace('#', '');
  if (value.length !== 6) return null;

  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  if ([r, g, b].some(Number.isNaN)) return null;

  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** Luminance of the two tokens we are allowed to put on an accent fill. */
const ON_AMBER = 0.0081; // --on-amber #201400
const TEXT = 0.8481; // --text #F0EDE6

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

export function onAccent(hex: string): string {
  const luminance = relativeLuminance(hex);
  if (luminance === null) return 'var(--on-amber)';

  return contrast(luminance, ON_AMBER) >= contrast(luminance, TEXT)
    ? 'var(--on-amber)'
    : 'var(--text)';
}

export const isHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);
