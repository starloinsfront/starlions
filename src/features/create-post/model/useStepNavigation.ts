import { useState, useCallback } from "react"

export type Step = "upload" | "cropping" | "filters" | "publication"

export const useStepNavigation = () => {
  const [step, setStep] = useState<Step>("upload")

  const goNext = useCallback(() => {
    setStep((prev) => (prev === "cropping" ? "filters" : "publication"))
  }, [])

  const goToCropping = useCallback(() => {
    setStep("cropping")
  }, [])

  const goToPublication = useCallback(() => {
    setStep("publication")
  }, [])

  const goBackToFilters = useCallback(() => {
    setStep("filters")
  }, [])

  const resetStep = useCallback(() => {
    setStep("upload")
  }, [])

  return {
    step,
    goNext,
    goToCropping,
    goToPublication,
    goBackToFilters,
    resetStep,
  }
}
