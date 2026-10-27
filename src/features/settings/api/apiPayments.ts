import { client } from "@/common/api/client"
import type {
  SchemaCheckoutStatusOutputDto,
  SchemaCreateCheckoutInputDto,
  SchemaCreateCheckoutOutputDto,
  SchemaPlansOutputDto,
} from "@/common/api/schema"
import { handleApiResponse } from "@/common/utils/api/error/handleApiResponse"
import { isApiErrorMatching } from "@/common/utils/api/error/serverError"
import { apiAuth, getAuthHeaders } from "@/features/auth/api/apiAuth"

export const CHECKOUT_SESSION_STORAGE_KEY = "starlions:checkoutSessionId"

export type PaymentProvider = "paypal" | "stripe"

export const PAYMENT_PROVIDER_API: Record<
  PaymentProvider,
  SchemaCreateCheckoutInputDto["provider"]
> = {
  paypal: "PAYPAL",
  stripe: "STRIPE",
}

const requestPaymentPlans = async (): Promise<SchemaPlansOutputDto> => {
  const result = await client.GET("/api/v1/payments/plans", {
    headers: getAuthHeaders(),
  })

  return handleApiResponse(result, "Failed to load subscription plans") as SchemaPlansOutputDto
}

export const fetchPaymentPlans = async (): Promise<SchemaPlansOutputDto> => {
  try {
    return await requestPaymentPlans()
  } catch (error) {
    if (!isApiErrorMatching(error, { status: 401 })) {
      throw error
    }

    await apiAuth.refreshToken()

    return await requestPaymentPlans()
  }
}

export const createPaymentCheckout = async (
  body: SchemaCreateCheckoutInputDto,
): Promise<SchemaCreateCheckoutOutputDto> => {
  const result = await client.POST("/api/v1/payments/checkout", {
    body,
    headers: getAuthHeaders(),
  })

  return handleApiResponse(result, "Failed to start payment checkout") as SchemaCreateCheckoutOutputDto
}

export const fetchCheckoutStatus = async (
  checkoutSessionId: string,
): Promise<SchemaCheckoutStatusOutputDto> => {
  const result = await client.GET("/api/v1/payments/checkout/{id}", {
    headers: getAuthHeaders(),
    params: {
      path: { id: checkoutSessionId },
    },
  })

  return handleApiResponse(
    result,
    "Failed to load checkout status",
  ) as SchemaCheckoutStatusOutputDto
}

const CHECKOUT_POLL_INTERVAL_MS = 2000
const CHECKOUT_POLL_MAX_ATTEMPTS = 15

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export type CheckoutPollResult = "COMPLETED" | "EXPIRED" | "PENDING"

export const pollCheckoutUntilSettled = async (
  checkoutSessionId: string,
): Promise<CheckoutPollResult> => {
  for (let attempt = 0; attempt < CHECKOUT_POLL_MAX_ATTEMPTS; attempt += 1) {
    const status = await fetchCheckoutStatus(checkoutSessionId)

    if (status?.status === "COMPLETED") {
      return "COMPLETED"
    }

    if (status?.status === "EXPIRED") {
      return "EXPIRED"
    }

    if (attempt < CHECKOUT_POLL_MAX_ATTEMPTS - 1) {
      await wait(CHECKOUT_POLL_INTERVAL_MS)
    }
  }

  return "PENDING"
}
