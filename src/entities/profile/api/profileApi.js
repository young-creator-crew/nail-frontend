import { api } from "../../../shared/api/apiClient"
import { API_ENDPOINTS } from "../../../shared/api/endpoints"

export function getClientProfile(config = {}) {
  return api.get(API_ENDPOINTS.clientProfile, config)
}

export function updateClientProfile(payload, config = {}) {
  return api.put(API_ENDPOINTS.updateClientProfile, payload, config)
}
