import { afterEach, describe, expect, it, vi } from "vitest"

import { fetchWithRetry } from "./fetchWithRetry"

describe("fetchWithRetry", () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("retries a safe request once after a transient response", async () => {
    vi.useFakeTimers()
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)

    const responsePromise = fetchWithRetry("https://example.com/profile")
    await vi.advanceTimersByTimeAsync(200)
    const response = await responsePromise

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("does not retry a mutation", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 503 }))
    vi.stubGlobal("fetch", fetchMock)

    const response = await fetchWithRetry("https://example.com/profile", {
      method: "POST",
    })

    expect(response.status).toBe(503)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
