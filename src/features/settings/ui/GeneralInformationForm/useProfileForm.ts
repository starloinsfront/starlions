"use client"

import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  profileSettingsSchema,
  type ProfileSettingsFormData,
} from "../../model/profile-settings.schema"
import { useUpdateProfileMutation } from "../../api/useUpdateProfileMutation"
import { useProfileSettingsQuery } from "../../api/useProfileSettingsQuery"
import { useMe } from "@/features/auth/api/useMe"
import type { SchemaUpdateProfileInputDto } from "@/common/api/schema"
import { normalizeDateOnly } from "../../model/dateOfBirth"
import { normalizeCityId, normalizeCountryCode } from "../../model/profileLocation"

const STORAGE_KEY = "profile-settings-draft"

const getDraftKey = (userId: string) => `${STORAGE_KEY}:${userId}`

const readDraft = (key: string): Partial<ProfileSettingsFormData> | null => {
  const draft = sessionStorage.getItem(key)

  if (!draft) {
    return null
  }

  try {
    return JSON.parse(draft) as Partial<ProfileSettingsFormData>
  } catch {
    return null
  } finally {
    sessionStorage.removeItem(key)
  }
}

export const useProfileForm = () => {
  const { data: me } = useMe()
  const {
    data: profileSettings,
    isError,
    isPending: isLoading,
    refetch,
  } = useProfileSettingsQuery()
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfileMutation()
  const hasRestoredDraftRef = useRef(false)
  const form = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
    mode: "onChange",
    defaultValues: {
      avatarUrl: null,
      username: "",
      firstName: "",
      lastName: "",
      dateOfBirth: null,
      countryCode: null,
      cityId: null,
      aboutMe: "",
    },
  })

  const { getValues, reset } = form
  const profileUserId = profileSettings?.userId ?? me?.id

  useEffect(() => {
    if (!profileSettings) {
      return
    }

    const serverValues: ProfileSettingsFormData = {
      avatarUrl: profileSettings.avatarUrl,
      username: profileSettings.username || me?.username || "",
      firstName: profileSettings.firstName ?? "",
      lastName: profileSettings.lastName ?? "",
      dateOfBirth: normalizeDateOnly(profileSettings.dateOfBirth),
      countryCode: normalizeCountryCode(profileSettings.countryCode),
      cityId: normalizeCityId(profileSettings.cityId),
      aboutMe: profileSettings.aboutMe ?? "",
    }
    const draft = hasRestoredDraftRef.current
      ? null
      : readDraft(getDraftKey(profileSettings.userId))
    const draftCountryCode = normalizeCountryCode(draft?.countryCode)
    const draftCityId = normalizeCityId(draft?.cityId)
    const restoredValues: ProfileSettingsFormData = draft
      ? {
          ...serverValues,
          ...draft,
          countryCode: draftCountryCode ?? serverValues.countryCode,
          cityId:
            draftCountryCode && draftCountryCode !== serverValues.countryCode
              ? draftCityId
              : (draftCityId ?? serverValues.cityId),
        }
      : serverValues

    hasRestoredDraftRef.current = true
    reset(restoredValues, { keepDirtyValues: true })
  }, [me?.username, profileSettings, reset])

  const preserveDraft = () => {
    if (!profileUserId) {
      return
    }

    sessionStorage.setItem(getDraftKey(profileUserId), JSON.stringify(getValues()))
  }

  const onSubmit = (data: ProfileSettingsFormData) => {
    const body: SchemaUpdateProfileInputDto = {
      username: data.username,
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      dateOfBirth: data.dateOfBirth ?? null,
      countryCode: data.countryCode ?? null,
      cityId: data.cityId ?? null,
      aboutMe: data.aboutMe ?? null,
    }
    updateProfile(body, {
      onSuccess: () => {
        if (profileUserId) {
          sessionStorage.removeItem(getDraftKey(profileUserId))
        }
      },
    })
  }

  return {
    form,
    isError,
    isLoading,
    isSaving,
    onSubmit,
    preserveDraft,
    profileSettings,
    refetch,
  }
}
