"use client"

import { useMemo } from "react"
import type { Control, FieldErrors } from "react-hook-form"
import { Controller, useWatch } from "react-hook-form"

import { Select } from "@/common/components/Select/CustomSelect"
import { useCountriesQuery } from "../../api/useCountriesQuery"
import { useCitiesQuery } from "../../api/useCitiesQuery"
import { withSelectedOption } from "../../model/locationOptions"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"
import s from "./GeneralInformationForm.module.css"

type Props = {
  control: Control<ProfileSettingsFormData>
  errors: FieldErrors<ProfileSettingsFormData>
  initialCityName: string | null | undefined
  onCountryChange: (val: string | null) => void
  onCityChange: (val: number | null) => void
}

export const ProfileLocationFields = ({
  control,
  errors,
  initialCityName,
  onCountryChange,
  onCityChange,
}: Props) => {
  const selectedCountryCode = useWatch({ control, name: "countryCode" })
  const selectedCityId = useWatch({ control, name: "cityId" })

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
  } = useCitiesQuery(selectedCountryCode)

  const countryOptions = useMemo(() => {
    const options = countries.map((country) => ({
      label: country.name,
      value: country.code,
    }))

    return withSelectedOption(options, selectedCountryCode, selectedCountryCode)
  }, [countries, selectedCountryCode])
  const cityOptions = useMemo(
    () =>
      withSelectedOption(
        cities.map((city) => ({ label: city.name, value: String(city.id) })),
        selectedCityId == null ? null : String(selectedCityId),
        initialCityName,
      ),
    [cities, initialCityName, selectedCityId],
  )
  return (
    <div className={s.locationRow}>
      <div className={s.locationField}>
        <Controller
          name="countryCode"
          control={control}
          render={({ field }) => {
            const selectedValue = field.value ?? ""
            const selectedLabel = selectedValue
              ? (countryOptions.find((option) => option.value === selectedValue)?.label ??
                selectedValue)
              : undefined

            return (
              <Select
                ariaLabel="Country"
                className={s.locationSelect}
                disabled={isCountriesLoading}
                error={errors.countryCode?.message}
                label="Select your country"
                name={field.name}
                onBlur={field.onBlur}
                onValueChange={(value) => {
                  if (!value || value === field.value) {
                    return
                  }

                  onCountryChange(value)
                }}
                options={countryOptions}
                placeholder={isCountriesLoading ? "Loading countries…" : "Country"}
                ref={field.ref}
                selectedLabel={selectedLabel}
                value={selectedValue}
              />
            )
          }}
        />

        {isCountriesError ? (
          <div className={s.inlineError} role="alert">
            <span>Failed to load countries.</span>
            <button onClick={() => void refetchCountries()} type="button">
              Try again
            </button>
          </div>
        ) : null}
      </div>

      <div className={s.locationField}>
        <Controller
          name="cityId"
          control={control}
          render={({ field }) => {
            const selectedValue = field.value == null ? "" : String(field.value)
            const selectedLabel = selectedValue
              ? (cityOptions.find((option) => option.value === selectedValue)?.label ??
                initialCityName ??
                selectedValue)
              : undefined

            return (
              <Select
                ariaLabel="City"
                className={s.locationSelect}
                disabled={!selectedCountryCode || isCitiesLoading}
                error={errors.cityId?.message}
                label="Select your city"
                name={field.name}
                onBlur={field.onBlur}
                onValueChange={(value) => {
                  if (!value) {
                    return
                  }

                  const cityId = Number(value)

                  if (!Number.isSafeInteger(cityId) || cityId === field.value) {
                    return
                  }

                  onCityChange(cityId)
                }}
                options={cityOptions}
                placeholder={isCitiesLoading ? "Loading cities…" : "City"}
                ref={field.ref}
                selectedLabel={selectedLabel}
                value={selectedValue}
              />
            )
          }}
        />

        {isCitiesError ? (
          <div className={s.inlineError} role="alert">
            <span>Failed to load cities.</span>
            <button onClick={() => void refetchCities()} type="button">
              Try again
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
