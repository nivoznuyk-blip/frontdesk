/**
 * Readable text for an arbitrary customer accent. Returns one of our own tokens
 * rather than black or white, so the widget stays inside the palette.
 */
export function onAccent(hex: string): string {
  const value = hex.replace('#', '');
  if (value.length !== 6) return 'var(--on-amber)';

  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const channel = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

  return luminance > 0.4 ? 'var(--on-amber)' : 'var(--text)';
}

export const isHex = (value: string) => /^#[0-9a-f]{6}$/i.test(value);
