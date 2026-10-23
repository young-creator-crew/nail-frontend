import { beforeEach, describe, expect, it, vi } from "vitest"
import { api, apiClient, request } from "./apiClient"

describe("api client", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("returns only the response data for a generic request", async () => {
    vi.spyOn(apiClient, "request").mockResolvedValue({ data: { ok: true } })

    await expect(request("GET", "/health")).resolves.toEqual({ ok: true })
    expect(apiClient.request).toHaveBeenCalledWith({
      method: "GET",
      url: "/health",
    })
  })

  it("normalizes API errors", async () => {
    vi.spyOn(apiClient, "request").mockRejectedValue({
      response: { status: 422, data: { message: "Dados inválidos." } },
    })

    await expect(api.get("/users")).rejects.toMatchObject({
      message: "Dados inválidos.",
      status: 422,
    })
  })

  it("maps helper methods to the generic request", async () => {
    const requestSpy = vi.spyOn(apiClient, "request")
      .mockResolvedValue({ data: [] })

    await api.post("/procedures", { name: "Manicure" }, { headers: { "X-Test": "1" } })

    expect(requestSpy).toHaveBeenCalledWith({
      method: "POST",
      url: "/procedures",
      headers: { "X-Test": "1" },
      data: { name: "Manicure" },
    })
  })
})
