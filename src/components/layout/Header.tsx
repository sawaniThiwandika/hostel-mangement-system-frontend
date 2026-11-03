import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
      <p className="text-sm text-slate-500">Hostel Management System</p>
      <NavLink to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        Sign out
      </NavLink>
    </header>
  )
}
