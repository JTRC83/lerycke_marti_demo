import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import { modosGeneracion, generarRenders, rendersMock } from '../../../data/renders.js'

// RendersTab: 8 generation modes + gallery of renders per room (PRD 05).

function ModoCard({ modo, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-surface-card border border-brand-100 rounded-xl p-5 hover:border-brand-300 hover:bg-brand-50/40 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-xs font-semibold">
          {modo.id}
        </span>
        <h4 className="text-sm font-semibold text-brand-900">{modo.nombre}</h4>
      </div>
      <p className="text-xs text-surface-muted">{modo.descripcion}</p>
    </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {modosGeneracion.map((modo) => (
            <ModoCard key={modo.id} modo={modo} onClick={() => handleSelect(modo.id)} />
          ))}
        </div>
      )}
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
    updateProject(proyecto.id, {
      docs: { ...proyecto.docs, renders: { generados: 4, total: 4 } },
    })
  }

  if (!generado) {
    return <RendersEmpty onGenerate={() => setGenerado(true)} />
  }
  return <RendersGallery proyecto={proyecto} onVerify={handleVerify} />
}