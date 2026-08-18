import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { create } from 'zustand';
import { clock } from '@/lib/format';

export interface LogEntry {
  id: number;
  time: string;
  message: string;
  /** The route the event happened on, so the strip only shows this screen's work. */
  screen: string;
}

interface LogState {
  entries: LogEntry[];
  push: (message: string, screen: string) => void;
}

const KEEP = 40;

/**
 * What the system last did, shown in the strip pinned to the bottom of the shell.
 * Session only: a log of this run, not a history worth persisting.
 */
export const useLog = create<LogState>()((set) => ({
  entries: [],
  push: (message, screen) =>
    set((state) => {
      const last = state.entries[state.entries.length - 1];
      if (last?.message === message && last.screen === screen) return state;
      const entry = { id: (last?.id ?? 0) + 1, time: clock(), message, screen };
      return { entries: [...state.entries, entry].slice(-KEEP) };
    }),
}));

/** Pushes tagged with the screen they happened on. */
export function useLogger() {
  const push = useLog((state) => state.push);
  const { pathname } = useLocation();
  return useCallback((message: string) => push(message, pathname), [push, pathname]);
}
