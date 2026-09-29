"use client"

import { useState } from "react"

import { Icon } from "@/common/components/Icon/Icon"

import { SettingsRadioOption } from "./SettingsRadioOption"
import s from "./AccountManagementForm.module.css"

const ACCOUNT_TYPES = [
  { value: "personal", label: "Personal" },
  { value: "business", label: "Business" },
] as const

const SUBSCRIPTION_PLANS = [
  { value: "day", label: "$10 per 1 Day" },
  { value: "week", label: "$50 per 7 Day" },
  { value: "month", label: "$100 per month" },
] as const

type AccountType = (typeof ACCOUNT_TYPES)[number]["value"]
type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number]["value"]

export const AccountManagementForm = () => {
  const [accountType, setAccountType] = useState<AccountType>("business")
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>("day")

  return (
    <div className={s.form}>
      <section aria-labelledby="account-type-heading" className={s.section}>
        <h2 className={s.sectionTitle} id="account-type-heading">
          Account type:
        </h2>
        <div className={`${s.panel} ${s.panelAccountType}`} role="radiogroup" aria-labelledby="account-type-heading">
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

      <section aria-labelledby="subscription-costs-heading" className={s.section}>
        <h2 className={s.sectionTitle} id="subscription-costs-heading">
          Your subscription costs:
        </h2>
        <div
          className={`${s.panel} ${s.panelSubscription}`}
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
            type="button"
          >
            <Icon className={s.paymentProviderIcon} height={16} name="paypalFilled" width={72} />
          </button>
          <span className={s.paymentsDivider}>Or</span>
          <button
            aria-label="Pay with Stripe"
            className={s.paymentProviderButton}
            type="button"
          >
            <Icon className={s.paymentProviderIcon} height={16} name="stripeFilled" width={72} />
          </button>
        </div>
      </section>
    </div>
  )
}
