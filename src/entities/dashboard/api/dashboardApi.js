import { api } from "../../../shared/api/apiClient"
import { API_ENDPOINTS } from "../../../shared/api/endpoints"

function toDateString(date) {
  return date.toISOString().slice(0, 10)
}

function getDefaultPeriod() {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - 30)

  return {
    startDate: toDateString(startDate),
    endDate: toDateString(endDate),
  }
}

export function getAdminDashboard(config = {}) {
  const defaultPeriod = getDefaultPeriod()

  return api.get(API_ENDPOINTS.adminDashboard, {
    ...config,
    params: {
      startDate: config.params?.startDate ?? defaultPeriod.startDate,
      endDate: config.params?.endDate ?? defaultPeriod.endDate,
      ...config.params,
    },
  })
}
