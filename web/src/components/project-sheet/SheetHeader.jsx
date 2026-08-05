import StatusBadge from '../StatusBadge.jsx'

// SheetHeader: project name, client, status badge and the "Exportar ficha (PDF)"
// primary button. Fixed at the top of the sheet content area.
function IconDownload() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SheetHeader({ proyecto, onExport, exportando }) {
  if (!proyecto) return null

  return (
    <header className="bg-surface-card border border-brand-100 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:border-0 print:shadow-none">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-brand-900 leading-tight">
          {proyecto.nombre}
        </h1>
        <p className="mt-1 text-sm text-surface-muted truncate">
          {proyecto.clienteLabel}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge estado={proyecto.estado} />
        <button
          type="button"
          onClick={onExport}
          disabled={exportando}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors disabled:opacity-60 print:hidden"
        >
          <IconDownload />
          {exportando ? 'Generando...' : 'Exportar ficha (PDF)'}
        </button>
      </div>
    </header>
  )
}