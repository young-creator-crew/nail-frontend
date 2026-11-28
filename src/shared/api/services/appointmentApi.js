import { api, apiClient } from "../apiClient"
import { API_ENDPOINTS } from "../endpoints"

export const appointmentsEnabled = import.meta.env.DEV && import.meta.env.VITE_APPOINTMENTS_ENABLED === "true"

async function assertAppointmentsEnabled(signal) {
  if (!appointmentsEnabled) throw new Error("A integração de agendamentos não está habilitada.")
  let url
  let allowedUrl
  try {
    url = new URL(apiClient.defaults.baseURL)
    allowedUrl = new URL(import.meta.env.VITE_APPOINTMENTS_API_BASE_URL)
  } catch {
    throw new Error("Configure os endereços da API e dos agendamentos para a mesma API local.")
  }
  if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || !["http:", "https:"].includes(url.protocol)
    || url.username || url.password || url.pathname !== "/" || url.search || url.hash
    || allowedUrl.username || allowedUrl.password || allowedUrl.pathname !== "/" || allowedUrl.search || allowedUrl.hash
    || url.origin !== allowedUrl.origin) {
    throw new Error("A integração provisória exige que os endereços da API e dos agendamentos apontem para a mesma API local.")
  }
  const healthPath = import.meta.env.VITE_APPOINTMENTS_HEALTH_PATH
  const expectedIdentity = import.meta.env.VITE_APPOINTMENTS_API_IDENTITY
  if (!healthPath || !/^\/(?!\/)[a-zA-Z0-9_/-]+$/.test(healthPath) || !expectedIdentity) {
    throw new Error("Configure a verificação de identidade da API de agendamentos.")
  }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 3000)
  const abort = () => controller.abort()
  signal?.addEventListener("abort", abort, { once: true })
  if (signal?.aborted) controller.abort()
  let health
  try {
    const response = await fetch(new URL(healthPath, url), {
      signal: controller.signal,
      redirect: "error",
      credentials: "omit",
      cache: "no-store",
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    health = await response.json()
  } catch (error) {
    if (signal?.aborted) throw error
    throw new Error("Não foi possível verificar a identidade da API de agendamentos.", { cause: error })
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener("abort", abort)
  }
  if (health?.service !== expectedIdentity) {
    throw new Error("A identidade da API de agendamentos não corresponde à configuração. Nenhuma operação foi enviada.")
  }
}

function validateAppointment(item) {
  if (!item || !item.id || !item.serviceId || typeof item.service !== "string"
    || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(item.time)
    || !Number.isFinite(item.price) || typeof item.status !== "string"
    || !Number.isFinite(new Date(`${item.date}T12:00:00`).getTime())) {
    throw new Error("A API retornou um agendamento inválido.")
  }
  return item
}

export async function listAppointments(userId, view, signal) {
  await assertAppointmentsEnabled(signal)
  const result = await api.get(API_ENDPOINTS.appointments, { params: { userId, view }, signal })
  if (!Array.isArray(result)) throw new Error("A API retornou uma lista de agendamentos inválida.")
  return result.map(validateAppointment)
}

export async function getAvailableTimes(serviceId, date, signal) {
  await assertAppointmentsEnabled(signal)
  const result = await api.get(API_ENDPOINTS.appointmentAvailability, { params: { serviceId, date }, signal })
  if (!Array.isArray(result) || result.some((time) => typeof time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) {
    throw new Error("A API retornou horários inválidos.")
  }
  return result
}

export async function createAppointment(payload) {
  await assertAppointmentsEnabled()
  return validateAppointment(await api.post(API_ENDPOINTS.appointments, payload))
}

export async function cancelAppointment(id) {
  await assertAppointmentsEnabled()
  return validateAppointment(await api.patch(API_ENDPOINTS.appointmentCancel(id), {}))
}

export async function rescheduleAppointment(id, payload) {
  await assertAppointmentsEnabled()
  return validateAppointment(await api.patch(API_ENDPOINTS.appointmentReschedule(id), payload))
}
