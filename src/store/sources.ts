import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { sources as seed } from '@/mock/sources';
import type { Source } from '@/mock/sources';

interface SourcesState {
  sources: Source[];
  add: (source: Source) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<Source>) => void;
  reset: () => void;
}

/**
 * Sources survive a refresh, the way a real workspace would. Bump the version
 * when the shape of a Source changes, so an old cache is replaced by the seed.
 */
export const useSources = create<SourcesState>()(
  persist(
    (set) => ({
      sources: seed,
      add: (source) => set((state) => ({ sources: [source, ...state.sources] })),
      remove: (id) => set((state) => ({ sources: state.sources.filter((s) => s.id !== id) })),
      update: (id, patch) =>
        set((state) => ({
          sources: state.sources.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      reset: () => set({ sources: seed }),
    }),
    { name: 'frontdesk.sources', version: 3 },
  ),
);

/** Pages that count against the plan. A failed source indexed nothing. */
export const indexedPages = (sources: Source[]) =>
  sources.filter((s) => s.status !== 'failed').reduce((total, s) => total + s.pages, 0);

/**
 * Writes a correction into the Manual answers source, creating it if a workspace
 * has none. Every screen that fixes an answer goes through here, so the loop
 * closes the same way from the playground, the inbox and insights.
 */
export function addManualAnswer(question: string, answer: string) {
  const { sources, add, update } = useSources.getState();
  const existing = sources.find((s) => s.kind === 'qa');
  const pair = `Q: ${question}\nA: ${answer}`;

  if (existing) {
    update(existing.id, {
      pages: existing.pages + 1,
      chunks: existing.chunks + 1,
      lastIndexed: new Date().toISOString(),
      extract: existing.extract ? `${pair}\n\n${existing.extract}` : pair,
    });
    return existing.id;
  }

  const id = `src-${Date.now().toString(36)}`;
  add({
    id,
    name: 'Manual answers',
    kind: 'qa',
    pages: 1,
    chunks: 1,
    status: 'indexed',
    lastIndexed: new Date().toISOString(),
    topics: [],
    extract: pair,
  });
  return id;
}
