import { cn } from '@/lib/cn';

export interface TabItem {
  value: string;
  label: string;
}

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: TabItem[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div role="tablist" className="flex items-center gap-6 border-b border-line">
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'relative -mb-px border-b py-2 text-sm transition-colors duration-fast ease-std',
              active ? 'border-amber text-text' : 'border-transparent text-faint hover:text-dim',
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
