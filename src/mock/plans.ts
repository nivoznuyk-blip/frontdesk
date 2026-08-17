export type PlanId = 'free' | 'starter' | 'growth';

export interface Plan {
  id: PlanId;
  name: string;
  /** Dollars per month, billed monthly. */
  price: number;
  bots: number;
  answersPerMonth: number;
  pages: number;
  teamMembers: number | 'unlimited';
  insightsHistoryDays: number | 'unlimited';
  removesBadge: boolean;
  leadCapture: boolean;
  reviewQueue: boolean;
  humanHandoff: boolean;
  api: boolean;
}

export const plans: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    bots: 1,
    answersPerMonth: 100,
    pages: 10,
    teamMembers: 1,
    insightsHistoryDays: 7,
    removesBadge: false,
    leadCapture: false,
    reviewQueue: false,
    humanHandoff: false,
    api: false,
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 39,
    bots: 3,
    answersPerMonth: 2000,
    pages: 500,
    teamMembers: 3,
    insightsHistoryDays: 30,
    removesBadge: true,
    leadCapture: true,
    reviewQueue: true,
    humanHandoff: true,
    api: false,
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 129,
    bots: 10,
    answersPerMonth: 10_000,
    pages: 5000,
    teamMembers: 'unlimited',
    insightsHistoryDays: 'unlimited',
    removesBadge: true,
    leadCapture: true,
    reviewQueue: true,
    humanHandoff: true,
    api: true,
  },
};

/** The plan a workspace moves to when it outgrows the current one. */
export const nextPlanUp: Record<PlanId, PlanId | null> = {
  free: 'starter',
  starter: 'growth',
  growth: null,
};
