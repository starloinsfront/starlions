"use client"

import type { Control, FieldErrors } from "react-hook-form"
import { Controller } from "react-hook-form"
import { LocationSelect } from "../LocationSelect"
import { COUNTRIES } from "../../model/countries"
import { CITIES } from "../../model/cities"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"

type Props = {
  control: Control<ProfileSettingsFormData>
  errors: FieldErrors<ProfileSettingsFormData>
  selectedCountryId: string | null | undefined
  onCountryChange: (val: string | null) => void
}

export const ProfileLocationFields = ({
  control,
  errors,
  selectedCountryId,
  onCountryChange,
}: Props) => (
  <>
    <Controller
      name="country"
      control={control}
      render={({ field }) => (
        <LocationSelect
          label="Country"
          placeholder="Select country"
          items={COUNTRIES}
          value={field.value}
          onChange={onCountryChange}
          error={errors.country?.message}
          allowFreeText
        />
      )}
    />

    <Controller
      name="city"
      control={control}
      render={({ field }) => (
        <LocationSelect
          label="City"
          placeholder="Select city"
          items={
            selectedCountryId
              ? CITIES.filter((c) => c.countryId === selectedCountryId)
              : CITIES
          }
          value={field.value}
          onChange={field.onChange}
          disabled={!selectedCountryId}
          error={errors.city?.message}
          allowFreeText
        />
      )}
    />
  </>
)
