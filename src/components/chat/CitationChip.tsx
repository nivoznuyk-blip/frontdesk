import { cn } from '@/lib/cn';
import type { Citation } from '@/mock/chatScripts';

export function CitationChip({
  citation,
  open,
  onToggle,
}: {
  citation: Citation;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={cn(
        'inline-flex items-center rounded-sm border border-cite-edge px-2 py-px',
        'font-mono text-micro text-cite transition-colors duration-fast ease-std',
        open ? 'bg-cite-wash' : 'bg-transparent hover:bg-cite-wash',
      )}
    >
      {citation.label}
    </button>
  );
}
