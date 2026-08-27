import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import { modosGeneracion, generarRenders, rendersMock } from '../../../data/renders.js'

// RendersTab: same look as the sidebar Renders page — modo cards with images,
// modal explicativo, gallery of renders per room.

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
        <h4 className="text-sm font-semibold text-brand-900">{modo.nombre}</h4>
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
        <div className="relative bg-brand-50">
          <img src={modo.imagen} alt={modo.nombre} className="w-full h-auto object-contain" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <span className="absolute top-3 left-3 w-8 h-8 rounded-full bg-brand-800 text-white flex items-center justify-center text-sm font-semibold">{modo.id}</span>
        </div>
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

function RenderCard({ render }) {
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl overflow-hidden">
      <div className="relative h-48 bg-brand-50">
        <img src={render.imagen} alt={render.nombre} className="w-full h-full object-cover" />
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium">{render.tag}</span>
      </div>
      <div className="p-4 space-y-2">
        <h4 className="text-sm font-semibold text-brand-900">{render.nombre}</h4>
        <p className="text-xs text-surface-muted">{render.m2} m² · {render.iluminacion}</p>
        <p className="text-xs text-surface-muted">{render.enfoque} · {render.tipoLuz}</p>
        <p className="text-sm text-brand-800">{render.descripcion}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {render.materiales.map((m) => (
            <span key={m} className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-[10px]">{m}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function RendersEmpty({ onGenerate }) {
  const [cargando, setCargando] = useState(false)
  const [modoAbierto, setModoAbierto] = useState(null)

  async function handleSelect(modoId) {
    setCargando(true)
    await generarRenders(modoId)
    setCargando(false)
    onGenerate()
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-brand-900">Renders</h3>
        <span className="px-3 py-1 rounded-full bg-surface-base text-surface-muted text-xs font-medium">No generados</span>
      </div>
      <p className="text-sm text-surface-muted">Selecciona el tipo de generación de imagen</p>

      {cargando ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-brand-700">Generando renders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modosGeneracion.map((modo) => (
            <ModoCard key={modo.id} modo={modo} onClick={() => setModoAbierto(modo)} />
          ))}
        </div>
      )}

      {/* Modal explicativo */}
      {modoAbierto ? (
        <ModoModal modo={modoAbierto} onClose={() => setModoAbierto(null)} />
      ) : null}

      {/* Botón generar (simplificado: al pulsar genera directamente) */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => handleSelect(1)}
          disabled={cargando}
          className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-60 transition-colors"
        >
          {cargando ? 'Generando...' : 'Generar renders'}
        </button>
      </div>
    </div>
  )
}

function RendersGallery({ proyecto, onVerify }) {
  const verificado = proyecto.docs?.renders?.generados === proyecto.docs?.renders?.total && proyecto.docs?.renders?.total > 0

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-brand-900">Renders</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${verificado ? 'bg-state-success/10 text-state-success' : 'bg-state-warning/10 text-state-warning'}`}>
            {verificado ? 'Verificados' : 'Generados, pendiente revisión'}
          </span>
        </div>
        <button type="button" className="px-4 py-2 rounded-xl border border-brand-200 text-brand-800 text-sm font-medium hover:bg-surface-base transition-colors">
          + Nuevo render
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rendersMock.map((r) => (
          <RenderCard key={r.id} render={r} />
        ))}
      </div>

      {!verificado ? (
        <button
          type="button"
          onClick={onVerify}
          className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          Verificar renders
        </button>
      ) : null}
    </div>
  )
}

export default function RendersTab({ proyecto }) {
  const { updateProject } = useProjects()
  const generados = proyecto.docs?.renders?.generados > 0
  const [generado, setGenerado] = useState(generados)

  function handleVerify() {
    const docs = proyecto.docs || {}
    updateProject(proyecto.id, {
      docs: { ...docs, renders: { generados: 4, total: 4 } },
    })
  }

  if (!generado) {
    return <RendersEmpty onGenerate={() => setGenerado(true)} />
  }
  return <RendersGallery proyecto={proyecto} onVerify={handleVerify} />
}