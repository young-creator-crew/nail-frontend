import { describe, expect, it, vi } from "vitest"
import { api } from "../apiClient"
import { getAdminAppointments, getAdminDashboard, updateClientProfile } from "./profileApi"

describe("profile API", () => {
  it("updates the current profile through the generic client", async () => {
    const putSpy = vi.spyOn(api, "put").mockResolvedValue({})

    await updateClientProfile({ name: "Ana" })

    expect(putSpy).toHaveBeenCalledWith("/users/me", { name: "Ana" }, {})
  })

  it("adds the selected date to admin appointment requests", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValue([])

    await getAdminAppointments("2026-10-23", { params: { status: "open" } })

    expect(getSpy).toHaveBeenCalledWith("/appointments/admin", {
      params: { status: "open", date: "2026-10-23" },
    })
  })

  it("loads the administrative dashboard with the selected period", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValue({})

    await getAdminDashboard({ params: { startDate: "2026-10-10", endDate: "2026-10-24" } })

    expect(getSpy).toHaveBeenCalledWith("/dashboard", {
      params: { startDate: "2026-10-10", endDate: "2026-10-24" },
    })
  })
})
