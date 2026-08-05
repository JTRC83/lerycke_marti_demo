import { useNavigate } from 'react-router-dom'
import { useProjects } from '../context/ProjectsContext.jsx'
import { formatEur } from '../data/projects.js'
import { getClienteNombre } from '../utils/project.js'

// PresupuestosPage: resumen de presupuestos de todos los proyectos.

function PresupuestoRow({ proyecto, navigate }) {
  const total = proyecto.presupuestoTotal
  const verificado = proyecto.docs?.presupuesto === true

  return (
    <div
      className="bg-surface-card border border-brand-100 rounded-xl p-5 cursor-pointer hover:border-brand-300 transition-colors"
      onClick={() => navigate(`/proyecto/${proyecto.id}`)}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-sm font-semibold text-brand-900">{proyecto.nombre}</h3>
          <p className="text-xs text-surface-muted">{getClienteNombre(proyecto)}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          verificado ? 'bg-state-success/10 text-state-success' : 'bg-surface-base text-surface-muted'
        }`}>
          {verificado ? 'Verificado' : 'Pendiente'}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-surface-muted">Total</p>
          <p className="text-xl font-bold text-brand-900">{total != null ? formatEur(total) : '—'}</p>
        </div>
        <div className="text-right text-xs text-surface-muted">
          <p>{proyecto.m2 != null ? `${proyecto.m2} m²` : '—'}</p>
          <p>{proyecto.ciudad || ''}</p>
        </div>
      </div>
    </div>
  )
}

export default function PresupuestosPage() {
  const navigate = useNavigate()
  const { projects } = useProjects()

  const conPresupuesto = projects.filter((p) => p.presupuestoTotal != null)
  const totalEstudio = conPresupuesto.reduce((sum, p) => sum + p.presupuestoTotal, 0)
  const verificados = conPresupuesto.filter((p) => p.docs?.presupuesto === true).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-brand-900">Presupuestos</h2>
        <p className="mt-1 text-sm text-surface-muted">
          Resumen de presupuestos de todos los proyectos del estudio.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
          <p className="text-2xl font-semibold text-brand-900">{formatEur(totalEstudio)}</p>
          <p className="mt-1 text-sm text-surface-muted">Valor total del estudio</p>
        </div>
        <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
          <p className="text-2xl font-semibold text-brand-900">{conPresupuesto.length}</p>
          <p className="mt-1 text-sm text-surface-muted">Presupuestos generados</p>
        </div>
        <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
          <p className="text-2xl font-semibold text-brand-900">{verificados}</p>
          <p className="mt-1 text-sm text-surface-muted">Verificados</p>
        </div>
      </div>

      {/* Lista de presupuestos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {conPresupuesto.map((p) => (
          <PresupuestoRow key={p.id} proyecto={p} navigate={navigate} />
        ))}
      </div>
    </div>
  )
}