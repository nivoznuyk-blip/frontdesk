import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn('relative rounded-md border border-line bg-sunken', className)}>
      <button
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy code'}
        className={cn(
          'absolute right-2 top-2 inline-flex h-6 items-center gap-2 rounded-sm px-2',
          'font-mono text-micro transition-colors duration-fast ease-std',
          copied ? 'text-success' : 'text-faint hover:bg-raised hover:text-dim',
        )}
      >
        {copied ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
        {copied ? 'copied' : 'copy'}
      </button>
      <pre className="overflow-x-auto p-4 pr-24 font-mono text-code text-dim">
        <code>{code}</code>
      </pre>
    </div>
  );
}
