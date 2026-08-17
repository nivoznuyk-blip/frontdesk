import { useReducedMotion } from 'framer-motion';
import type { Transition, Variants } from 'framer-motion';

export const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export const DURATION = { fast: 0.12, base: 0.18, slow: 0.26 } as const;

export const routeTransition: Transition = { duration: DURATION.base, ease: EASE };

/** Route change: 8px rise plus fade. Leaving only fades, so the two never fight. */
export const routeVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 0 },
};

const stillVariants: Variants = {
  initial: { opacity: 1, y: 0 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 1, y: 0 },
};

/** Props for the element that swaps on navigation. Reduced motion gets the cut, not the move. */
export function useRouteMotion() {
  const reduced = useReducedMotion();
  return {
    variants: reduced ? stillVariants : routeVariants,
    initial: 'initial' as const,
    animate: 'animate' as const,
    exit: 'exit' as const,
    transition: reduced ? { duration: 0 } : routeTransition,
  };
}
