import { useState, useCallback } from "react"

export type Step = "upload" | "cropping" | "filters" | "publication"

/**
 * Manages the multi-step navigation state for the create-post flow.
 */
export const useStepNavigation = () => {
  const [step, setStep] = useState<Step>("upload")

  const goBack = useCallback(() => {
    setStep("upload")
  }, [])

  const goNext = useCallback(() => {
    setStep((prev) => (prev === "cropping" ? "filters" : "publication"))
  }, [])

  const goToCropping = useCallback(() => {
    setStep("cropping")
  }, [])

  const goBackToCropping = useCallback(() => {
    setStep("cropping")
  }, [])

  const goBackToFilters = useCallback(() => {
    setStep("filters")
  }, [])

  const resetStep = useCallback(() => {
    setStep("upload")
  }, [])

  return {
    step,
    setStep,
    goBack,
    goNext,
    goToCropping,
    goBackToCropping,
    goBackToFilters,
    resetStep,
  }
}
