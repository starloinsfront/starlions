import type { SchemaPlanOutputDto } from "@/common/api/schema"

const formatMoney = (priceAmount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(priceAmount / 100)
}

export const formatPlanLabel = (plan: SchemaPlanOutputDto): string => {
  const price = formatMoney(plan.priceAmount, plan.currency)

  if (plan.intervalUnit === "DAY") {
    const days = plan.intervalCount

    return `${price} per ${days} Day${days === 1 ? "" : "s"}`
  }

  const months = plan.intervalCount

  return `${price} per ${months} month${months === 1 ? "" : "s"}`
}
