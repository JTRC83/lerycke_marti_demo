import { useMemo } from 'react'
import { useProjects } from '../context/ProjectsContext.jsx'
import { useClientes } from '../context/ClientesContext.jsx'
import { formatEur } from '../data/projects.js'
import { getClienteNombre, getCompletitud } from '../utils/project.js'

// DashboardEconomicoPage: statistics about the studio's financials, clients,
// renders and project states.

function StatCard({ valor, etiqueta, subetiqueta, tone = 'brand' }) {
  const tones = {
    brand: 'text-brand-900',
    success: 'text-state-success',
    warning: 'text-state-warning',
    danger: 'text-state-danger',
  }
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
      <p className={`text-2xl font-bold leading-none ${tones[tone]}`}>{valor}</p>
      <p className="mt-1.5 text-sm text-brand-800">{etiqueta}</p>
      {subetiqueta ? <p className="text-xs text-surface-muted">{subetiqueta}</p> : null}
    </div>
  )
}

function ProgressBar({ porcentaje, color = 'bg-brand-500' }) {
  return (
    <div className="w-full h-2.5 bg-surface-base rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${porcentaje}%` }} />
    </div>
  )
}

function EstadoRow({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-brand-800">{label}</span>
        <span className="text-surface-muted">{count} ({pct}%)</span>
      </div>
      <ProgressBar porcentaje={pct} color={color} />
    </div>
  )
}

function ClienteRow({ nombre, facturado, proyectos }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-brand-50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-brand-900 truncate">{nombre}</p>
        <p className="text-xs text-surface-muted">{proyectos} {proyectos === 1 ? 'proyecto' : 'proyectos'}</p>
      </div>
      <span className="text-sm font-semibold text-brand-900 shrink-0 ml-3">{formatEur(facturado)}</span>
    </div>
  )
}

