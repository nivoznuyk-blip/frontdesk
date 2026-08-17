import { create } from 'zustand';
import { clock } from '@/lib/format';

export interface LogEntry {
  id: number;
  time: string;
  message: string;
}

interface LogState {
  entries: LogEntry[];
  push: (message: string) => void;
}

const KEEP = 40;

/**
 * What the system last did, shown in the strip pinned to the bottom of the shell.
 * Session only: a log of this run, not a history worth persisting.
 */
export const useLog = create<LogState>()((set) => ({
  entries: [],
  push: (message) =>
    set((state) => {
      const last = state.entries[state.entries.length - 1];
      if (last?.message === message) return state;
      const entry = { id: (last?.id ?? 0) + 1, time: clock(), message };
      return { entries: [...state.entries, entry].slice(-KEEP) };
    }),
}));
