import { api } from "../apiClient"
import { API_ENDPOINTS } from "../endpoints"

export function registerUser(payload, config = {}) {
  return api.post(API_ENDPOINTS.register, payload, config)
}

export function loginUser(payload, config = {}) {
  return api.post(API_ENDPOINTS.login, payload, config)
}