function ProyectoRow({ nombre, cliente, presupuesto, estado, completitud }) {
  const estadoColors = {
    activo: 'bg-state-success/10 text-state-success',
    completado: 'bg-brand-100 text-brand-700',
    borrador: 'bg-surface-base text-surface-muted',
  }
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-brand-50 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-brand-900 truncate">{nombre}</p>
        <p className="text-xs text-surface-muted truncate">{cliente}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-3">
        <span className="text-sm font-semibold text-brand-900">{presupuesto != null ? formatEur(presupuesto) : '—'}</span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${estadoColors[estado] || estadoColors.borrador}`}>{estado}</span>
      </div>
    </div>
  )
}

export default function DashboardEconomicoPage() {
  const { projects } = useProjects()
  const { clientes } = useClientes()

  const stats = useMemo(() => {
    const totalProyectos = projects.length
    const activos = projects.filter((p) => p.estado === 'activo').length
    const borradores = projects.filter((p) => p.estado === 'borrador').length
    const completados = projects.filter((p) => p.estado === 'completado').length

    // Facturación total = suma de presupuestos de proyectos con presupuesto
    const conPresupuesto = projects.filter((p) => p.presupuestoTotal != null)
    const facturadoTotal = conPresupuesto.reduce((sum, p) => sum + p.presupuestoTotal, 0)

    // Gastos estimados = 70% del facturado (costes de obra, materiales, mano de obra)
    // Beneficio = 30% del facturado (honorarios del estudio)
    const gastosEstimados = Math.round(facturadoTotal * 0.70)
    const beneficioEstimado = facturadoTotal - gastosEstimados

    // m² totales
    const m2Totales = projects.reduce((sum, p) => sum + (p.m2 || 0), 0)

    // Renders
    const totalRendersGenerados = projects.reduce((sum, p) => sum + (p.docs?.renders?.generados || 0), 0)
    const totalRendersEsperados = projects.reduce((sum, p) => sum + (p.docs?.renders?.total || 0), 0)

    // Clientes
    const totalClientes = clientes.length
    const clientesConProyectos = clientes.filter((c) =>
      projects.some((p) => getClienteNombre(p) === c.nombre)
    ).length

    // Facturación por cliente
    const facturacionPorCliente = clientes
      .map((c) => {
        const proyectosCliente = projects.filter((p) => getClienteNombre(p) === c.nombre)
        const facturado = proyectosCliente.reduce((sum, p) => sum + (p.presupuestoTotal || 0), 0)
        return { nombre: c.nombre, facturado, proyectos: proyectosCliente.length }
      })
      .filter((c) => c.facturado > 0)
      .sort((a, b) => b.facturado - a.facturado)

    // Proyectos ordenados por presupuesto
    const proyectosOrdenados = [...projects].sort((a, b) => (b.presupuestoTotal || 0) - (a.presupuestoTotal || 0))

    // Documentos completados
    const docsCompletados = projects.reduce((sum, p) => {
      const comp = getCompletitud(p)
      return sum + Object.values(comp).filter(Boolean).length - (comp.completo ? 1 : 0)
    }, 0)

    return {
      totalProyectos, activos, borradores, completados,
      facturadoTotal, gastosEstimados, beneficioEstimado,
      m2Totales, totalRendersGenerados, totalRendersEsperados,
      totalClientes, clientesConProyectos,
      facturacionPorCliente, proyectosOrdenados, docsCompletados,
    }
  }, [projects, clientes])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-brand-900">Dashboard económico</h2>
        <p className="mt-1 text-sm text-surface-muted">
          Estadísticas del estudio: facturación, beneficio, gastos, renders y estado de proyectos.
        </p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard valor={formatEur(stats.facturadoTotal)} etiqueta="Facturación total" subetiqueta={`${stats.totalProyectos} proyectos`} tone="brand" />
        <StatCard valor={formatEur(stats.beneficioEstimado)} etiqueta="Beneficio estimado" subetiqueta="Honorarios del estudio (30%)" tone="success" />
        <StatCard valor={formatEur(stats.gastosEstimados)} etiqueta="Gastos estimados" subetiqueta="Costes de obra y materiales (70%)" tone="warning" />
        <StatCard valor={`${stats.m2Totales.toFixed(1)} m²`} etiqueta="Superficie total" subetiqueta={`${stats.totalProyectos} proyectos`} />
      </div>

      {/* Dos columnas: estado de proyectos + renders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Estado de proyectos */}
        <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Estado de proyectos</h3>
          <div className="space-y-4">
            <EstadoRow label="Activos" count={stats.activos} total={stats.totalProyectos} color="bg-state-success" />
            <EstadoRow label="Borradores" count={stats.borradores} total={stats.totalProyectos} color="bg-state-warning" />
            <EstadoRow label="Completados" count={stats.completados} total={stats.totalProyectos} color="bg-brand-500" />
          </div>
          <div className="mt-4 pt-4 border-t border-brand-50 flex items-center justify-between">
            <span className="text-sm text-surface-muted">Total proyectos</span>
            <span className="text-lg font-bold text-brand-900">{stats.totalProyectos}</span>
          </div>
        </div>

        {/* Renders */}
        <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Renders</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-2xl font-bold text-brand-900">{stats.totalRendersGenerados}</p>
              <p className="text-sm text-surface-muted">Renders generados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-brand-900">{stats.totalRendersEsperados}</p>
              <p className="text-sm text-surface-muted">Renders esperados</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-800">Progreso de renders</span>
              <span className="text-surface-muted">
                {stats.totalRendersEsperados > 0
                  ? `${Math.round((stats.totalRendersGenerados / stats.totalRendersEsperados) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <ProgressBar
              porcentaje={stats.totalRendersEsperados > 0 ? (stats.totalRendersGenerados / stats.totalRendersEsperados) * 100 : 0}
              color="bg-brand-500"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-brand-50">
            <p className="text-sm text-surface-muted">
              {stats.totalRendersGenerados} de {stats.totalRendersEsperados} renders completados
            </p>
          </div>
        </div>
      </div>

      {/* Clientes y proyectos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Facturación por cliente */}
        <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Facturación por cliente</h3>
          {stats.facturacionPorCliente.length > 0 ? (
            <div>
              {stats.facturacionPorCliente.map((c) => (
                <ClienteRow key={c.nombre} nombre={c.nombre} facturado={c.facturado} proyectos={c.proyectos} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-surface-muted">No hay facturación registrada.</p>
          )}
          <div className="mt-4 pt-4 border-t border-brand-50 flex items-center justify-between">
            <span className="text-sm text-surface-muted">Total clientes</span>
            <span className="text-lg font-bold text-brand-900">
              {stats.totalClientes}
              <span className="text-sm font-normal text-surface-muted ml-2">
                ({stats.clientesConProyectos} con proyectos)
              </span>
            </span>
          </div>
        </div>

        {/* Proyectos por presupuesto */}
        <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Proyectos por presupuesto</h3>
          <div>
            {stats.proyectosOrdenados.map((p) => (
              <ProyectoRow
                key={p.id}
                nombre={p.nombre}
                cliente={getClienteNombre(p)}
                presupuesto={p.presupuestoTotal}
                estado={p.estado}
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-brand-50 flex items-center justify-between">
            <span className="text-sm text-surface-muted">Documentos completados</span>
            <span className="text-lg font-bold text-brand-900">{stats.docsCompletados}</span>
          </div>
        </div>
      </div>
    </div>
  )
}