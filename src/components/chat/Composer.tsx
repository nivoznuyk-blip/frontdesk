import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui';

export function Composer({ onSend, busy }: { onSend: (question: string) => void; busy: boolean }) {
  const [value, setValue] = useState('');

  function send() {
    const question = value.trim();
    if (!question || busy) return;
    setValue('');
    onSend(question);
  }

  return (
    <div className="flex items-end gap-3 border-t border-line bg-bg p-4">
      <textarea
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        aria-label="Ask the bot a question"
        placeholder="Ask it the way a customer would"
        className="flex-1 resize-none rounded-sm border border-line bg-surface px-3 py-2 text-sm text-text outline-none transition-colors duration-fast ease-std placeholder:text-faint focus:border-amber-dim"
      />
      <Button variant="primary" onClick={send} disabled={!value.trim() || busy} iconRight={<Send size={14} />}>
        Ask
      </Button>
    </div>
  );
}
