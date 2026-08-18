import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ChatMessage } from './ChatMessage';
import type { Message } from './ChatMessage';
import { count } from '@/lib/format';
import { cn } from '@/lib/cn';

export type Stage = 'searching' | 'reading' | 'writing';

function stageLabel(stage: Stage, documents: number): string {
  if (stage === 'searching') return 'searching sources';
  if (stage === 'reading') return `reading ${count(documents)} document${documents === 1 ? '' : 's'}`;
  return 'writing';
}

const order: Stage[] = ['searching', 'reading', 'writing'];

export function ChatThread({
  messages,
  stage,
  documents,
  onRate,
  onCorrect,
  header,
  showActions = true,
}: {
  messages: Message[];
  stage: Stage | null;
  documents: number;
  onRate: (id: string, rating: 'up' | 'down') => void;
  onCorrect: (id: string) => void;
  header?: ReactNode;
  showActions?: boolean;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll this pane only: scrollIntoView would drag every scrollable ancestor with it.
  const scrollToEnd = () => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  };
  useEffect(scrollToEnd, [messages.length, stage]);

  const empty = messages.length === 0 && !stage;

  return (
    <div
      ref={listRef}
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-6',
        empty && 'justify-center',
      )}
    >
      {header}

      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onRate={onRate}
          onCorrect={onCorrect}
          onStreamDone={scrollToEnd}
          showActions={showActions}
        />
      ))}

      {stage && (
        <div className="flex items-center gap-3 border-l-2 border-line pl-4" role="status">
          {order.map((step) => (
            <span
              key={step}
              className={
                step === stage
                  ? 'font-mono text-micro text-amber'
                  : 'font-mono text-micro text-faint'
              }
            >
              {stageLabel(step, documents)}
              {step !== 'writing' && <span className="pl-3 text-faint">→</span>}
            </span>
          ))}
        </div>
      )}

    </div>
  );
}
