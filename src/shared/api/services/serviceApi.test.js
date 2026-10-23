import { describe, expect, it, vi } from "vitest"
import { api } from "../apiClient"
import {
  createService,
  deleteService,
  getServiceById,
  updateService,
  updateServiceImage,
} from "./serviceApi"

describe("service API", () => {
  it("creates a service using the configured collection endpoint", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValue({ id: "1" })
    const formData = new FormData()

    await createService(formData)

    expect(postSpy).toHaveBeenCalledWith("/procedures", formData, {
      headers: {},
    })
  })

  it("rejects operations without an identifier", async () => {
    await expect(getServiceById()).rejects.toThrow("identificador")
    await expect(updateService("", {})).rejects.toThrow("identificador")
    await expect(deleteService(null)).rejects.toThrow("identificador")
  })

  it("updates text data and image through their resource endpoints", async () => {
    const putSpy = vi.spyOn(api, "put").mockResolvedValue({})
    const image = new File(["image"], "service.png", { type: "image/png" })

    await updateService("7", { name: "Pedicure" })
    await updateServiceImage("7", image)

    expect(putSpy).toHaveBeenNthCalledWith(
      1,
      "/procedures/7",
      { name: "Pedicure" },
      {},
    )
    expect(putSpy.mock.calls[1][0]).toBe("/procedures/7/image")
    expect(putSpy.mock.calls[1][1]).toBeInstanceOf(FormData)
  })
})
