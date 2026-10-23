import { apiClient } from "../apiClient"
import { API_ENDPOINTS } from "../endpoints"

export async function getServices(config = {}) {
  const response = await apiClient.get(API_ENDPOINTS.services, config)
  return response.data
}

export async function getServiceById(serviceId, config = {}) {
  const response = await apiClient.get(
    API_ENDPOINTS.serviceById(serviceId),
    config,
  )
  return response.data
}

export async function createService(formData, config = {}) {
  const response = await apiClient.post(
    API_ENDPOINTS.services,
    formData,
    {
      ...config,
      headers: { ...config.headers, "Content-Type": "multipart/form-data" },
    },
  )
  return response.data
}

export async function updateService(serviceId, service, config = {}) {
  const response = await apiClient.put(
    API_ENDPOINTS.serviceById(serviceId),
    service,
    config,
  )
  return response.data
}

export async function updateServiceImage(serviceId, image, config = {}) {
  const formData = new FormData()
  formData.append("image", image)

  const response = await apiClient.put(
    `${API_ENDPOINTS.serviceById(serviceId)}/image`,
    formData,
    {
      ...config,
      headers: { ...config.headers, "Content-Type": "multipart/form-data" },
    },
  )
  return response.data
}

export async function deleteService(serviceId, config = {}) {
  await apiClient.delete(API_ENDPOINTS.serviceById(serviceId), config)
}
