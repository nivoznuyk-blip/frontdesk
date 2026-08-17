import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Words with their trailing whitespace, so joining a prefix always reads correctly. */
export function splitTokens(text: string): string[] {
  return text.match(/\S+\s*/g) ?? [];
}

const MS_PER_TOKEN = 22;

/**
 * Reveals text one token at a time. Reduced motion jumps to the finished text
 * rather than dropping the answer, which is the one animation DESIGN.md keeps.
 */
export function useStreamedText(text: string, onDone?: () => void) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(reduced ? text : '');

  useEffect(() => {
    const tokens = splitTokens(text);

    if (reduced) {
      setShown(text);
      onDone?.();
      return;
    }

    setShown('');
    let index = 0;
    const id = setInterval(() => {
      index += 1;
      setShown(tokens.slice(0, index).join(''));
      if (index >= tokens.length) {
        clearInterval(id);
        onDone?.();
      }
    }, MS_PER_TOKEN);

    return () => clearInterval(id);
    // onDone is intentionally not a dependency: it changes every render in callers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduced]);

  return { shown, done: shown === text };
}
