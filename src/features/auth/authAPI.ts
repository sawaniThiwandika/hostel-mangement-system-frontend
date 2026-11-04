import { axiosInstance } from '../../services/axiosInstance'
import { API_ENDPOINTS } from '../../services/apiEndpoints'
import type { AuthResponse, LoginRequest, OwnerCreateRequest } from './authTypes'

export async function login(request: LoginRequest) {
  const response = await axiosInstance.post<AuthResponse>(API_ENDPOINTS.login, request)
  return response.data
}

export async function registerOwner(request: OwnerCreateRequest) {
  const response = await axiosInstance.post<AuthResponse>(
    API_ENDPOINTS.registerOwner,
    request,
  )
  return response.data
}
