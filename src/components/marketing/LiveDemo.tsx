import { useRef, useState } from 'react';
import { ChatThread } from '@/components/chat/ChatThread';
import type { Stage } from '@/components/chat/ChatThread';
import { Composer } from '@/components/chat/Composer';
import type { Message } from '@/components/chat/ChatMessage';
import { landingFallback, landingQuestions, landingScripts } from '@/mock/landingChat';
import { matchScript } from '@/lib/match';
import { delay } from '@/lib/delay';

/** Frontdesk's own bot, answering about Frontdesk, with citations into /docs. */
export function LiveDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage | null>(null);
  const [documents, setDocuments] = useState(1);
  const [busy, setBusy] = useState(false);
  const turn = useRef(0);

  async function ask(question: string) {
    turn.current += 1;
    const id = turn.current;

    setBusy(true);
    setMessages((prev) => [...prev, { id: `q${id}`, role: 'user', text: question }]);

    setStage('searching');
    await delay(600);
    const script = matchScript(question, landingScripts);
    setDocuments(script ? script.citations.length : 1);
    setStage('reading');
    await delay(800);
    setStage('writing');
    await delay(300);
    setStage(null);

    setMessages((prev) => [
      ...prev,
      script
        ? { id: `a${id}`, role: 'bot', text: script.answer, stream: true, citations: script.citations }
        : { id: `a${id}`, role: 'bot', text: landingFallback, stream: true },
    ]);
    setBusy(false);
  }

  return (
    <div className="flex flex-col rounded-md border border-line bg-surface">
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-line px-4">
        <span className="text-sm text-text">Frontdesk</span>
        <span className="flex items-center gap-2 font-mono text-micro text-faint">
          <span className="h-1 w-1 rounded-full bg-success" aria-hidden />
          trained on our own docs
        </span>
      </div>

      <ChatThread
        messages={messages}
        stage={stage}
        documents={documents}
        showActions={false}
        onRate={() => {}}
        onCorrect={() => {}}
        header={
          messages.length === 0 ? (
            <div className="flex flex-col gap-4">
              <p className="max-w-measure text-dim">
                This is the same bot you would install, reading the same docs you can read. Ask it
                anything, or start with one of these.
              </p>
              <div className="flex flex-wrap gap-2">
                {landingQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => ask(question)}
                    className="rounded-sm border border-line bg-bg px-3 py-2 text-sm text-dim transition-colors duration-fast ease-std hover:border-line-strong hover:text-text"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : undefined
        }
      />

      <Composer onSend={ask} busy={busy} />
    </div>
  );
}
