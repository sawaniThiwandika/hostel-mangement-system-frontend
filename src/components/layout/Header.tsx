import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'

export function Header() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  function handleSignOut() {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <p className="text-sm text-slate-500">Hostel Management System</p>
      <button
        type="button"
        onClick={handleSignOut}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        Sign out
      </button>
    </header>
  )
}
