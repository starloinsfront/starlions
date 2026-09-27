import { afterEach, describe, expect, it, vi } from "vitest"

import { fetchWithRetry } from "./fetchWithRetry"

describe("fetchWithRetry", () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("retries a safe request after a transient response", async () => {
    vi.useFakeTimers()
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response("ok", { status: 200 }))
    vi.stubGlobal("fetch", fetchMock)

    const responsePromise = fetchWithRetry("https://example.com/profile")
    await vi.advanceTimersByTimeAsync(250)
    const response = await responsePromise

    expect(response.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it("makes up to three attempts for a safe request", async () => {
    vi.useFakeTimers()
    const fetchMock = vi.fn<typeof fetch>().mockRejectedValue(new TypeError("fetch failed"))
    vi.stubGlobal("fetch", fetchMock)
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)

    const responsePromise = fetchWithRetry("https://example.com/profile")
    const rejection = expect(responsePromise).rejects.toThrow("fetch failed")
    await vi.advanceTimersByTimeAsync(1000)

    await rejection
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(consoleError).toHaveBeenCalledOnce()
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
