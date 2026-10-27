"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/common/components/Button/Button"
import { getApiErrorMessage } from "@/common/utils/api/error/getApiErrorMessage"
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/common/utils/toast/showToast"
import {
  CHECKOUT_SESSION_STORAGE_KEY,
  PAYMENT_PROVIDER_API,
  pollCheckoutUntilSettled,
  type PaymentProvider,
} from "../../api/apiPayments"
import { useCreateCheckoutMutation } from "../../api/useCreateCheckoutMutation"
import { usePaymentPlansQuery } from "../../api/usePaymentPlansQuery"
import { buildSettingsSearchParams } from "../../model/buildSettingsSearchParams"
import { formatPlanLabel } from "../../model/formatPlanLabel"
import {
  parseSettingsAccountType,
  SETTINGS_ACCOUNT_TYPE_QUERY_KEY,
  type SettingsAccountType,
} from "../../model/settingsSearchParams"
import { PaymentAutoRenewalModal } from "./PaymentAutoRenewalModal"
import { SettingsRadioOption } from "./SettingsRadioOption"
import s from "./AccountManagementForm.module.css"

const ACCOUNT_TYPES = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
] as const

export const AccountManagementForm = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const accountTypeFromUrl = parseSettingsAccountType(
    searchParams.get(SETTINGS_ACCOUNT_TYPE_QUERY_KEY),
  )
  const [pendingAccountType, setPendingAccountType] = useState<SettingsAccountType | null>(null)
  const accountType = pendingAccountType ?? accountTypeFromUrl

  useEffect(() => {
    if (pendingAccountType !== null && pendingAccountType === accountTypeFromUrl) {
      setPendingAccountType(null)
    }
  }, [accountTypeFromUrl, pendingAccountType])

  const {
    data: plansData,
    error: plansError,
    isError: isPlansError,
    isFetching: isPlansFetching,
    isLoading: isPlansLoading,
    refetch: refetchPlans,
  } = usePaymentPlansQuery(accountType === "business")
  const plans = plansData?.items ?? []

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [isAutoRenewalModalOpen, setIsAutoRenewalModalOpen] = useState(false)
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider | null>(null)
  const [isPaymentRedirecting, setIsPaymentRedirecting] = useState(false)

  const createCheckoutMutation = useCreateCheckoutMutation()

  useEffect(() => {
    if (selectedPlanId || plans.length === 0) {
      return
    }

    setSelectedPlanId(plans[0].id)
  }, [plans, selectedPlanId])

  useEffect(() => {
    const checkoutSessionId = sessionStorage.getItem(CHECKOUT_SESSION_STORAGE_KEY)

    if (!checkoutSessionId) {
      return
    }

    sessionStorage.removeItem(CHECKOUT_SESSION_STORAGE_KEY)

    void (async () => {
      try {
        const result = await pollCheckoutUntilSettled(checkoutSessionId)

        if (result === "COMPLETED") {
          showSuccessToast("Payment was successful!")
          return
        }

        if (result === "EXPIRED") {
          showErrorToast("Transaction failed")
          return
        }

        showInfoToast("The payment is being processed.")
      } catch (error) {
        showErrorToast(getApiErrorMessage(error))
      }
    })()
  }, [])

  const openPaymentModal = (provider: PaymentProvider) => {
    setPaymentProvider(provider)
    setIsAutoRenewalModalOpen(true)
  }

  const dismissPaymentModal = () => {
    if (isPaymentRedirecting) {
      return
    }

    setIsAutoRenewalModalOpen(false)
    setPaymentProvider(null)
  }

  const confirmPayment = async () => {
    if (!paymentProvider || !selectedPlanId) {
      return
    }

    setIsPaymentRedirecting(true)

    try {
      const checkout = await createCheckoutMutation.mutateAsync({
        planId: selectedPlanId,
        provider: PAYMENT_PROVIDER_API[paymentProvider],
      })

      sessionStorage.setItem(CHECKOUT_SESSION_STORAGE_KEY, checkout.checkoutSessionId)
      window.location.assign(checkout.redirectUrl)
    } catch (error) {
      setIsPaymentRedirecting(false)
      showErrorToast(getApiErrorMessage(error))
    }
  }

  const setAccountType = (value: SettingsAccountType) => {
    setPendingAccountType(value)

    const next = buildSettingsSearchParams({
      accountType: value,
      current: searchParams,
      tab: "Account Management",
    })
    const query = next.toString()

    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const plansErrorMessage = plansError ? getApiErrorMessage(plansError) : null
  const plansErrorText = Array.isArray(plansErrorMessage)
    ? plansErrorMessage.join(" ")
    : plansErrorMessage

  const isPaymentDisabled =
    isPaymentRedirecting || isPlansLoading || !selectedPlanId || plans.length === 0

  return (
    <div className={s.form}>
      <section aria-labelledby="account-type-heading" className={s.section}>
        <h2 className={s.sectionTitle} id="account-type-heading">
          Account type:
        </h2>
        <div className={s.panel} role="radiogroup" aria-labelledby="account-type-heading">
          {ACCOUNT_TYPES.map((option) => (
            <SettingsRadioOption
              checked={accountType === option.value}
              key={option.value}
              label={option.label}
              name="accountType"
              onChange={() => setAccountType(option.value)}
              value={option.value}
            />
          ))}
        </div>
      </section>

      {accountType === "business" ? (
        <section aria-labelledby="subscription-costs-heading" className={s.section}>
          <h2 className={s.sectionTitle} id="subscription-costs-heading">
            Your subscription costs:
          </h2>
          <div
            className={s.panel}
            role="radiogroup"
            aria-labelledby="subscription-costs-heading"
          >
            {isPlansLoading ? (
              <p className={s.planStatus}>Loading plans…</p>
            ) : null}
            {isPlansError ? (
              <div className={s.planError}>
                <p className={s.planStatus}>
                  {plansErrorText || "Could not load subscription plans."}
                </p>
                <Button
                  disabled={isPlansFetching}
                  onClick={() => void refetchPlans()}
                  type="button"
                  variant="secondary"
                >
                  Try again
                </Button>
              </div>
            ) : null}
            {!isPlansLoading && !isPlansError
              ? plans.map((plan) => (
                  <SettingsRadioOption
                    checked={selectedPlanId === plan.id}
                    key={plan.id}
                    label={formatPlanLabel(plan)}
                    name="subscriptionPlan"
                    onChange={() => setSelectedPlanId(plan.id)}
                    value={plan.id}
                  />
                ))
              : null}
          </div>

          <div className={s.payments}>
            <button
              aria-label="Pay with PayPal"
              className={s.paymentProviderButton}
              disabled={isPaymentDisabled}
              onClick={() => openPaymentModal("paypal")}
              type="button"
            >
              <img
                alt=""
                className={s.paymentProviderImage}
                height={64}
                src="/images/settings/paypal-payment.svg"
                width={96}
              />
            </button>
            <span className={s.paymentsDivider}>Or</span>
            <button
              aria-label="Pay with Stripe"
              className={s.paymentProviderButton}
              disabled={isPaymentDisabled}
              onClick={() => openPaymentModal("stripe")}
              type="button"
            >
              <img
                alt=""
                className={s.paymentProviderImage}
                height={64}
                src="/images/settings/stripe-payment.svg"
                width={96}
              />
            </button>
          </div>
        </section>
      ) : null}

      <PaymentAutoRenewalModal
        isConfirming={isPaymentRedirecting}
        isOpen={isAutoRenewalModalOpen}
        onClose={dismissPaymentModal}
        onConfirm={confirmPayment}
      />
    </div>
  )
}
