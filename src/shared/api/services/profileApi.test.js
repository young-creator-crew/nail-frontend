import { describe, expect, it, vi } from "vitest"
import { api } from "../apiClient"
import { getAdminDashboard, getProfile, updateProfile } from "./profileApi"

describe("profile API", () => {
  it("loads and updates a profile by user id", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValue({})
    const putSpy = vi.spyOn(api, "put").mockResolvedValue({})

    await getProfile(7)
    await updateProfile(7, { name: "Ana", email: "ana@email.com" })

    expect(getSpy).toHaveBeenCalledWith("/users/7", {})
    expect(putSpy).toHaveBeenCalledWith("/users/7", { name: "Ana", email: "ana@email.com" }, {})
  })

  it("loads the administrative dashboard with the selected period", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValue({})

    await getAdminDashboard({ params: { startDate: "2026-10-10", endDate: "2026-10-24" } })

    expect(getSpy).toHaveBeenCalledWith("/dashboard/summary", {
      params: { startDate: "2026-10-10", endDate: "2026-10-24" },
    })
  })
})
