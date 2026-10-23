import { api } from "../apiClient"
import { API_ENDPOINTS } from "../endpoints"

export function getClientProfile(config = {}) {
  return api.get(API_ENDPOINTS.clientProfile, config)
}

export function updateClientProfile(payload, config = {}) {
  return api.put(API_ENDPOINTS.updateClientProfile, payload, config)
}

export function getClientAppointments(config = {}) {
  return api.get(API_ENDPOINTS.clientAppointments, config)
}

export function getAdminAppointments(date, config = {}) {
  return api.get(API_ENDPOINTS.adminAppointments, {
    ...config,
    params: { ...config.params, date },
  })
}
