import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import { generarMemoria, memoriaMock, resolveImagenFicha } from '../../../data/memoria-calidades.js'
import { presupuestoMock, baseImponible } from '../../../data/presupuesto.js'
import { formatEur } from '../../../data/projects.js'
import { getClienteNombre } from '../../../utils/project.js'

// MemoriaTab: 8-section quality report (PRD 06).
// Includes project summary text and budget summary.
// Fichas are editable before verification. After verification, read-only.

function FichaMaterialEditable({ ficha, seccionNumero, indiceEnSeccion, onChange, onDelete, readOnly }) {
  // Cada ficha muestra su propia imagen; si no tiene, la de su seccion.
  const imagen = resolveImagenFicha(ficha, seccionNumero, indiceEnSeccion)

  if (readOnly) {
    return (
      <div className="flex gap-4 py-3 border-b border-brand-50 last:border-0">
        <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-brand-50 border border-brand-100">
          <img src={imagen} alt={ficha.nombre} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
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

  return (
    <div className="flex gap-4 py-3 border-b border-brand-50 last:border-0">
      <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-brand-50 border border-brand-100">
        <img src={imagen} alt={ficha.nombre} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={ficha.nombre}
            onChange={(e) => onChange({ ...ficha, nombre: e.target.value })}
            placeholder="Nombre del material"
            className="flex-1 px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-sm font-medium text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
          <button
            type="button"
            onClick={onDelete}
            className="shrink-0 w-6 h-6 rounded-lg text-surface-muted hover:text-state-danger hover:bg-red-50 flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={ficha.marca}
            onChange={(e) => onChange({ ...ficha, marca: e.target.value })}
            placeholder="Marca"
            className="flex-1 px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-xs text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
          <input
            type="text"
            value={ficha.modelo}
            onChange={(e) => onChange({ ...ficha, modelo: e.target.value })}
            placeholder="Modelo"
            className="flex-1 px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-xs text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <input
          type="text"
          value={ficha.descripcion}
          onChange={(e) => onChange({ ...ficha, descripcion: e.target.value })}
          placeholder="Descripción técnica"
          className="w-full px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-xs text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
        <input
          type="text"
          value={ficha.ubicacion}
          onChange={(e) => onChange({ ...ficha, ubicacion: e.target.value })}
          placeholder="Ubicación"
          className="w-full px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-xs text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
      </div>
    </div>
  )
}

function SeccionMemoriaEditable({ seccion, onChange, readOnly }) {
  function updateFicha(idx, nueva) {
    const materiales = [...seccion.materiales]
    materiales[idx] = nueva
    onChange({ ...seccion, materiales })
  }

  function deleteFicha(idx) {
    onChange({ ...seccion, materiales: seccion.materiales.filter((_, i) => i !== idx) })
  }

  function addFicha() {
    const id = `fic-${Date.now()}`
    const indice = seccion.materiales.length
    const imagen = resolveImagenFicha({}, seccion.numero, indice)
    onChange({
      ...seccion,
      materiales: [...seccion.materiales, { id, nombre: '', marca: '', modelo: '', descripcion: '', ubicacion: '', imagen }],
    })
  }

  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-brand-600">{seccion.numero}</span>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-900">{seccion.titulo}</h4>
        </div>
        {!readOnly ? (
          <button type="button" onClick={addFicha} className="text-xs text-brand-700 hover:text-brand-800 font-medium">+ Añadir material</button>
        ) : null}
      </div>
      <div>
        {seccion.materiales.length === 0 ? (
          <p className="text-xs text-surface-muted italic py-4">Sin materiales en esta sección.</p>
        ) : (
          seccion.materiales.map((f, idx) => (
            <FichaMaterialEditable
              key={f.id}
              ficha={f}
              seccionNumero={seccion.numero}
              indiceEnSeccion={idx}
              onChange={(nueva) => updateFicha(idx, nueva)}
              onDelete={() => deleteFicha(idx)}
              readOnly={readOnly}
            />
          ))
        )}
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
  const verificado = proyecto.docs?.memoria === true
  const [secciones, setSecciones] = useState(() => memoriaMock.secciones.map((s) => ({ ...s, materiales: s.materiales.map((m) => ({ ...m })) })))
  const base = baseImponible(presupuestoMock)

  function updateSeccion(idx, nueva) {
    setSecciones((prev) => {
      const next = [...prev]
      next[idx] = nueva
      return next
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-brand-900">Memoria de calidades</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${verificado ? 'bg-state-success/10 text-state-success' : 'bg-state-warning/10 text-state-warning'}`}>
            {verificado ? 'Verificada' : 'Generada, pendiente revisión'}
          </span>
        </div>
        <span className="text-xs text-surface-muted">{memoriaMock.totalCategorias} categorías · {memoriaMock.formato}</span>
      </div>

      {/* Resumen del proyecto */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Resumen del proyecto</h4>
        <p className="text-sm text-brand-800 leading-relaxed">
          El proyecto <strong>{proyecto.nombre}</strong> para el cliente <strong>{getClienteNombre(proyecto)}</strong>
          {' '}consiste en una reforma de estilo <strong>{proyecto.estilo || 'rústico mediterráneo'}</strong>
          {' '}con una superficie total de <strong>{proyecto.m2 != null ? `${proyecto.m2} m²` : '—'}</strong>
          {' '}y <strong>{proyecto.estancias || '—'} estancias</strong>.
          {' '}El trabajo incluye demolición, albañilería, carpintería, fontanería, electricidad,
          {' '}iluminación, pintura y mobiliario a medida.
          {' '}Los materiales seleccionados combinan porcelánico arcilla, microcemento, madera maciza
          {' '}y sanitarios de alta gama, manteniendo la estética mediterránea con iluminación cálida.
        </p>
      </div>

      {/* Resumen del presupuesto */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-700 mb-4">Resumen del presupuesto</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {presupuestoMock.capitulos.map((cap) => (
            <div key={cap.id}>
              <p className="text-xs text-surface-muted">{cap.nombre}</p>
              <p className="text-sm font-semibold text-brand-900">{formatEur(cap.partidas.reduce((sum, p) => sum + p.cantidad * p.precio, 0))}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-brand-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-900">Base imponible (sin IVA)</span>
          <span className="text-lg font-bold text-brand-900">{formatEur(base)}</span>
        </div>
        <p className="mt-2 text-xs text-surface-muted italic">
          Indica cantidad no gravable. IVA e IRPF se aplican al generar la factura.
        </p>
      </div>

      {!verificado ? (
        <p className="text-sm text-surface-muted">Edita, añade o elimina materiales antes de verificar la memoria.</p>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {secciones.map((sec, idx) => (
          <SeccionMemoriaEditable
            key={sec.id}
            seccion={sec}
            onChange={(nueva) => updateSeccion(idx, nueva)}
            readOnly={verificado}
          />
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