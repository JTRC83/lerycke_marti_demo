import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import { generarMemoria, memoriaMock } from '../../../data/memoria-calidades.js'

// MemoriaTab: 8-section quality report (PRD 06).

function FichaMaterial({ ficha }) {
  return (
    <div className="flex gap-4 py-3 border-b border-brand-50 last:border-0">
      <div className="w-16 h-16 shrink-0 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-[10px] text-surface-muted text-center px-1">
        [ imagen material ]
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-brand-900">{ficha.nombre}</p>
        <p className="text-xs text-surface-muted">{ficha.marca} · {ficha.modelo}</p>
        <p className="mt-1 text-xs text-brand-800">{ficha.descripcion}</p>
        <p className="mt-1 text-xs text-surface-muted">Ubicación: {ficha.ubicacion}</p>
      </div>
    </div>
  )
}

function SeccionMemoria({ seccion }) {
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-brand-600">{seccion.numero}</span>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-900">{seccion.titulo}</h4>
      </div>
      <div>
        {seccion.materiales.map((f) => (
          <FichaMaterial key={f.id} ficha={f} />
        ))}
      </div>
    </div>
  )
}

function MemoriaEmpty({ onGenerate }) {
  const [cargando, setCargando] = useState(false)

  async function handleGenerate() {
    setCargando(true)
    await generarMemoria()
    setCargando(false)
    onGenerate()
  }

  const fuentes = ['Plan maestro', 'Presupuesto', 'Renders', 'Materiales']

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold text-brand-900">Memoria de calidades</h3>
        <span className="px-3 py-1 rounded-full bg-surface-base text-surface-muted text-xs font-medium">No generada</span>
      </div>

      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <p className="text-sm text-brand-800">La memoria recopila automáticamente todo el trabajo realizado:</p>
        <ul className="mt-4 space-y-2">
          {fuentes.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-brand-800">
              <svg className="w-4 h-4 text-state-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-surface-muted">Formato #designstudio · A4 horizontal · Estética Lerycke Martí Design</p>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={cargando}
        className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-60 transition-colors"
      >
        {cargando ? 'Generando memoria...' : 'Generar memoria de calidades'}
      </button>
    </div>
  )
}

function MemoriaGenerated({ proyecto, onVerify }) {
  const memoria = memoriaMock
  const verificado = proyecto.docs?.memoria === true

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-brand-900">Memoria de calidades</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${verificado ? 'bg-state-success/10 text-state-success' : 'bg-state-warning/10 text-state-warning'}`}>
            {verificado ? 'Verificada' : 'Generada, pendiente revisión'}
          </span>
        </div>
        <span className="text-xs text-surface-muted">{memoria.totalCategorias} categorías · {memoria.formato}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {memoria.secciones.map((sec) => (
          <SeccionMemoria key={sec.id} seccion={sec} />
        ))}
      </div>

      {!verificado ? (
        <button
          type="button"
          onClick={onVerify}
          className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          Verificar memoria
        </button>
      ) : null}
    </div>
  )
}

export default function MemoriaTab({ proyecto }) {
  const { updateProject } = useProjects()
  const [generado, setGenerado] = useState(proyecto.docs?.memoria === true)

  function handleVerify() {
    updateProject(proyecto.id, { docs: { ...proyecto.docs, memoria: true } })
  }

  if (!generado) {
    return <MemoriaEmpty onGenerate={() => setGenerado(true)} />
  }
  return <MemoriaGenerated proyecto={proyecto} onVerify={handleVerify} />
}