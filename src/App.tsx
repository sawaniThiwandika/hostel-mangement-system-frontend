import { NavLink, Route, Routes } from 'react-router-dom'

function Home() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600">
        React + Vite
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
        Build something great.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
        A fast TypeScript starter with client-side routing and Tailwind CSS
        already configured.
      </p>
      <NavLink
        to="/about"
        className="mt-10 inline-flex rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-500"
      >
        Explore the starter
      </NavLink>
    </section>
  )
}

function About() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-4xl font-bold tracking-tight text-slate-900">
        About this starter
      </h1>
      <p className="mt-6 text-lg leading-8 text-slate-600">
        Add pages under <code className="rounded bg-slate-100 px-2 py-1 text-sm">src</code>{' '}
        and register them in the routes to grow your application.
      </p>
    </section>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="text-lg font-bold text-indigo-600">
            Vite Starter
          </NavLink>
          <div className="flex gap-6 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'
              }
            >
              About
            </NavLink>
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
