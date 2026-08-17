import { useStreamedText } from '@/lib/stream';

/** Streams the answer in, with a block cursor sitting at the tail until it lands. */
export function StreamingText({ text, onDone }: { text: string; onDone?: () => void }) {
  const { shown, done } = useStreamedText(text, onDone);

  return (
    <p className="whitespace-pre-wrap text-base text-text">
      {shown}
      {!done && (
        <span className="ml-px inline-block h-3 w-caret translate-y-px animate-blink bg-amber" aria-hidden />
      )}
    </p>
  );
}
