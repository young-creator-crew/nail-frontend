import { apiClient } from "../apiClient"
import { API_ENDPOINTS } from "../endpoints"

export async function getServices(config = {}) {
  if (!API_ENDPOINTS.services) {
    throw new Error("O endpoint de serviços ainda não foi configurado.")
  }

  const response = await apiClient.get(API_ENDPOINTS.services, config)
  return response.data
}

export async function getServiceById(serviceId, config = {}) {
  if (!serviceId) {
    throw new Error("O identificador do serviço é obrigatório.")
  }

  if (!API_ENDPOINTS.services) {
    throw new Error("O endpoint de serviços ainda não foi configurado.")
  }

  const response = await apiClient.get(
    API_ENDPOINTS.serviceById(serviceId),
    config,
  )
  return response.data
}
