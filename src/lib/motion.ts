import { useReducedMotion } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';

/**
 * Every animation in the product is defined here. DESIGN.md §7: transform and
 * opacity only, nothing longer than 320ms except the deliberate crawl sequences
 * in onboarding and the landing terminal, which run on timers rather than here.
 */

export const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export const DURATION = { fast: 0.12, base: 0.18, slow: 0.26 } as const;

/** Route change: 8px rise plus fade. Leaving only fades, so the two never fight. */
export const routeVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
};

/** A toast arrives from below its resting place and leaves the same way. */
export const toastVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

/** One nudge to say the widget is there. Fires once, never loops. */
export const attentionPulse = { scale: [1, 1.08, 1] };

const still: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
};

/**
 * Props for an element that animates in and out. Reduced motion gets the cut
 * rather than the move — the one exception is streaming text, which shows its
 * finished text instead of being dropped.
 */
export function useMotionProps(variants: Variants, duration: number = DURATION.base) {
  const reduced = useReducedMotion();

  return {
    variants: reduced ? still : variants,
    initial: 'initial' as const,
    animate: 'animate' as const,
    exit: 'exit' as const,
    transition: (reduced ? { duration: 0 } : { duration, ease: EASE }) as Transition,
  };
}

export const useRouteMotion = () => useMotionProps(routeVariants, DURATION.base);

export const useToastMotion = () => useMotionProps(toastVariants, DURATION.base);

/** The launcher's one-time nudge, or nothing at all under reduced motion. */
export function useAttentionPulse(active: boolean) {
  const reduced = useReducedMotion();

  return {
    animate: active && !reduced ? attentionPulse : { scale: 1 },
    transition: { duration: DURATION.slow, ease: EASE } as Transition,
  };
}
