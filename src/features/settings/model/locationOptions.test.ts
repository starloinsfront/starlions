import { describe, expect, it } from "vitest"

import { withSelectedOption } from "./locationOptions"

describe("withSelectedOption", () => {
  it("keeps the server value available while options are loading", () => {
    expect(withSelectedOption([], "BY", "BY")).toEqual([{ label: "BY", value: "BY" }])
  })

  it("does not replace a loaded option with the fallback label", () => {
    const options = [{ label: "Belarus", value: "BY" }]

    expect(withSelectedOption(options, "BY", "BY")).toBe(options)
  })

  it("adds the selected city when it is outside the first loaded page", () => {
    expect(withSelectedOption([], "15805", "Antopal’")).toEqual([
      { label: "Antopal’", value: "15805" },
    ])
  })
})
