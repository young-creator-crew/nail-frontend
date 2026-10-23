import { apiClient } from "../apiClient"
import { API_ENDPOINTS } from "../endpoints"

function requireEndpoint(endpoint, message) {
  if (!endpoint) {
    throw new Error(message)
  }
}

export async function getClientProfile(config = {}) {
  requireEndpoint(API_ENDPOINTS.clientProfile, "O endpoint do perfil ainda não foi configurado.")
  const response = await apiClient.get(API_ENDPOINTS.clientProfile, config)
  return response.data
}

export async function updateClientProfile(payload, config = {}) {
  requireEndpoint(API_ENDPOINTS.updateClientProfile, "O endpoint de atualização ainda não foi configurado.")
  const response = await apiClient.put(API_ENDPOINTS.updateClientProfile, payload, config)
  return response.data
}

export async function getClientAppointments(config = {}) {
  requireEndpoint(API_ENDPOINTS.clientAppointments, "O endpoint de agendamentos ainda não foi configurado.")
  const response = await apiClient.get(API_ENDPOINTS.clientAppointments, config)
  return response.data
}

export async function getAdminAppointments(date, config = {}) {
  requireEndpoint(API_ENDPOINTS.adminAppointments, "O endpoint da agenda ainda não foi configurado.")
  const response = await apiClient.get(API_ENDPOINTS.adminAppointments, {
    ...config,
    params: { ...config.params, date },
  })
  return response.data
}
