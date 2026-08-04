"use client"

import { Controller, type Control, type SubmitHandler } from "react-hook-form"

import { Button } from "@/common/components/Button/Button"
import { TextArea } from "@/common/components/TextArea/TextArea"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"

import { AvatarDisplay } from "../AvatarDisplay"
import { DateOfBirthField } from "../DateOfBirthField"
import { AgeRestrictionNotice } from "../AgeRestrictionNotice"
import { ProfileNameFields } from "./ProfileNameFields"
import { ProfileLocationFields } from "./ProfileLocationFields"
import { useProfileForm } from "./useProfileForm"

import s from "./GeneralInformationForm.module.css"

export const GeneralInformationForm = () => {
  const { form, isLoading, isSaving, onSubmit, avatarUrl } = useProfileForm()
  const { register, watch, setValue, formState } = form
  const { errors, isValid } = formState

  const control = form.control as unknown as Control<ProfileSettingsFormData>
  const handleSubmit = form.handleSubmit as unknown as (
    fn: SubmitHandler<ProfileSettingsFormData>,
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>

  const selectedCountryId = watch("country")
  const dateOfBirth = watch("dateOfBirth")

  if (isLoading) {
    return <p className={s.loading}>Loading...</p>
  }

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <AvatarDisplay avatarUrl={avatarUrl} username={watch("username")} />

      <ProfileNameFields register={register} errors={errors} />

      <Controller
        name="dateOfBirth"
        control={control}
        render={({ field }) => (
          <DateOfBirthField
            value={field.value}
            onChange={field.onChange}
            error={errors.dateOfBirth?.message}
          />
        )}
      />

      <AgeRestrictionNotice dateOfBirth={dateOfBirth} />

      <ProfileLocationFields
        control={control}
        errors={errors}
        selectedCountryId={selectedCountryId}
        onCountryChange={(val) => {
          setValue("country", val)
          setValue("city", null, { shouldValidate: true })
        }}
      />

      <TextArea
        label="About Me"
        placeholder="Tell us about yourself"
        errorMessage={errors.aboutMe?.message}
        maxLength={200}
        {...register("aboutMe")}
      />

      <Button
        className={s.saveButton}
        type="submit"
        disabled={!isValid || isSaving}
        isLoading={isSaving}
      >
        Save changes
      </Button>
    </form>
  )
}
