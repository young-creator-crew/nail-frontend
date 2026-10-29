import { api } from "../../../shared/api/apiClient"
import { API_ENDPOINTS } from "../../../shared/api/endpoints"

export function getProfile(userId, config = {}) {
  if (!userId) return Promise.reject(new Error("O identificador do usuário é obrigatório."))
  return api.get(API_ENDPOINTS.userById(userId), config)
}

export function updateProfile(userId, payload, config = {}) {
  if (!userId) return Promise.reject(new Error("O identificador do usuário é obrigatório."))
  return api.put(API_ENDPOINTS.userById(userId), payload, config)
}
