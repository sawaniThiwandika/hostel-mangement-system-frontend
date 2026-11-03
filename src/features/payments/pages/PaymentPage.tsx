export function PaymentPage() {
  return <PagePlaceholder title="Payments" />
}

function PagePlaceholder({ title }: { title: string }) {
  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">This page is ready for implementation.</p>
    </section>
  )
}
