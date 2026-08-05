"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  profileSettingsSchema,
  type ProfileSettingsFormData,
} from "../../model/profile-settings.schema"
import { useUpdateProfileMutation } from "../../api/useUpdateProfileMutation"
import { useProfileSettingsQuery } from "../../api/useProfileSettingsQuery"
import { useMe } from "@/features/auth/api/useMe"

const STORAGE_KEY = "profile-settings-draft"

export const useProfileForm = () => {
  const { data: me } = useMe()
  const { data: profileSettings, isPending: isLoading } = useProfileSettingsQuery()
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfileMutation()

  const form = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
    mode: "onChange",
    defaultValues: {
      avatarUrl: null,
      username: "",
      firstName: "",
      lastName: "",
      dateOfBirth: null,
      country: null,
      city: null,
      aboutMe: "",
    },
  })

  const { setValue, getValues } = form

  // Pre-fill form once profile data loads
  useEffect(() => {
    if (!profileSettings) return

    setValue("username", profileSettings.username || me?.username || "")
    setValue("firstName", profileSettings.firstName)
    setValue("lastName", profileSettings.lastName)
    setValue("dateOfBirth", profileSettings.dateOfBirth)
    setValue("country", profileSettings.country)
    setValue("city", profileSettings.city)
    setValue("aboutMe", profileSettings.aboutMe)
    if (profileSettings.avatarUrl) {
      setValue("avatarUrl", profileSettings.avatarUrl)
    }
  }, [profileSettings, me?.username, setValue])

  // Restore draft from sessionStorage (e.g. after visiting Privacy Policy)
  useEffect(() => {
    const draft = sessionStorage.getItem(STORAGE_KEY)
    if (draft) {
      try {
        const parsed = JSON.parse(draft) as Record<string, unknown>
        for (const [key, val] of Object.entries(parsed)) {
          if (val !== undefined) {
            setValue(key as keyof ProfileSettingsFormData, val as never)
          }
        }
      } catch {
        // ignore corrupt data
      }
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [setValue])

  // Save draft before unmount (preserves data when navigating to Privacy Policy)
  useEffect(() => {
    return () => {
      const values = getValues()
      const hasData = Object.values(values).some(
        (v) => v !== null && v !== "" && v !== undefined,
      )
      if (hasData) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(values))
      }
    }
  }, [getValues])

  const onSubmit = (data: ProfileSettingsFormData) => {
    updateProfile(data)
  }

  return {
    form,
    isLoading,
    isSaving,
    onSubmit,
    avatarUrl: profileSettings?.avatarUrl ?? null,
  }
}
