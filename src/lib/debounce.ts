import { useEffect, useRef } from 'react';

/**
 * Runs the callback once the value has been still for `ms`. Used to keep the log
 * line readable while a text field updates the preview on every keystroke.
 */
export function useDebounced<T>(value: T, ms: number, onSettled: (value: T) => void) {
  const callback = useRef(onSettled);
  callback.current = onSettled;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = setTimeout(() => callback.current(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
}
