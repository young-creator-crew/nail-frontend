import { describe, expect, it } from "vitest"
import { getDemoDashboard } from "../../entities/dashboard/model/demo-dashboard"
import { getDashboardMetrics, normalizeDashboardData } from "../../entities/dashboard/model/dashboard"

const response = {
  adminName: "Juliana Silva",
  cancelled: 6,
  previousCancelled: 8,
  completed: 111,
  averageTicket: 75,
  daily: [
    { date: "2026-10-18", created: 8, completed: 6 },
    { date: "2026-10-19", created: 11, completed: 9 },
    { date: "2026-10-20", created: 9, completed: 8 },
    { date: "2026-10-21", created: 14, completed: 12 },
    { date: "2026-10-22", created: 10, completed: 9 },
    { date: "2026-10-23", created: 8, completed: 7 },
    { date: "2026-10-24", created: 12, completed: 10 },
  ],
}

describe("admin dashboard", () => {
  it("normalizes the API response and calculates the cancellation variation", () => {
    const data = normalizeDashboardData(response)
    const metrics = getDashboardMetrics(data, 7)

    expect(data.adminName).toBe("Juliana Silva")
    expect(metrics.cancellationChange).toBe(-25)
    expect(metrics.createdTotal).toBe(72)
    expect(metrics.completedTotal).toBe(61)
    expect(metrics.busiest.created).toBe(14)
  })

  it("uses the last seven days for the mobile chart", () => {
    const data = normalizeDashboardData({
      ...response,
      daily: [
        { date: "2026-10-10", created: 1, completed: 1 },
        ...response.daily,
      ],
    })

    expect(getDashboardMetrics(data, 7).daily).toHaveLength(7)
    expect(getDashboardMetrics(data, 7).daily[0].created).toBe(8)
  })

  it("rejects incomplete API payloads", () => {
    expect(() => normalizeDashboardData({ daily: [] })).toThrow("indicadores inválidos")
    expect(() => normalizeDashboardData({ ...response, cancelled: "invalido" })).toThrow("indicadores inválidos")
  })

  it("generates a complete demo payload for the selected period", () => {
    const data = normalizeDashboardData(getDemoDashboard({ endDate: "2026-10-24" }))

    expect(data.daily).toHaveLength(15)
    expect(data.daily[0].date.toISOString().slice(0, 10)).toBe("2026-10-10")
    expect(data.daily.at(-1).date.toISOString().slice(0, 10)).toBe("2026-10-24")
    expect(data.cancelled).toBe(6)
    expect(data.averageTicket).toBe(75)
  })
})
