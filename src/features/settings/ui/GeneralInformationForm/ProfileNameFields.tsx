"use client"

import type { UseFormRegister, FieldErrors } from "react-hook-form"
import { TextField } from "@/common/components/TextField/TextField"
import type { ProfileSettingsFormData } from "../../model/profile-settings.schema"
import s from "./GeneralInformationForm.module.css"

type Props = {
  register: UseFormRegister<ProfileSettingsFormData>
  errors: FieldErrors<ProfileSettingsFormData>
}

export const ProfileNameFields = ({ register, errors }: Props) => (
  <>
    <TextField
      label="Username"
      placeholder="Username"
      errorMessage={errors.username?.message}
      {...register("username")}
    />

    <div className={s.nameRow}>
      <TextField
        label="First Name"
        placeholder="First Name"
        errorMessage={errors.firstName?.message}
        {...register("firstName")}
      />
      <TextField
        label="Last Name"
        placeholder="Last Name"
        errorMessage={errors.lastName?.message}
        {...register("lastName")}
      />
    </div>
  </>
)
