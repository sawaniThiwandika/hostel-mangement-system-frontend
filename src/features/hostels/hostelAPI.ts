import { API_ENDPOINTS } from '../../services/apiEndpoints'
import { axiosInstance } from '../../services/axiosInstance'
import type { HostelResponse, HostelSummary } from './hostelTypes'

export async function getHostels() {
  const response = await axiosInstance.get<HostelSummary[]>(API_ENDPOINTS.hostels)
  return response.data
}

export async function getMyHostels() {
  const response = await axiosInstance.get<HostelSummary[]>(API_ENDPOINTS.myHostels)
  return response.data
}

export async function getHostelById(id: string) {
  const response = await axiosInstance.get<HostelResponse>(API_ENDPOINTS.hostelById(id))
  return response.data
}
