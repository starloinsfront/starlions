import { describe, expect, it } from "vitest"

import { getSafeSettingsReturnTo } from "./legalReturnTo"

describe("getSafeSettingsReturnTo", () => {
  it("accepts a profile settings path", () => {
    expect(getSafeSettingsReturnTo("/profile/user-123/settings")).toBe("/profile/user-123/settings")
  })

  it("rejects external and protocol-relative URLs", () => {
    expect(getSafeSettingsReturnTo("https://example.com/profile/user/settings")).toBeNull()
    expect(getSafeSettingsReturnTo("//example.com/profile/user/settings")).toBeNull()
  })

  it("rejects unrelated internal paths and query suffixes", () => {
    expect(getSafeSettingsReturnTo("/profile/user-123")).toBeNull()
    expect(getSafeSettingsReturnTo("/profile/user-123/settings?next=/admin")).toBeNull()
  })
})
