const env = import.meta.env

function envOrDefault(name, fallback) {
  return env[name] || fallback
}

const procedurePath = envOrDefault("VITE_API_PROCEDURES_PATH", "/procedures")
const appointmentPath = envOrDefault("VITE_API_APPOINTMENTS_PATH", "/appointments")
const dashboardPath = envOrDefault("VITE_API_DASHBOARD_PATH", "/dashboard")

export const API_ENDPOINTS = {
  services: procedurePath,
  serviceById: (serviceId) => `${procedurePath}/${serviceId}`,
  serviceImage: (serviceId) => `${procedurePath}/${serviceId}/image`,
  bookings: appointmentPath,
  bookingById: (bookingId) => `${appointmentPath}/${bookingId}`,
  clientProfile: envOrDefault("VITE_API_PROFILE_PATH", "/users/me"),
  updateClientProfile: envOrDefault("VITE_API_PROFILE_PATH", "/users/me"),
  clientAppointments: `${appointmentPath}/mine`,
  adminAppointments: `${appointmentPath}/admin`,
  adminDashboard: dashboardPath,
  register: envOrDefault("VITE_API_REGISTER_PATH", "/auth/register"),
  login: envOrDefault("VITE_API_LOGIN_PATH", "/auth/login"),
}
