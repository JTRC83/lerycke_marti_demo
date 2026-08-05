import { useNavigate } from 'react-router-dom'
import { formatEur } from '../../../data/projects.js'
import { getCompletitud, getEstancias } from '../../../utils/project.js'

// ResumenTab: 4 metric cards + completeness checklist (PRD 03, section Resumen).
// Shows a large check icon when all 5 documents are complete.

function IconCheckBig() {
  return (
    <svg className="w-14 h-14 text-state-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg className="w-4 h-4 text-state-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconEmpty() {
  return (
    <svg className="w-4 h-4 text-surface-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

function Card({ valor, etiqueta }) {
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
      <p className="text-2xl font-semibold text-brand-900 leading-none">{valor}</p>
      <p className="mt-1.5 text-sm text-surface-muted truncate">{etiqueta}</p>
    </div>
  )
}

function ChecklistItem({ ok, label }) {
  return (
    <li className="flex items-center gap-2 py-1.5 border-b border-brand-100 last:border-0">
      {ok ? <IconCheck /> : <IconEmpty />}
      <span className="text-sm text-brand-800">{label}</span>
      <span className={`ml-auto text-xs ${ok ? 'text-state-success' : 'text-surface-muted'}`}>
        {ok ? 'OK' : 'pendiente'}
      </span>
    </li>
  )
}

export default function ResumenTab({ proyecto }) {
  const navigate = useNavigate()
  const completitud = getCompletitud(proyecto)
  const renders = proyecto.docs?.renders || { generados: 0, total: 0 }

  // 8 categories per PRD 06; show 8 when memory is verified, else 0.
  const memoriaCategorias = completitud.memoria ? 8 : 0
  // Estancias: use plan maestro count (6) when plan is generated, else fall back.
  const estancias = completitud.plan ? 6 : getEstancias(proyecto)

  const items = [
    { ok: completitud.cliente, label: 'Cliente + datos' },
    { ok: completitud.plan, label: 'Plan maestro' },
    { ok: completitud.presupuesto, label: 'Presupuesto' },
    { ok: completitud.renders, label: 'Renders' },
    { ok: completitud.memoria, label: 'Memoria' },
  ]

  return (
    <div className="space-y-5">
      {/* Header with large check when complete */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6 flex items-center gap-4">
        {completitud.completo ? <IconCheckBig /> : null}
        <div>
          <h3 className="text-lg font-semibold text-brand-900">Resumen del proyecto</h3>
          <p className="text-sm text-surface-muted">Estado de los documentos del proyecto</p>
        </div>
      </div>

      {/* 4 metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card valor={proyecto.presupuestoTotal != null ? formatEur(proyecto.presupuestoTotal) : '—'} etiqueta="Presupuesto total" />
        <Card valor={`${renders.generados} generados`} etiqueta="Renders" />
        <Card valor={`${memoriaCategorias} categorías`} etiqueta="Memoria" />
        <Card valor={estancias} etiqueta="Estancias" />
      </div>

      {/* Completeness checklist */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-3">
          Completitud
        </h4>
        <ul>
          {items.map((it) => (
            <ChecklistItem key={it.label} ok={it.ok} label={it.label} />
          ))}
        </ul>
      </div>

      {/* Go to dashboard */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="px-5 py-2.5 rounded-xl border border-brand-200 text-brand-800 text-sm font-medium hover:bg-surface-base transition-colors"
        >
          Ir al dashboard
        </button>
      </div>
    </div>
  )
}