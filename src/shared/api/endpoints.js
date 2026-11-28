const env = import.meta.env

function envOrDefault(name, fallback) {
  return env[name] || fallback
}

const servicePath = envOrDefault("VITE_API_SERVICES_PATH", "/services")
const usersPath = envOrDefault("VITE_API_USERS_PATH", "/users")
const dashboardPath = envOrDefault("VITE_API_DASHBOARD_PATH", "/dashboard/summary")
const appointmentsPath = envOrDefault("VITE_API_APPOINTMENTS_PATH", "/appointments")

export const API_ENDPOINTS = {
  services: servicePath,
  serviceById: (serviceId) => `${servicePath}/${serviceId}`,
  adminServices: `${servicePath}/admin`,
  deactivateService: (serviceId) => `${servicePath}/${serviceId}/deactivate`,
  userById: (userId) => `${usersPath}/${userId}`,
  profileById: (userId) => `${usersPath}/${userId}`,
  adminDashboard: dashboardPath,
  appointments: appointmentsPath,
  appointmentAvailability: `${appointmentsPath}/availability`,
  appointmentCancel: (id) => `${appointmentsPath}/${encodeURIComponent(id)}/cancel`,
  appointmentReschedule: (id) => `${appointmentsPath}/${encodeURIComponent(id)}/reschedule`,
  register: envOrDefault("VITE_API_REGISTER_PATH", "/auth/register"),
  login: envOrDefault("VITE_API_LOGIN_PATH", "/auth/login"),
}
