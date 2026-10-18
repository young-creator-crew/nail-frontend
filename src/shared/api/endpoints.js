const servicesPath = ""
const bookingsPath = ""

export const API_ENDPOINTS = {
  services: servicesPath,
  serviceById: (serviceId) => `${servicesPath}/${serviceId}`,
  bookings: bookingsPath,
  bookingById: (bookingId) => `${bookingsPath}/${bookingId}`,
}
