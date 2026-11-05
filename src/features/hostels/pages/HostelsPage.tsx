import { useEffect, useState } from 'react'
import { getHostels } from '../hostelAPI'
import type { HostelSummary } from '../hostelTypes'

export function HostelsPage() {
  const [hostels, setHostels] = useState<HostelSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadHostels() {
    setLoading(true)
    setError(null)

    try {
      setHostels(await getHostels())
    } catch {
      setError('We could not load the hostels. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    void getHostels()
      .then((data) => {
        if (!cancelled) {
          setHostels(data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('We could not load the hostels. Please try again.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Directory
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Hostels</h1>
          <p className="mt-2 text-sm text-slate-500">
            Browse all hostels registered in the management system.
          </p>
        </div>
        {!loading && !error && (
          <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700">
            {hostels.length} {hostels.length === 1 ? 'hostel' : 'hostels'}
          </span>
        )}
      </div>

      {loading && <HostelGridSkeleton />}

      {!loading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p role="alert" className="text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => void loadHostels()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && hostels.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl text-indigo-600">
            H
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No hostels yet</h2>
          <p className="mt-2 text-sm text-slate-500">
            Registered hostels will appear here once they are added.
          </p>
        </div>
      )}

      {!loading && !error && hostels.length > 0 && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {hostels.map((hostel) => <HostelCard key={hostel.id} hostel={hostel} />)}
        </div>
      )}
    </section>
  )
}

function HostelCard({ hostel }: { hostel: HostelSummary }) {
  const name = hostel.hostelName ?? hostel.name ?? 'Unnamed hostel'
  const location = hostel.address ?? hostel.location

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          Active
        </span>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-slate-900">{name}</h2>
      <p className="mt-2 min-h-5 text-sm text-slate-500">{location ?? 'Location not provided'}</p>
      {hostel.description && (
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{hostel.description}</p>
      )}
      {(hostel.roomCount !== undefined || hostel.capacity !== undefined) && (
        <div className="mt-5 flex gap-5 border-t border-slate-100 pt-4 text-sm">
          {hostel.roomCount !== undefined && (
            <div>
              <p className="font-semibold text-slate-900">{hostel.roomCount}</p>
              <p className="text-slate-500">Rooms</p>
            </div>
          )}
          {hostel.capacity !== undefined && (
            <div>
              <p className="font-semibold text-slate-900">{hostel.capacity}</p>
              <p className="text-slate-500">Capacity</p>
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function HostelGridSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading hostels">
      {[1, 2, 3].map((item) => (
        <div key={item} className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
          <div className="mt-5 h-5 w-2/3 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}
