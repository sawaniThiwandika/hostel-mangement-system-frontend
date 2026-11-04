import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('hostel-access-token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
