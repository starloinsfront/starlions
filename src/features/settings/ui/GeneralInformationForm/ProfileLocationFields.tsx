"use client"

import { useDeferredValue, useState } from "react"
import type { Control, FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import { LocationSelect } from "../LocationSelect"
import { useCountriesQuery } from "../../api/useCountriesQuery"
import { useCitiesQuery } from "../../api/useCitiesQuery"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"
import s from "./GeneralInformationForm.module.css"

type Props = {
  control: Control<ProfileSettingsFormData>
  errors: FieldErrors<ProfileSettingsFormData>
  selectedCountryCode: string | null | undefined
  onCountryChange: (val: string | null) => void
  onCityChange: (val: number | null) => void
  selectedCityId: number | null | undefined
}

export const ProfileLocationFields = ({
  control,
  errors,
  selectedCountryCode,
  onCountryChange,
  onCityChange,
  selectedCityId,
}: Props) => {
  const [citySearch, setCitySearch] = useState("")
  const deferredCitySearch = useDeferredValue(citySearch.trim())
  const {
    data: countries = [],
    isError: isCountriesError,
    isFetching: isCountriesLoading,
    refetch: refetchCountries,
  } = useCountriesQuery()
  const {
    data: cities = [],
    isError: isCitiesError,
    isFetching: isCitiesLoading,
    refetch: refetchCities,
  } = useCitiesQuery(selectedCountryCode, deferredCitySearch)

  const countryItems = countries.map((c) => ({ id: c.code, name: c.name }))
  const cityItems = cities.map((c) => ({ id: c.id, name: c.name }))
  const handleCountryChange = (value: string | null) => {
    setCitySearch("")
    onCountryChange(value)
  }

  return (
    <>
      <Controller
        name="countryCode"
        control={control}
        render={({ field }) => (
          <LocationSelect
            label="Country"
            placeholder="Select country"
            items={countryItems}
            value={field.value}
            onChange={handleCountryChange}
            error={errors.countryCode?.message}
            isLoading={isCountriesLoading}
          />
        )}
      />

      {isCountriesError ? (
        <div className={s.inlineError} role="alert">
          <span>Failed to load countries.</span>
          <button onClick={() => void refetchCountries()} type="button">
            Try again
          </button>
        </div>
      ) : null}

      <Controller
        name="cityId"
        control={control}
        render={() => (
          <LocationSelect<number>
            label="City"
            placeholder="Select city"
            items={cityItems}
            value={selectedCityId}
            onChange={onCityChange}
            onSearchChange={setCitySearch}
            disabled={!selectedCountryCode}
            error={errors.cityId?.message}
            isLoading={isCitiesLoading}
          />
        )}
      />

      {isCitiesError ? (
        <div className={s.inlineError} role="alert">
          <span>Failed to load cities.</span>
          <button onClick={() => void refetchCities()} type="button">
            Try again
          </button>
        </div>
      ) : null}
    </>
  )
}
