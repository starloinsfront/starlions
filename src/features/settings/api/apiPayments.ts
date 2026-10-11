import { getAuthHeaders } from "@/features/auth/api/apiAuth"
import { ApiError } from "@/common/utils/api/error/apiError"
import { getPublicApiBaseUrl } from "@/common/utils/auth/startGoogleOAuth"

import type { SubscriptionPlanId } from "../model/subscriptionPlans"
import { getSubscriptionPlanDetails } from "../model/subscriptionPlans"

export type PaymentProvider = "paypal" | "stripe"

type CreateSubscriptionPaymentInput = {
  autoRenewal: boolean
  plan: SubscriptionPlanId
  provider: PaymentProvider
  returnUrl: string
}

type CreateSubscriptionPaymentResponse = {
  paymentUrl?: string
  url?: string
}

const PAYMENT_PROVIDER_API: Record<PaymentProvider, "PAYPAL" | "STRIPE"> = {
  paypal: "PAYPAL",
  stripe: "STRIPE",
}

export const createSubscriptionPayment = async ({
  autoRenewal,
  plan,
  provider,
  returnUrl,
}: CreateSubscriptionPaymentInput): Promise<string> => {
  const apiBase = getPublicApiBaseUrl()
  const planDetails = getSubscriptionPlanDetails(plan)
  const paymentProvider = PAYMENT_PROVIDER_API[provider]

  const response = await fetch(`${apiBase}/api/v1/payments/subscription`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      amount: planDetails.amount,
      autoRenewal,
      baseUrl: returnUrl,
      paymentProvider,
      paymentType: paymentProvider,
      plan,
      provider,
      returnUrl,
      typeSubscription: planDetails.typeSubscription,
    }),
  })

  const payload = (await response.json().catch(() => ({}))) as CreateSubscriptionPaymentResponse

  if (!response.ok) {
    throw new ApiError(response.status, payload, "Payment request failed", response)
  }

  const paymentUrl = payload.paymentUrl ?? payload.url

  if (!paymentUrl) {
    throw new Error("Payment URL is missing in the response")
  }

  return paymentUrl
}
