import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

function getErrorMessage(error) {
  return error?.response?.data?.message
    || error?.message
    || "Não foi possível comunicar com a API."
}

export async function request(method, url, options = {}) {
  if (!url) {
    throw new Error("O endpoint da API não foi configurado.")
  }

  try {
    const response = await apiClient.request({
      method,
      url,
      ...options,
    })
    return response.data
  } catch (error) {
    const normalizedError = new Error(getErrorMessage(error))
    normalizedError.cause = error
    normalizedError.status = error?.response?.status
    throw normalizedError
  }
}

export const api = {
  request,
  get: (url, config) => request("GET", url, { ...config }),
  post: (url, data, config) => request("POST", url, { ...config, data }),
  put: (url, data, config) => request("PUT", url, { ...config, data }),
  patch: (url, data, config) => request("PATCH", url, { ...config, data }),
  delete: (url, config) => request("DELETE", url, { ...config }),
}
