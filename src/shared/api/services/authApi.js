import { apiClient } from "../apiClient"
import { API_ENDPOINTS } from "../endpoints"

export async function registerUser(payload, config = {}) {
  if (!API_ENDPOINTS.register) {
    throw new Error("O endpoint de cadastro ainda não foi configurado.")
  }

  const response = await apiClient.post(API_ENDPOINTS.register, payload, config)
  return response.data
}

export async function loginUser(payload, config = {}) {
  if (!API_ENDPOINTS.login) {
    throw new Error("O endpoint de login ainda não foi configurado.")
  }

  const response = await apiClient.post(API_ENDPOINTS.login, payload, config)
  return response.data
}
