import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    Accept: "application/json",
  },
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
})

if (apiClient.defaults?.headers) {
  delete apiClient.defaults.headers.post?.["Content-Type"]
  delete apiClient.defaults.headers.put?.["Content-Type"]
  delete apiClient.defaults.headers.patch?.["Content-Type"]
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

function getErrorMessage(error) {
  if (error?.response?.status === 401) {
    return "E-mail ou senha inválidos, ou usuário inativo."
  }

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
