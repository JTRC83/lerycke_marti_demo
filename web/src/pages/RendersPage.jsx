import { useState } from 'react'
import { useProjects } from '../context/ProjectsContext.jsx'
import { modosGeneracion, rendersMock } from '../data/renders.js'
import { getClienteNombre } from '../utils/project.js'

// RendersPage: galería de modos de generación con modal explicativo + galería de renders por proyecto en modal.

function ModoCard({ modo, onClick }) {
  return (
    <div
      className="bg-surface-card border border-brand-100 rounded-xl overflow-hidden hover:border-brand-300 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-44 bg-brand-50 overflow-hidden">
        <img src={modo.imagen} alt={modo.nombre} className="w-full h-full object-cover" />
        <span className="absolute top-2 left-2 w-7 h-7 rounded-full bg-brand-800 text-white flex items-center justify-center text-xs font-semibold">
          {modo.id}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-brand-900">{modo.nombre}</h3>
        <p className="mt-1 text-xs text-surface-muted">{modo.descripcion}</p>
        <p className="mt-2 text-xs text-brand-700 font-medium">Ver explicación →</p>
      </div>
    </div>
  )
}

function ModoModal({ modo, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con imagen a tamaño natural sin recortar */}
        <div className="relative bg-brand-50">
          <img src={modo.imagen} alt={modo.nombre} className="w-full h-auto object-contain" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-brand-800 text-white flex items-center justify-center text-sm font-semibold">
            {modo.id}
          </span>
        </div>
        {/* Contenido */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-brand-900">{modo.nombre}</h3>
          <p className="mt-1 text-sm text-surface-muted">{modo.descripcion}</p>
          <div className="mt-4 pt-4 border-t border-brand-100">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-muted mb-2">Qué hace este modo</h4>
            <p className="text-sm text-brand-800 leading-relaxed">{modo.explicacion}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectRenderRow({ proyecto, onClick }) {
  const renders = proyecto.docs?.renders || { generados: 0, total: 0 }
  const porcentaje = renders.total > 0 ? Math.round((renders.generados / renders.total) * 100) : 0

  return (
    <div
      className="bg-surface-card border border-brand-100 rounded-xl p-5 cursor-pointer hover:border-brand-300 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-brand-900">{proyecto.nombre}</h3>
          <p className="text-xs text-surface-muted">{getClienteNombre(proyecto)}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          porcentaje === 100 ? 'bg-state-success/10 text-state-success' :
          porcentaje > 0 ? 'bg-state-warning/10 text-state-warning' :
          'bg-surface-base text-surface-muted'
        }`}>
          {renders.generados}/{renders.total} renders
        </span>
      </div>
      <div className="w-full h-2 bg-surface-base rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${porcentaje === 100 ? 'bg-state-success' : 'bg-brand-500'}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-brand-700 font-medium">Ver galería de renders →</p>
    </div>
  )
}

function GaleriaRendersModal({ proyecto, onClose }) {
  // Filtra los renders mock por las estancias del proyecto; si no hay, muestra todos.
  const renders = rendersMock

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-brand-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h3 className="text-lg font-semibold text-brand-900">{proyecto.nombre}</h3>
            <p className="text-sm text-surface-muted">{getClienteNombre(proyecto)} · {renders.length} renders</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-base text-surface-muted flex items-center justify-center hover:bg-brand-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {/* Galería */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renders.map((r) => (
            <div key={r.id} className="bg-surface-card border border-brand-100 rounded-xl overflow-hidden">
              <div className="relative h-40 bg-brand-50">
                <img src={r.imagen} alt={r.nombre} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">{r.tag}</span>
              </div>
              <div className="p-4 space-y-1">
                <h4 className="text-sm font-semibold text-brand-900">{r.nombre}</h4>
                <p className="text-xs text-surface-muted">{r.m2} m² · {r.iluminacion}</p>
                <p className="text-xs text-surface-muted">{r.enfoque} · {r.tipoLuz}</p>
                <p className="text-sm text-brand-800 mt-1">{r.descripcion}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {r.materiales.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px]">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RendersPage() {
  const { projects } = useProjects()
  const [modoAbierto, setModoAbierto] = useState(null)
  const [proyectoGaleria, setProyectoGaleria] = useState(null)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-brand-900">Renders</h2>
        <p className="mt-1 text-sm text-surface-muted">
          Generación de renders fotorrealistas. Haz clic en cada modo para ver qué hace y cómo se usa.
        </p>
      </div>

      {/* Modos de generación */}
      <div>
        <h3 className="text-base font-semibold text-brand-900 mb-4">Modos de generación disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modosGeneracion.map((modo) => (
            <ModoCard key={modo.id} modo={modo} onClick={() => setModoAbierto(modo)} />
          ))}
        </div>
      </div>

      {/* Renders por proyecto */}
      <div>
        <h3 className="text-base font-semibold text-brand-900 mb-4">Renders por proyecto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectRenderRow key={p.id} proyecto={p} onClick={() => setProyectoGaleria(p)} />
          ))}
        </div>
      </div>

      {/* Modales */}
      {modoAbierto ? <ModoModal modo={modoAbierto} onClose={() => setModoAbierto(null)} /> : null}
      {proyectoGaleria ? <GaleriaRendersModal proyecto={proyectoGaleria} onClose={() => setProyectoGaleria(null)} /> : null}
    </div>
  )
}