import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"

import { TextArea } from "./TextArea"

describe("TextArea", () => {
  it("renders the current and maximum character count", () => {
    const markup = renderToStaticMarkup(
      createElement(TextArea, {
        maxLength: 200,
        readOnly: true,
        showCharacterCount: true,
        value: "Hello",
      }),
    )

    expect(markup).toContain("5/200")
  })

  it("does not render the character count unless it is requested", () => {
    const markup = renderToStaticMarkup(
      createElement(TextArea, { maxLength: 200, readOnly: true, value: "Hello" }),
    )

    expect(markup).not.toContain("5/200")
  })
})
