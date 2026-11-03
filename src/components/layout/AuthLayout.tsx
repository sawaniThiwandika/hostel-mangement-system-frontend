import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <Outlet />
      </div>
    </main>
  )
}
