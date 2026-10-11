"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { getApiErrorMessage } from "@/common/utils/api/error/getApiErrorMessage"
import { showErrorToast } from "@/common/utils/toast/showToast"
import {
  createSubscriptionPayment,
  type PaymentProvider,
} from "../../api/apiPayments"
import { buildSettingsSearchParams } from "../../model/buildSettingsSearchParams"
import {
  parseSettingsAccountType,
  SETTINGS_ACCOUNT_TYPE_QUERY_KEY,
  type SettingsAccountType,
} from "../../model/settingsSearchParams"
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanId,
} from "../../model/subscriptionPlans"
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

  const accountType = parseSettingsAccountType(
    searchParams.get(SETTINGS_ACCOUNT_TYPE_QUERY_KEY),
  )
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlanId>("day")
  const [isAutoRenewalModalOpen, setIsAutoRenewalModalOpen] = useState(false)
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider | null>(null)
  const [isPaymentRedirecting, setIsPaymentRedirecting] = useState(false)

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
    if (!paymentProvider) {
      return
    }

    setIsPaymentRedirecting(true)

    try {
      const returnParams = buildSettingsSearchParams({
        accountType: "business",
        current: searchParams,
        tab: "Account Management",
      })
      const returnUrl = `${window.location.origin}${pathname}?${returnParams.toString()}`

      const paymentUrl = await createSubscriptionPayment({
        autoRenewal: true,
        plan: subscriptionPlan,
        provider: paymentProvider,
        returnUrl,
      })

      window.location.assign(paymentUrl)
    } catch (error) {
      setIsPaymentRedirecting(false)
      showErrorToast(getApiErrorMessage(error))
    }
  }

  const setAccountType = (value: SettingsAccountType) => {
    const next = buildSettingsSearchParams({
      accountType: value,
      current: searchParams,
      tab: "Account Management",
    })
    const query = next.toString()

    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

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
            {SUBSCRIPTION_PLANS.map((option) => (
              <SettingsRadioOption
                checked={subscriptionPlan === option.value}
                key={option.value}
                label={option.label}
                name="subscriptionPlan"
                onChange={() => setSubscriptionPlan(option.value)}
                value={option.value}
              />
            ))}
          </div>

          <div className={s.payments}>
            <button
              aria-label="Pay with PayPal"
              className={s.paymentProviderButton}
              disabled={isPaymentRedirecting}
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
              disabled={isPaymentRedirecting}
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
