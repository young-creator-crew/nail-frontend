import { describe, expect, it, vi } from "vitest"
import { api } from "../apiClient"
import {
  createService,
  deactivateService,
  getServiceById,
  updateService,
} from "./serviceApi"

describe("service API", () => {
  it("creates a service using the configured collection endpoint", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({ id: "1" })
    const service = {
      serviceName: "Manicure",
      serviceDescription: null,
      options: [{ optionType: "APLICACAO", price: 80, durationMinutes: 60 }],
      addons: [],
    }

    await createService(service)

    expect(postSpy).toHaveBeenCalledWith("/services", expect.any(FormData), {
      headers: {},
    })
  })

  it("rejects operations without an identifier", async () => {
    await expect(getServiceById()).rejects.toThrow("identificador")
    await expect(updateService("", {})).rejects.toThrow("identificador")
    await expect(deactivateService(null)).rejects.toThrow("identificador")
  })

  it("updates text data and image through their resource endpoints", async () => {
    const putSpy = vi.spyOn(api, "put").mockResolvedValue({})
    const requestSpy = vi.spyOn(api, "request").mockResolvedValue({})
    await updateService("7", { serviceName: "Pedicure", options: [], addons: [] })
    await deactivateService("7")

    expect(putSpy).toHaveBeenCalledWith(
      "/services/7",
      expect.any(FormData),
      { headers: {} },
    )
    expect(putSpy).toHaveBeenCalledTimes(1)
    expect(requestSpy).toHaveBeenCalledWith("PATCH", "/services/7/deactivate", {
      headers: {},
    })
  })
})
