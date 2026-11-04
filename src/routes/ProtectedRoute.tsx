import { Navigate, Outlet } from 'react-router-dom'
import { isAuthenticated } from '../features/auth/authSession'

export function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />
}
