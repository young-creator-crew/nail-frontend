import { api } from "../../../shared/api/apiClient"
import { API_ENDPOINTS } from "../../../shared/api/endpoints"

export function getServices(config = {}) {
  return api.get(API_ENDPOINTS.services, config)
}

export function getServiceById(serviceId, config = {}) {
  if (!serviceId) {
    return Promise.reject(new Error("O identificador do serviço é obrigatório."))
  }

  return api.get(API_ENDPOINTS.serviceById(serviceId), config)
}

export function createService(formData, config = {}) {
  return api.post(API_ENDPOINTS.services, formData, {
    ...config,
    headers: { ...config.headers },
  })
}

export function updateService(serviceId, service, config = {}) {
  if (!serviceId) {
    return Promise.reject(new Error("O identificador do serviço é obrigatório."))
  }

  return api.put(API_ENDPOINTS.serviceById(serviceId), service, config)
}

export function updateServiceImage(serviceId, image, config = {}) {
  if (!serviceId || !image) {
    return Promise.reject(new Error("O serviço e a imagem são obrigatórios."))
  }

  const formData = new FormData()
  formData.append("image", image)
  return api.put(API_ENDPOINTS.serviceImage(serviceId), formData, {
    ...config,
    headers: { ...config.headers },
  })
}

export function deleteService(serviceId, config = {}) {
  if (!serviceId) {
    return Promise.reject(new Error("O identificador do serviço é obrigatório."))
  }

  return api.delete(API_ENDPOINTS.serviceById(serviceId), config)
}
