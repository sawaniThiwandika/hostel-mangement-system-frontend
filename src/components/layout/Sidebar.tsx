import { NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Hostels', path: '/hostels' },
  { label: 'My Hostels', path: '/my-hostels' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'Students', path: '/students' },
  { label: 'Staff', path: '/staff' },
  { label: 'Payments', path: '/payments' },
  { label: 'Complaints', path: '/complaints' },
]

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5">
      <NavLink to="/dashboard" className="mb-8 text-xl font-bold text-indigo-600">
        Hostel Manager
      </NavLink>
      <nav className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
