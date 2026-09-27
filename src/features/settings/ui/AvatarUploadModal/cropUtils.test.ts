import { afterEach, describe, expect, it, vi } from "vitest"

import { AVATAR_OUTPUT_SIZE, AVATAR_OUTPUT_TYPE } from "../../model/avatarFile"
import { renderCropToFile } from "./cropUtils"

const crop = { x: 10, y: 20, width: 640, height: 640 }

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("avatar crop output", () => {
  it("encodes every crop as a bounded square JPEG", async () => {
    const drawImage = vi.fn()
    const context = {
      drawImage,
      imageSmoothingEnabled: false,
      imageSmoothingQuality: "low",
    }
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => context),
      toBlob: vi.fn((callback: BlobCallback, type?: string) => {
        callback(new Blob(["avatar"], { type }))
      }),
    }
    vi.stubGlobal("document", { createElement: vi.fn(() => canvas) })

    const file = await renderCropToFile({} as HTMLImageElement, crop)

    expect(canvas.width).toBe(AVATAR_OUTPUT_SIZE)
    expect(canvas.height).toBe(AVATAR_OUTPUT_SIZE)
    expect(file.type).toBe(AVATAR_OUTPUT_TYPE)
    expect(drawImage).toHaveBeenCalledWith(
      expect.anything(),
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      AVATAR_OUTPUT_SIZE,
      AVATAR_OUTPUT_SIZE,
    )
  })

  it("rejects instead of silently succeeding when the browser cannot encode the crop", async () => {
    const canvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => ({ drawImage: vi.fn() })),
      toBlob: vi.fn((callback: BlobCallback) => callback(null)),
    }
    vi.stubGlobal("document", { createElement: vi.fn(() => canvas) })

    await expect(renderCropToFile({} as HTMLImageElement, crop)).rejects.toThrow(
      "Failed to encode the cropped avatar",
    )
  })
})
