const servicesPath = "/procedures"

export const API_ENDPOINTS = {
  services: servicesPath,
  serviceById: (serviceId) => `${servicesPath}/${serviceId}`,
}
