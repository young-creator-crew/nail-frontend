import { api } from "../../../shared/api/apiClient"
import { API_ENDPOINTS } from "../../../shared/api/endpoints"

function buildMultipartConfig(config = {}) {
  const headers = { ...config.headers }
  delete headers["Content-Type"]
  delete headers["content-type"]

  return {
    ...config,
    headers,
  }
}

export function getServices(config = {}) {
  return api.get(API_ENDPOINTS.services, config)
}

export function getAdminServices(config = {}) {
  return api.get(API_ENDPOINTS.adminServices, config)
}

export function getServiceById(serviceId, config = {}) {
  if (!serviceId) {
    return Promise.reject(new Error("O identificador do serviço é obrigatório."))
  }

  return api.get(API_ENDPOINTS.serviceById(serviceId), config)
}

export function createService(service, photo, config = {}) {
  const formData = new FormData()
  formData.append("service", new Blob([JSON.stringify(service)], { type: "application/json" }))
  if (photo) formData.append("foto", photo)
  return api.post(API_ENDPOINTS.services, formData, buildMultipartConfig(config))
}

export function updateService(serviceId, service, photo, config = {}) {
  if (!serviceId) {
    return Promise.reject(new Error("O identificador do serviço é obrigatório."))
  }

  const formData = new FormData()
  formData.append("service", new Blob([JSON.stringify(service)], { type: "application/json" }))
  if (photo) formData.append("foto", photo)
  return api.put(API_ENDPOINTS.serviceById(serviceId), formData, buildMultipartConfig(config))
}

export function deactivateService(serviceId, config = {}) {
  if (!serviceId) {
    return Promise.reject(new Error("O identificador do serviço é obrigatório."))
  }

  const headers = { ...config.headers }
  delete headers["Content-Type"]
  delete headers["content-type"]

  return api.request("PATCH", API_ENDPOINTS.deactivateService(serviceId), {
    ...config,
    headers,
  })
}
