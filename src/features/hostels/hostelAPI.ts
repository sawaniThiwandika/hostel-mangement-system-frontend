import { API_ENDPOINTS } from '../../services/apiEndpoints'
import { axiosInstance } from '../../services/axiosInstance'
import type { HostelSummary } from './hostelTypes'

export async function getHostels() {
  const response = await axiosInstance.get<HostelSummary[]>(API_ENDPOINTS.hostels)
  return response.data
}

export async function getMyHostels() {
  const response = await axiosInstance.get<HostelSummary[]>(API_ENDPOINTS.myHostels)
  return response.data
}
