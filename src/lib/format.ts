export const count = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));

export const percent = (n: number, digits = 0) => `${n.toFixed(digits)}%`;

export const money = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export function clock(d: Date = new Date()): string {
  return d.toLocaleTimeString('en-GB', { hour12: false });
}

export function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min} min ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return `${Math.round(hr / 24)} d ago`;
}
