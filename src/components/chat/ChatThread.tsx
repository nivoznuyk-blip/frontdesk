import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ChatMessage } from './ChatMessage';
import type { Message } from './ChatMessage';
import { count } from '@/lib/format';

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
}: {
  messages: Message[];
  stage: Stage | null;
  documents: number;
  onRate: (id: string, rating: 'up' | 'down') => void;
  onCorrect: (id: string) => void;
  header?: ReactNode;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => endRef.current?.scrollIntoView({ block: 'end' });
  useEffect(scrollToEnd, [messages.length, stage]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto p-6">
      {header}

      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onRate={onRate}
          onCorrect={onCorrect}
          onStreamDone={scrollToEnd}
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

      <div ref={endRef} />
    </div>
  );
}
