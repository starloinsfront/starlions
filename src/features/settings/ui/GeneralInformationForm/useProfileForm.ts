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
  const initializedUserIdRef = useRef<string | null>(null)

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

  useEffect(() => {
    if (!profileSettings || !me?.id || initializedUserIdRef.current === profileSettings.userId) {
      return
    }

    const serverValues: ProfileSettingsFormData = {
      avatarUrl: profileSettings.avatarUrl,
      username: profileSettings.username || me.username || "",
      firstName: profileSettings.firstName ?? "",
      lastName: profileSettings.lastName ?? "",
      dateOfBirth: profileSettings.dateOfBirth,
      countryCode: profileSettings.countryCode,
      cityId: profileSettings.cityId,
      aboutMe: profileSettings.aboutMe ?? "",
    }
    const draft = readDraft(getDraftKey(me.id))

    reset({ ...serverValues, ...draft })
    initializedUserIdRef.current = profileSettings.userId
  }, [me?.id, me?.username, profileSettings, reset])

  const preserveDraft = () => {
    if (!me?.id) {
      return
    }

    sessionStorage.setItem(getDraftKey(me.id), JSON.stringify(getValues()))
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
        if (me?.id) {
          sessionStorage.removeItem(getDraftKey(me.id))
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
    refetch,
  }
}
