import { describe, expect, it } from "vitest"

import {
  AVATAR_OUTPUT_SIZE,
  getAvatarFileValidationError,
  MAX_AVATAR_FILE_SIZE,
} from "./avatarFile"

const makeFile = (type: string, size: number) =>
  new File([new Uint8Array(size)], "avatar", { type })

describe("avatar file validation", () => {
  it.each(["image/jpeg", "image/png"])("accepts a supported %s image", (type) => {
    expect(getAvatarFileValidationError(makeFile(type, 1024))).toBeNull()
  })

  it("accepts a file exactly at the size limit", () => {
    expect(getAvatarFileValidationError(makeFile("image/jpeg", MAX_AVATAR_FILE_SIZE))).toBeNull()
  })

  it("rejects unsupported image formats", () => {
    expect(getAvatarFileValidationError(makeFile("image/webp", 1024))).toBe(
      "The photo must have JPEG or PNG format",
    )
  })

  it("rejects files above the size limit", () => {
    expect(getAvatarFileValidationError(makeFile("image/png", MAX_AVATAR_FILE_SIZE + 1))).toBe(
      "The photo must be 10 MB or smaller",
    )
  })

  it("uses a bounded square output suitable for profile avatars", () => {
    expect(AVATAR_OUTPUT_SIZE).toBe(512)
  })
})
