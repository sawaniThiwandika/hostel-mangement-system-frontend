import { useCallback, useEffect, useRef, useState } from 'react'
import { getHostelById, getHostels, getMyHostels } from '../hostelAPI'
import type { HostelResponse, HostelSummary } from '../hostelTypes'

interface HostelsPageProps {
  ownerOnly?: boolean
}

export function HostelsPage({ ownerOnly = false }: HostelsPageProps) {
  const [hostels, setHostels] = useState<HostelSummary[]>([])
  const [selectedHostel, setSelectedHostel] = useState<HostelSummary | null>(null)
  const [selectedDetails, setSelectedDetails] = useState<HostelResponse | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)
  const requestId = useRef(0)
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
          setSelectedHostel((current) =>
            current ? data.find((hostel) => hostel.hostelId === current.hostelId) ?? null : null,
          )
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

  function viewHostel(hostel: HostelSummary) {
    const currentRequest = requestId.current + 1
    requestId.current = currentRequest
    setSelectedHostel(hostel)
    setSelectedDetails(null)
    setDetailsLoading(true)
    setDetailsError(null)

    void getHostelById(hostel.hostelId)
      .then((data) => {
        if (requestId.current === currentRequest) {
          setSelectedDetails(data)
        }
      })
      .catch(() => {
        if (requestId.current === currentRequest) {
          setDetailsError('We could not load the hostel details.')
        }
      })
      .finally(() => {
        if (requestId.current === currentRequest) {
          setDetailsLoading(false)
        }
      })
  }

  function retrySelectedHostel() {
    if (selectedHostel) {
      viewHostel(selectedHostel)
    }
  }

  const hostelCards = hostels.map((hostel) => (
    <HostelCard
      key={hostel.hostelId}
      hostel={hostel}
      selected={ownerOnly && selectedHostel?.hostelId === hostel.hostelId}
      onView={ownerOnly ? () => viewHostel(hostel) : undefined}
      showContactActions={!ownerOnly}
    />
  ))

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            {ownerOnly ? 'Owner workspace' : 'Directory'}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {ownerOnly ? 'My Hostels' : 'Hostels'}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            {ownerOnly
              ? 'Manage your properties, review key information, and keep your hostel network organized.'
              : 'Browse all hostels registered in the management system.'}
          </p>
        </div>
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
        ownerOnly && selectedHostel ? (
          <div className="grid min-h-[calc(100vh-220px)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 xl:grid-cols-[minmax(420px,0.9fr)_minmax(0,1.1fr)]">
            <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-1">{hostelCards}</div>
            </div>
            <div className="min-h-0 border-t border-slate-200 xl:border-l xl:border-t-0">
              <HostelDetailsPanel
                hostel={selectedHostel}
                details={selectedDetails}
                loading={detailsLoading}
                error={detailsError}
                onRetry={retrySelectedHostel}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{hostelCards}</div>
        )
      )}
    </section>
  )
}

function HostelCard({
  hostel,
  selected,
  onView,
  showContactActions,
}: {
  hostel: HostelSummary
  selected: boolean
  onView?: () => void
  showContactActions: boolean
}) {
  return (
    <article className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg ${selected ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-200 hover:border-indigo-200'}`}>
      <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-violet-500 to-sky-400" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white shadow-md shadow-indigo-200">
          {hostel.name.charAt(0).toUpperCase()}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        </div>
        <div className="mt-5">
          <h2 className="truncate text-lg font-bold text-slate-900">{hostel.name}</h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
            ID: {hostel.hostelId}
          </p>
        </div>
        <div className="mt-5 rounded-xl bg-slate-50 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Address</p>
          <p className="mt-1 truncate text-sm font-medium text-slate-700">{hostel.address}</p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
          <span className="truncate">{hostel.location}</span>
          <span className="shrink-0">{hostel.tel}</span>
        </div>
        {showContactActions && (
          <div className="mt-5 flex gap-2">
            <ContactAction href={`tel:${hostel.tel}`} label="Call" disabled={!hostel.tel} />
            <ContactAction href={`mailto:${hostel.email}`} label="Email" disabled={!hostel.email} />
          </div>
        )}
        {onView && (
          <button
            type="button"
            onClick={onView}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${selected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'border border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'}`}
          >
            {selected ? 'Viewing details' : 'View details'}
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </article>
  )
}

function HostelDetailsPanel({
  hostel,
  details,
  loading,
  error,
  onRetry,
}: {
  hostel: HostelSummary | null
  details: HostelResponse | null
  loading: boolean
  error: string | null
  onRetry: () => void
}) {
  return (
    <aside className="h-full overflow-hidden bg-white">
      {!hostel ? (
        <div className="flex min-h-[430px] flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50/60 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-indigo-600 shadow-lg shadow-indigo-100">
            +
          </div>
          <h2 className="mt-6 text-xl font-bold text-slate-900">Select a property</h2>
          <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
            Choose a hostel from the list to view its complete profile and owner information.
          </p>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white">
            <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -left-8 h-44 w-44 rounded-full bg-white/5" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">Property profile</p>
                <h2 className="mt-3 text-2xl font-bold">{details?.name ?? hostel.name}</h2>
                <p className="mt-2 text-sm text-indigo-100">ID: {hostel.hostelId}</p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold ring-1 ring-white/20">
                {(details?.name ?? hostel.name).charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="relative mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Active property
            </span>
          </div>
          <div className="p-6">
          {loading && (
            <div className="space-y-4" role="status" aria-label="Loading hostel details">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              <p className="text-sm text-slate-400">Loading hostel details...</p>
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <p role="alert">{error}</p>
              <button type="button" onClick={onRetry} className="mt-3 rounded-lg bg-white px-3 py-2 font-semibold text-red-700 shadow-sm">
                Try again
              </button>
            </div>
          )}
          {details && !loading && !error && (
            <div className="space-y-6 text-sm text-slate-600">
              <div>
                <SectionHeading>Contact & location</SectionHeading>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Address" value={details.address} />
                  <DetailRow label="Location" value={details.location} />
                  <DetailRow label="Phone" value={details.tel} />
                  <DetailRow label="Email" value={details.email} />
                </div>
              </div>
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                <SectionHeading>Owner information</SectionHeading>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Name" value={details.ownerSummery.ownerName} />
                  <DetailRow label="Phone" value={details.ownerSummery.tel} />
                  <DetailRow label="Email" value={details.ownerSummery.email} />
                  <DetailRow label="NIC" value={details.ownerSummery.nic} />
                </div>
              </div>
            </div>
          )}
          </div>
        </>
      )}
    </aside>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-all font-medium text-slate-700">{value || 'Not provided'}</p>
    </div>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
      <span className="h-5 w-1 rounded-full bg-indigo-500" />
      {children}
    </h3>
  )
}

function ContactAction({
  href,
  label,
  disabled,
}: {
  href: string
  label: string
  disabled: boolean
}) {
  if (disabled) {
    return (
      <span className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400">
        {label} unavailable
      </span>
    )
  }

  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
    >
      <span aria-hidden="true">{href.startsWith('tel:') ? '☎' : '✉'}</span>
      {label}
    </a>
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
