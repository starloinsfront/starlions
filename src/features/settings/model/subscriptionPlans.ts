export const SUBSCRIPTION_PLANS = [
  { value: "day", label: "$10 per 1 Day", amount: 10, typeSubscription: "DAY" },
  { value: "week", label: "$50 per 7 Day", amount: 50, typeSubscription: "WEEK" },
  { value: "month", label: "$100 per month", amount: 100, typeSubscription: "MONTH" },
] as const

export type SubscriptionPlanId = (typeof SUBSCRIPTION_PLANS)[number]["value"]

export const getSubscriptionPlanDetails = (planId: SubscriptionPlanId) => {
  return SUBSCRIPTION_PLANS.find((plan) => plan.value === planId) ?? SUBSCRIPTION_PLANS[0]
}
