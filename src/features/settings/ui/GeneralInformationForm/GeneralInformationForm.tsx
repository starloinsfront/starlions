"use client"

import { Controller, type Control, type SubmitHandler } from "react-hook-form"

import { Button } from "@/common/components/Button/Button"
import { TextArea } from "@/common/components/TextArea/TextArea"
import { ConfirmationModal } from "@/common/components/ConfirmationModal/ConfirmationModal"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"

import { AvatarDisplay } from "../AvatarDisplay"
import { DateOfBirthField } from "../DateOfBirthField"
import { AgeRestrictionNotice } from "../AgeRestrictionNotice"
import { ProfileNameFields } from "./ProfileNameFields"
import { ProfileLocationFields } from "./ProfileLocationFields"
import { useProfileForm } from "./useProfileForm"
import { useProfileAvatar } from "./useProfileAvatar"

import s from "./GeneralInformationForm.module.css"

export const GeneralInformationForm = () => {
  const { form, isLoading, isSaving, onSubmit, avatarUrl } = useProfileForm()
  const { register, watch, setValue, formState } = form
  const { errors, isValid } = formState

  const control = form.control as unknown as Control<ProfileSettingsFormData>
  const handleSubmit = form.handleSubmit as unknown as (
    fn: SubmitHandler<ProfileSettingsFormData>,
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>

  const {
    displayAvatarUrl,
    isUploading,
    avatarUploadModal,
    openUploadModal,
    requestDelete,
    deleteConfirmProps,
  } = useProfileAvatar({ setValueAction: setValue, watch, initialAvatarUrl: avatarUrl })

  const selectedCountryCode = watch("countryCode")
  const selectedCityId = watch("cityId")
  const dateOfBirth = watch("dateOfBirth")

  if (isLoading) {
    return <p className={s.loading}>Loading...</p>
  }

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <AvatarDisplay
        avatarUrl={displayAvatarUrl}
        username={watch("username")}
        onSelectPhoto={openUploadModal}
        onDelete={requestDelete}
      />

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
        selectedCountryCode={selectedCountryCode}
        selectedCityId={selectedCityId}
        onCountryChange={(val) => {
          setValue("countryCode", val)
          setValue("cityId", null, { shouldValidate: true })
        }}
        onCityChange={(val) => {
          setValue("cityId", val, { shouldValidate: true })
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
        disabled={!isValid || isSaving || isUploading}
        isLoading={isSaving}
      >
        Save changes
      </Button>

      {avatarUploadModal}

      <ConfirmationModal
        title="Delete photo"
        message="Do you really want to delete your profile photo?"
        discardBtnText="Yes"
        confirmBtnText="No"
        {...deleteConfirmProps}
      />
    </form>
  )
}
