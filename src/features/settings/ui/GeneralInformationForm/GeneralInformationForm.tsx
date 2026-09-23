"use client"

import { Controller, type Control, type SubmitHandler } from "react-hook-form"
import { usePathname } from "next/navigation"

import { Button } from "@/common/components/Button/Button"
import { TextArea } from "@/common/components/TextArea/TextArea"
import { ConfirmationModal } from "@/common/components/ConfirmationModal/ConfirmationModal"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"

import { AvatarDisplay } from "../AvatarDisplay"
import { DateOfBirthField } from "../DateOfBirthField"
import { AgeRestrictionNotice } from "../AgeRestrictionNotice"
import { ProfileNameFields } from "./ProfileNameFields"
import { ProfileLocationFields } from "./ProfileLocationFields"
import { GeneralInformationSkeleton } from "./GeneralInformationSkeleton"
import { useProfileForm } from "./useProfileForm"
import { useProfileAvatar } from "./useProfileAvatar"

import s from "./GeneralInformationForm.module.css"

export const GeneralInformationForm = () => {
  const pathname = usePathname()
  const { form, isError, isLoading, isSaving, onSubmit, preserveDraft, profileSettings, refetch } =
    useProfileForm()
  const { register, watch, setValue, formState } = form
  const { errors, isValid } = formState

  const control = form.control as unknown as Control<ProfileSettingsFormData>
  const handleSubmit = form.handleSubmit as unknown as (
    fn: SubmitHandler<ProfileSettingsFormData>,
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>

  const {
    displayAvatarUrl,
    isAvatarBusy,
    avatarUploadModal,
    openUploadModal,
    requestDelete,
    deleteConfirmProps,
  } = useProfileAvatar({ setValueAction: setValue, watch })

  const dateOfBirth = watch("dateOfBirth")

  if (isLoading) {
    return <GeneralInformationSkeleton />
  }

  if (isError) {
    return (
      <div className={s.errorState} role="alert">
        <p>Failed to load profile settings.</p>
        <Button onClick={() => void refetch()} type="button" variant="secondary">
          Try again
        </Button>
      </div>
    )
  }

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={s.formBody}>
        <div className={s.avatarColumn}>
          <AvatarDisplay
            avatarUrl={displayAvatarUrl}
            username={watch("username")}
            onSelectPhoto={openUploadModal}
            onDelete={requestDelete}
            disabled={isAvatarBusy || isSaving}
          />
        </div>

        <div className={s.fieldsColumn}>
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

          <AgeRestrictionNotice
            dateOfBirth={dateOfBirth}
            onPrivacyPolicyClick={preserveDraft}
            returnTo={pathname}
          />

          <ProfileLocationFields
            control={control}
            errors={errors}
            initialCityName={profileSettings?.cityName}
            onCountryChange={(val) => {
              setValue("countryCode", val, { shouldDirty: true, shouldValidate: true })
              setValue("cityId", null, { shouldDirty: true, shouldValidate: true })
            }}
            onCityChange={(val) => {
              setValue("cityId", val, { shouldDirty: true, shouldValidate: true })
            }}
          />

          <Controller
            name="aboutMe"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                containerClassName={s.compactField}
                errorMessage={errors.aboutMe?.message}
                label="About Me"
                maxLength={200}
                placeholder="Tell us about yourself"
                showCharacterCount
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      </div>

      <div className={s.actions}>
        <Button
          className={s.saveButton}
          type="submit"
          disabled={!isValid || isSaving || isAvatarBusy}
          isLoading={isSaving}
        >
          Save Changes
        </Button>
      </div>

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
