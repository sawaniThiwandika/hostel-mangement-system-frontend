import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '../components/layout/AuthLayout'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { SignUpPage } from '../features/auth/pages/SignUpPage'
import { ComplaintPage } from '../features/complaints/pages/ComplaintPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { HostelsPage } from '../features/hostels/pages/HostelsPage'
import { PaymentPage } from '../features/payments/pages/PaymentPage'
import { RoomPage } from '../features/rooms/pages/RoomPage'
import { StaffPage } from '../features/staff/pages/StaffPage'
import { StudentsPage } from '../features/students/pages/StudentsPage'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/hostels" element={<HostelsPage />} />
          <Route path="/my-hostels" element={<HostelsPage ownerOnly />} />
          <Route path="/rooms" element={<RoomPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/complaints" element={<ComplaintPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
