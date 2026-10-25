import { api } from "../../../shared/api/apiClient"
import { API_ENDPOINTS } from "../../../shared/api/endpoints"

export function getAdminDashboard(config = {}) {
  return api.get(API_ENDPOINTS.adminDashboard, config)
}
