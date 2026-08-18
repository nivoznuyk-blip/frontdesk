import { MessageSquare } from 'lucide-react';
import { cn } from '@/lib/cn';
import { onAccent } from '@/lib/contrast';
import type { LauncherShape } from '@/mock/widget';

export function WidgetLauncher({
  accent,
  shape,
  avatar,
  onClick,
}: {
  accent: string;
  shape: LauncherShape;
  avatar: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open the chat"
      style={{ background: accent, color: onAccent(accent) }}
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center',
        'transition-transform duration-fast ease-std active:scale-press',
        shape === 'round' ? 'rounded-full' : 'rounded-md',
      )}
    >
      {avatar ? (
        <span className="font-mono text-sm">AC</span>
      ) : (
        <MessageSquare size={18} aria-hidden />
      )}
    </button>
  );
}
