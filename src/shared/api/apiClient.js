import axios from "axios"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export { apiClient }
