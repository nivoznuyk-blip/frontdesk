import { BookOpen, FileText, Globe, MessageSquareQuote } from 'lucide-react';
import type { SourceKind } from '@/mock/sources';

/** One icon per source kind, shared by every screen that lists sources. */
export const sourceIcon: Record<SourceKind, typeof Globe> = {
  crawl: Globe,
  file: FileText,
  qa: MessageSquareQuote,
  notion: BookOpen,
};
