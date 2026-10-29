const env = import.meta.env

function envOrDefault(name, fallback) {
  return env[name] || fallback
}

const servicePath = envOrDefault("VITE_API_SERVICES_PATH", "/services")
const usersPath = envOrDefault("VITE_API_USERS_PATH", "/users")
const dashboardPath = envOrDefault("VITE_API_DASHBOARD_PATH", "/dashboard/summary")

export const API_ENDPOINTS = {
  services: servicePath,
  serviceById: (serviceId) => `${servicePath}/${serviceId}`,
  adminServices: `${servicePath}/admin`,
  deactivateService: (serviceId) => `${servicePath}/${serviceId}/deactivate`,
  userById: (userId) => `${usersPath}/${userId}`,
  profileById: (userId) => `${usersPath}/${userId}`,
  adminDashboard: dashboardPath,
  register: envOrDefault("VITE_API_REGISTER_PATH", "/auth/register"),
  login: envOrDefault("VITE_API_LOGIN_PATH", "/auth/login"),
}
