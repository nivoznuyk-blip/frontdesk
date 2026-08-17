import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlanId } from '@/mock/plans';

interface PlanState {
  plan: PlanId;
  setPlan: (plan: PlanId) => void;
}

/** Acme Cloud sits on Starter, which puts the demo close to the page cap. */
export const usePlan = create<PlanState>()(
  persist((set) => ({ plan: 'starter', setPlan: (plan) => set({ plan }) }), {
    name: 'frontdesk.plan',
    version: 1,
  }),
);
