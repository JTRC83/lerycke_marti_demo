import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import DocumentChecklist from './DocumentChecklist.jsx'
import { formatEur } from '../data/projects.js'

// Small metadata row: icon + text.
function Meta({ children }) {
  return (
    <li className="flex items-center gap-2 text-sm text-brand-800">
      {children}
    </li>
  )
}

function PinIcon() {
  return (
    <svg className="w-4 h-4 text-surface-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function AreaIcon() {
  return (
    <svg className="w-4 h-4 text-surface-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="1" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9h18M9 3v18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DoorIcon() {
  return (
    <svg className="w-4 h-4 text-surface-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 21h18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12h.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4 text-surface-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function formatDate(yyyymm) {
  const [y, m] = yyyymm.split('-').map(Number)
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  return `${meses[m - 1]} ${y}`
}

// Progress bar color by completion: full = success, partial = brand, empty = muted.
function progressColor(done, total) {
  if (done >= total) return 'bg-state-success'
  if (done === 0) return 'bg-surface-muted'
  return 'bg-brand-500'
}

export default function ProjectCard({ project }) {
  const navigate = useNavigate()

  // Document completion across the 4 tracked docs (presupuesto, plan, memoria, renders).
  const docKeys = ['presupuesto', 'plan', 'memoria', 'renders']
  const docs = project.docs || {}
  const totalDocs = docKeys.length
  const doneDocs = docKeys.reduce((acc, key) => {
    if (key === 'renders') {
      const r = docs.renders || { generados: 0, total: 0 }
      return acc + (r.total > 0 && r.generados === r.total ? 1 : 0)
    }
    return acc + (docs[key] ? 1 : 0)
  }, 0)
  const pct = Math.round((doneDocs / totalDocs) * 100)

  return (
    <article
      onClick={() => navigate(`/proyecto/${project.id}`)}
      className="bg-surface-card border border-brand-100 rounded-xl p-5 cursor-pointer hover:border-brand-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-brand-900 truncate">{project.nombre}</h3>
          <p className="text-sm text-surface-muted truncate">
            {typeof project.cliente === 'string' ? project.cliente : project.cliente?.nombre || 'Sin cliente'}
          </p>
        </div>
        <StatusBadge estado={project.estado} />
      </div>

      <ul className="mt-4 space-y-1.5">
        <Meta><PinIcon /> {project.direccion || 'Sin dirección'}</Meta>
        <Meta>
          <AreaIcon />{' '}
          {project.m2 == null ? 'm² sin definir' : `${project.m2.toFixed(1).replace('.', ',')} m²`}
        </Meta>
        <Meta>
          <DoorIcon />{' '}
          {project.estancias == null ? 'Estancias sin definir' : `${project.estancias} estancias`}
        </Meta>
      </ul>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-brand-800">{project.ciudad || 'Sin ciudad'}</span>
        <span className="flex items-center gap-1.5 text-surface-muted">
          <CalendarIcon />
          {formatDate(project.fecha)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.estilo && (
          <span className="px-2.5 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-medium">
            {project.estilo}
          </span>
        )}
        {project.tipo && (
          <span className="px-2.5 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-medium">
            {project.tipo}
          </span>
        )}
        {!project.estilo && !project.tipo && (
          <span className="px-2.5 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-medium">
            Sin estilo
          </span>
        )}
      </div>

      {/* Document progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-surface-muted">
            Documentos
          </span>
          <span className="text-xs text-brand-800 font-medium">
            {doneDocs}/{totalDocs} documentos
          </span>
        </div>
        <div className="h-2 rounded-full bg-brand-50 overflow-hidden">
          <div
            className={`h-full rounded-full ${progressColor(doneDocs, totalDocs)} transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <DocumentChecklist docs={project.docs} />

      <div className="mt-4 pt-4 border-t border-brand-100 flex items-end justify-between">
        <span className="text-xs uppercase tracking-wider text-surface-muted">Presupuesto total</span>
        <span className="text-xl font-bold text-brand-900">
          {project.presupuestoTotal == null ? '—' : formatEur(project.presupuestoTotal)}
        </span>
      </div>
    </article>
  )
}