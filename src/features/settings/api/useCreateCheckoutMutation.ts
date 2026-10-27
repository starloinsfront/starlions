import { useMutation } from "@tanstack/react-query"

import type { SchemaCreateCheckoutInputDto } from "@/common/api/schema"

import { createPaymentCheckout } from "./apiPayments"

export const useCreateCheckoutMutation = () => {
  return useMutation({
    mutationFn: (body: SchemaCreateCheckoutInputDto) => createPaymentCheckout(body),
  })
}
