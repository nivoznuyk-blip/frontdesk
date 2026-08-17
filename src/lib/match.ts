import { chatScripts } from '@/mock/chatScripts';
import type { ChatScript } from '@/mock/chatScripts';
import type { Source } from '@/mock/sources';
import { useSources } from '@/store/sources';

const normalize = (text: string) => ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;

/**
 * Boundary on the left only, so "rate limit" still matches "rate limits" and
 * "invite" matches "invited". Loose is the point: a real visitor types plurals.
 */
const hit = (haystack: string, keyword: string) => haystack.includes(normalize(keyword).trimEnd());

/** Loose keyword match. Keywords are distinctive, so one hit is enough. */
export function matchScript(question: string): ChatScript | null {
  const haystack = normalize(question);
  let best: { script: ChatScript; score: number } | null = null;

  for (const script of chatScripts) {
    const score = script.keywords.filter((keyword) => hit(haystack, keyword)).length;
    if (score > 0 && (!best || score > best.score)) best = { script, score };
  }

  return best?.script ?? null;
}

/**
 * The document offered when nothing matched. Reads the live workspace rather
 * than the seed, so a source someone deleted is never suggested back to them.
 */
export function closestSource(question: string): Source | null {
  const haystack = normalize(question);
  const available = useSources.getState().sources.filter((s) => s.status !== 'failed');
  if (available.length === 0) return null;

  let best: { source: Source; score: number } | null = null;
  for (const source of available) {
    const score = source.topics.filter((topic) => hit(haystack, topic)).length;
    if (score > 0 && (!best || score > best.score)) best = { source, score };
  }

  // Nothing tagged close: offer the broadest source there is.
  return best?.source ?? available.reduce((a, b) => (b.pages > a.pages ? b : a));
}
