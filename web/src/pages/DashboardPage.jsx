import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard.jsx'
import { useProjects } from '../context/ProjectsContext.jsx'

// Inline icons for the filters toolbar.
function SearchIcon() {
  return (
    <svg
      className="w-4 h-4 text-surface-muted absolute left-3 top-1/2 -translate-y-1/2"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Filter and sort option sets.
const STATE_FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'activo', label: 'Activos' },
  { id: 'borrador', label: 'Borradores' },
  { id: 'completado', label: 'Completados' },
]

const SORT_OPTIONS = [
  { id: 'recientes', label: 'Más recientes' },
  { id: 'antiguos', label: 'Más antiguos' },
  { id: 'presupuesto-mayor', label: 'Presupuesto mayor' },
  { id: 'presupuesto-menor', label: 'Presupuesto menor' },
]

const STATE_SECTIONS = [
  { id: 'activo', label: 'Proyectos activos' },
  { id: 'borrador', label: 'Borradores' },
  { id: 'completado', label: 'Completados' },
]

// Case-insensitive search across project name, client name and city.
function matchesSearch(p, q) {
  const hay = q.trim().toLowerCase()
  if (!hay) return true
  const cliente = typeof p.cliente === 'string' ? p.cliente : p.cliente?.nombre || ''
  return (
    (p.nombre || '').toLowerCase().includes(hay) ||
    cliente.toLowerCase().includes(hay) ||
    (p.ciudad || '').toLowerCase().includes(hay)
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { projects } = useProjects()
  const [query, setQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('todos')
  const [sort, setSort] = useState('recientes')

  // Count per state for the filter badges.
  const counts = useMemo(
    () => ({
      todos: projects.length,
      activo: projects.filter((p) => p.estado === 'activo').length,
      borrador: projects.filter((p) => p.estado === 'borrador').length,
      completado: projects.filter((p) => p.estado === 'completado').length,
    }),
    [projects],
  )

  // Apply search + state filter, then sort.
  const filtered = useMemo(() => {
    const list = projects.filter((p) => matchesSearch(p, query))
    const byState = stateFilter === 'todos' ? list : list.filter((p) => p.estado === stateFilter)
    const sorted = [...byState].sort((a, b) => {
      switch (sort) {
        case 'antiguos':
          return (a.fecha || '').localeCompare(b.fecha || '')
        case 'presupuesto-mayor':
          return (b.presupuestoTotal || 0) - (a.presupuestoTotal || 0)
        case 'presupuesto-menor':
          return (a.presupuestoTotal || 0) - (b.presupuestoTotal || 0)
        default: // recientes
          return (b.fecha || '').localeCompare(a.fecha || '')
      }
    })
    return sorted
  }, [projects, query, stateFilter, sort])

  // Group filtered projects into sections. When a single state filter is
  // active, only that section is shown; otherwise every non-empty section.
  const sections = useMemo(() => {
    if (stateFilter !== 'todos') {
      const label = STATE_SECTIONS.find((s) => s.id === stateFilter)?.label || stateFilter
      return [{ id: stateFilter, label, items: filtered }]
    }
    return STATE_SECTIONS
      .map((s) => ({ ...s, items: filtered.filter((p) => p.estado === s.id) }))
      .filter((s) => s.items.length > 0)
  }, [filtered, stateFilter])

  return (
    <>
      {/* Projects area */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-muted">
            Gestión de proyectos de interiorismo
          </h2>
          <button
            type="button"
            onClick={() => navigate('/nuevo-proyecto')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Nuevo proyecto
          </button>
        </div>

        {/* Filters toolbar */}
        <div className="bg-surface-card border border-brand-100 rounded-xl p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, cliente o ciudad..."
              className="w-full pl-10 pr-4 py-2 text-sm text-brand-900 placeholder:text-surface-muted bg-surface-base border border-brand-100 rounded-lg focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300"
            />
          </div>

          {/* State filter tabs + sort select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {STATE_FILTERS.map((f) => {
                const active = stateFilter === f.id
                const count = counts[f.id] ?? 0
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStateFilter(f.id)}
                    className={
                      active
                        ? 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border bg-brand-700 text-white border-brand-700 transition-colors'
                        : 'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border bg-surface-card text-brand-800 border-brand-100 hover:border-brand-300 transition-colors'
                    }
                  >
                    {f.label}
                    <span className={`text-xs ${active ? 'text-white/70' : 'text-surface-muted'}`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none pl-3 pr-9 py-1.5 text-sm text-brand-900 bg-surface-base border border-brand-100 rounded-lg focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Result counter */}
          <p className="text-xs text-surface-muted">
            Mostrando {filtered.length} de {projects.length} proyectos
          </p>
        </div>

        {/* Grouped sections */}
        {filtered.length === 0 ? (
          <div className="mt-6 text-center py-12 text-sm text-surface-muted">
            No hay proyectos que coincidan con los filtros.
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {sections.map((s) => (
              <section key={s.id}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-700">
                    {s.label}
                  </h3>
                  <span className="text-xs font-medium text-surface-muted bg-brand-50 px-2 py-0.5 rounded-full">
                    {s.items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {s.items.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}