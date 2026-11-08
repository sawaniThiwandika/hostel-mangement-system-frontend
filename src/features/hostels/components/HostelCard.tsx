import type { HostelSummary } from '../hostelTypes'

interface HostelCardProps {
  hostel: HostelSummary
  selected: boolean
  onView?: () => void
  showContactActions: boolean
}

export function HostelCard({
  hostel,
  selected,
  onView,
  showContactActions,
}: HostelCardProps) {
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
