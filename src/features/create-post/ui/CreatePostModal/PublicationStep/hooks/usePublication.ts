import { useState, useCallback } from "react"

const MAX_DESCRIPTION_LENGTH = 500

export const usePublication = () => {
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (value.length <= MAX_DESCRIPTION_LENGTH) {
        setDescription(value)
      }
    },
    [],
  )

  const handleLocationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocation(e.target.value)
    },
    [],
  )

  const selectLocation = useCallback((value: string) => {
    setLocation(value)
  }, [])

  const resetPublication = useCallback(() => {
    setDescription("")
    setLocation("")
  }, [])

  return {
    description,
    location,
    maxDescriptionLength: MAX_DESCRIPTION_LENGTH,
    handleDescriptionChange,
    handleLocationChange,
    selectLocation,
    resetPublication,
  }
}
