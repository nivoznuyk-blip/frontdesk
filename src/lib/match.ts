import { chatScripts } from '@/mock/chatScripts';
import type { ChatScript } from '@/mock/chatScripts';
import { helpCenter, sources } from '@/mock/sources';
import type { Source } from '@/mock/sources';

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

/** The document offered when nothing matched. Falls back to the broadest source. */
export function closestSource(question: string): Source {
  const haystack = normalize(question);
  let best: { source: Source; score: number } | null = null;

  for (const source of sources) {
    if (source.status === 'failed') continue;
    const score = source.topics.filter((topic) => hit(haystack, topic)).length;
    if (score > 0 && (!best || score > best.score)) best = { source, score };
  }

  return best?.source ?? helpCenter;
}
