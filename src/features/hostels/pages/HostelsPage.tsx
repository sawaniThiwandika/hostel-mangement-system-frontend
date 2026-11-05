import { useCallback, useEffect, useState } from 'react'
import { getHostels, getMyHostels } from '../hostelAPI'
import type { HostelSummary } from '../hostelTypes'

interface HostelsPageProps {
  ownerOnly?: boolean
}

export function HostelsPage({ ownerOnly = false }: HostelsPageProps) {
  const [hostels, setHostels] = useState<HostelSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadHostels = useCallback(
    () => (ownerOnly ? getMyHostels() : getHostels()),
    [ownerOnly],
  )

  async function reloadHostels() {
    setLoading(true)
    setError(null)

    try {
      setHostels(await loadHostels())
    } catch {
      setError('We could not load the hostels. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    void loadHostels()
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
  }, [loadHostels])

  return (
    <section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Directory
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {ownerOnly ? 'My Hostels' : 'Hostels'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {ownerOnly
              ? 'Manage hostels connected to your owner account.'
              : 'Browse all hostels registered in the management system.'}
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
            onClick={() => void reloadHostels()}
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
          {hostels.map((hostel) => <HostelCard key={hostel.hostelId} hostel={hostel} />)}
        </div>
      )}
    </section>
  )
}

function HostelCard({ hostel }: { hostel: HostelSummary }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
          {hostel.name.charAt(0).toUpperCase()}
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          Active
        </span>
      </div>
      <h2 className="mt-5 text-lg font-semibold text-slate-900">{hostel.name}</h2>
      <p className="mt-2 text-sm text-slate-500">{hostel.address}</p>
      <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <p><span className="font-medium text-slate-900">Location:</span> {hostel.location}</p>
        <p><span className="font-medium text-slate-900">Phone:</span> {hostel.tel}</p>
        <p className="break-all"><span className="font-medium text-slate-900">Email:</span> {hostel.email}</p>
      </div>
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
