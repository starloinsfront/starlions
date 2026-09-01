"use client"

import type { Control, FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import { LocationSelect } from "../LocationSelect"
import { useCountriesQuery } from "../../api/useCountriesQuery"
import { useCitiesQuery } from "../../api/useCitiesQuery"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"

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
  const { data: countries = [] } = useCountriesQuery()
  const { data: cities = [] } = useCitiesQuery(selectedCountryCode)

  const countryItems = countries.map((c) => ({ id: c.code, name: c.name }))
  const cityItems = cities.map((c) => ({ id: c.id, name: c.name }))

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
            onChange={onCountryChange}
            error={errors.countryCode?.message}
          />
        )}
      />

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
            disabled={!selectedCountryCode}
            error={errors.cityId?.message}
          />
        )}
      />
    </>
  )
}
