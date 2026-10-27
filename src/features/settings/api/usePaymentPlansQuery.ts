import { useQuery } from "@tanstack/react-query"

import { fetchPaymentPlans } from "./apiPayments"

export const PAYMENT_PLANS_QUERY_KEY = ["paymentPlans"]

const PLANS_QUERY_SILENT_ERRORS = [
  { status: 401 },
  { status: 500 },
  { status: 502 },
  { status: 503 },
  { status: 504 },
] as const

export const usePaymentPlansQuery = (enabled = true) => {
  return useQuery({
    enabled,
    meta: {
      silentErrors: [...PLANS_QUERY_SILENT_ERRORS],
    },
    queryKey: PAYMENT_PLANS_QUERY_KEY,
    queryFn: fetchPaymentPlans,
    retry: false,
  })
}
