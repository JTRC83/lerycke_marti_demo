// Small inline icons for KPI cards.
function IconFolder() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPencil() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconDoc() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const icons = {
  folder: IconFolder,
  bolt: IconBolt,
  pencil: IconPencil,
  doc: IconDoc,
}

export default function KpiCard({ etiqueta, valor, icon = 'folder' }) {
  const Icon = icons[icon] ?? IconFolder

  return (
    <div className="bg-surface-card border border-brand-100 rounded-lg p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
        <Icon />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold text-brand-900 leading-none">{valor}</p>
        <p className="mt-1 text-sm text-surface-muted truncate">{etiqueta}</p>
      </div>
    </div>
  )
}