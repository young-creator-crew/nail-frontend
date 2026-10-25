import { api } from "../../../shared/api/apiClient"
import { API_ENDPOINTS } from "../../../shared/api/endpoints"

export function getClientAppointments(config = {}) {
  return api.get(API_ENDPOINTS.clientAppointments, config)
}

export function getAdminAppointments(date, config = {}) {
  return api.get(API_ENDPOINTS.adminAppointments, {
    ...config,
    params: { ...config.params, date },
  })
}
