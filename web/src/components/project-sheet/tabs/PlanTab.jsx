import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import { generarPlan, planMaestroMock } from '../../../data/plan-maestro.js'
import { formatEur } from '../../../data/projects.js'
import { medId, formatFechaEs } from '../../../utils/format.js'
import { PREGUNTAS_CHAT } from '../../../data/chat-preguntas.js'
import MediaUploader from '../../new-project/MediaUploader.jsx'

// PlanTab: IA-generated master plan (PRD 03a).
// Flow: historico (checkboxes) -> referencias -> chat IA -> documento maestro -> generar plan -> plan editable.

// --- Icon helpers ---
function TypeIcon({ tipo }) {
  if (tipo === 'imagen')
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
  if (tipo === 'nota_voz')
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v4" /></svg>
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" /><path d="M9 21h6" /><path d="M12 3v18" /></svg>
}

const TYPE_LABELS = {
  imagen: 'Imagen',
  nota_voz: 'Nota de voz',
  texto: 'Texto',
  datos_editados: 'Datos editados',
}

function DocCheckbox({ entry, checked, onToggle }) {
  const label = TYPE_LABELS[entry.tipo] || 'Documento'
  const preview = entry.tipo === 'imagen'
    ? entry.contenido?.nombre || 'Imagen'
    : entry.tipo === 'nota_voz'
      ? entry.contenido?.nombre || 'Nota de voz'
      : entry.tipo === 'texto'
        ? (entry.contenido?.texto || '').slice(0, 60) + (entry.contenido?.texto?.length > 60 ? '...' : '')
        : entry.contenido?.resumen || 'Entrada'

  return (
    <label className="flex items-start gap-3 py-2.5 border-b border-brand-50 last:border-0 cursor-pointer hover:bg-brand-50/40 px-2 -mx-2 rounded-lg transition-colors">
      <input type="checkbox" checked={checked} onChange={onToggle} className="mt-0.5 w-4 h-4 rounded text-brand-700 focus:ring-brand-500/30 border-brand-300" />
      <div className="flex items-center gap-1.5 text-surface-muted shrink-0"><TypeIcon tipo={entry.tipo} /></div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-brand-800">{label}</span>
          <span className="text-[10px] text-surface-muted">{formatFechaEs(entry.fecha)}</span>
        </div>
        <p className="text-xs text-surface-muted truncate">{preview}</p>
      </div>
    </label>
  )
}

// --- Chat component ---
function ChatIA({ respuestas, setRespuestas, onGenerarDocumento, docGenerado }) {
  const [indicePregunta, setIndicePregunta] = useState(0)
  const [input, setInput] = useState('')

  const preguntaActual = PREGUNTAS_CHAT[indicePregunta]
  const esUltima = indicePregunta === PREGUNTAS_CHAT.length - 1

  function responder() {
    if (!input.trim()) return
    const nuevasRespuestas = {
      ...respuestas,
      [preguntaActual.id]: { categoria: preguntaActual.categoria, pregunta: preguntaActual.pregunta, respuesta: input.trim() },
    }
    setRespuestas(nuevasRespuestas)
    setInput('')
    if (!esUltima) {
      setIndicePregunta((prev) => prev + 1)
    }
  }

  function saltar() {
    setInput('')
    if (!esUltima) setIndicePregunta((prev) => prev + 1)
  }

  function volver() {
    if (indicePregunta > 0) {
      setIndicePregunta((prev) => prev - 1)
      setInput(respuestas[PREGUNTAS_CHAT[indicePregunta - 1].id]?.respuesta || '')
    }
  }

  const respondidas = Object.keys(respuestas).length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-surface-card border border-brand-100 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        {/* Header del chat */}
        <div className="flex items-center justify-between p-5 border-b border-brand-100">
          <div>
            <h4 className="text-base font-semibold text-brand-900">Chat IA — Plan maestro</h4>
            <p className="text-xs text-surface-muted mt-0.5">
              Responde las preguntas para que la IA genere el plan maestro del proyecto.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
            {respondidas}/{PREGUNTAS_CHAT.length} respuestas
          </span>
        </div>

        {/* Progreso */}
        <div className="px-5 pt-4">
          <div className="w-full h-2 bg-surface-base rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${(respondidas / PREGUNTAS_CHAT.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Mensajes: scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {/* Mensaje IA */}
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-semibold shrink-0">IA</div>
            <div className="bg-brand-50 rounded-xl rounded-tl-sm px-4 py-3 max-w-full">
              <p className="text-xs font-medium text-brand-700 mb-0.5">{preguntaActual.categoria}</p>
              <p className="text-sm text-brand-900">{preguntaActual.pregunta}</p>
            </div>
          </div>

          {/* Respuestas anteriores */}
          {Object.entries(respuestas).map(([id, r]) => (
            <div key={id} className="flex gap-3 justify-end">
              <div className="bg-surface-base rounded-xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                <p className="text-xs font-medium text-surface-muted mb-0.5">{r.categoria}</p>
                <p className="text-sm text-brand-800">{r.respuesta}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-xs font-semibold shrink-0">U</div>
            </div>
          ))}
        </div>

        {/* Input: fijo abajo */}
        <div className="p-5 border-t border-brand-100 space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={preguntaActual.placeholder}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition resize-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {indicePregunta > 0 ? (
                <button type="button" onClick={volver} className="px-4 py-2.5 rounded-xl border border-brand-200 text-brand-800 text-sm hover:bg-surface-base transition-colors">
                  Anterior
                </button>
              ) : null}
              <button type="button" onClick={saltar} className="px-4 py-2.5 rounded-xl border border-brand-200 text-surface-muted text-sm hover:bg-surface-base transition-colors">
                Saltar
              </button>
            </div>
            {esUltima ? (
              <button
                type="button"
                onClick={() => {
                  if (input.trim()) {
                    setRespuestas({ ...respuestas, [preguntaActual.id]: { categoria: preguntaActual.categoria, pregunta: preguntaActual.pregunta, respuesta: input.trim() } })
                    setInput('')
                  }
                  onGenerarDocumento()
                }}
                className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
              >
                Generar plan maestro con IA
              </button>
            ) : (
              <button
                type="button"
                onClick={responder}
                disabled={!input.trim()}
                className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-50 transition-colors"
            >
              Responder
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Documento maestro generado ---
function DocumentoMaestro({ respuestas, onRegenerar, onGenerarPlan, cargandoPlan }) {
  const entradas = Object.entries(respuestas)

  return (
    <div className="space-y-4">
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-brand-900">Documento maestro generado</h4>
            <p className="text-xs text-surface-muted mt-0.5">
              {entradas.length} secciones recopiladas. Revisa el contenido antes de generar el plan.
            </p>
          </div>
          <button type="button" onClick={onRegenerar} className="text-xs text-brand-700 hover:text-brand-800 font-medium">
            Editar respuestas
          </button>
        </div>

        <div className="space-y-4">
          {entradas.map(([id, r]) => (
            <div key={id} className="border-b border-brand-50 last:border-0 pb-3 last:pb-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-1">{r.categoria}</p>
              <p className="text-sm text-brand-900">{r.respuesta}</p>
              <p className="text-xs text-surface-muted mt-1 italic">Pregunta: {r.pregunta}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerarPlan}
        disabled={cargandoPlan}
        className="w-full px-5 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 disabled:opacity-60 transition-colors"
      >
        {cargandoPlan ? 'Generando plan con IA...' : 'Generar plan maestro con IA'}
      </button>
    </div>
  )
}

// --- Plan generado editable ---
function EditableEstancia({ estancia, onChange, onDelete }) {
  return (
    <div className="grid grid-cols-12 gap-2 items-center py-2 border-b border-brand-50 last:border-0">
      <input
        type="text"
        value={estancia.nombre}
        onChange={(e) => onChange({ ...estancia, nombre: e.target.value })}
        className="col-span-4 px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <input
        type="text"
        value={estancia.tag}
        onChange={(e) => onChange({ ...estancia, tag: e.target.value })}
        className="col-span-2 px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-xs text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <input
        type="text"
        value={String(estancia.m2)}
        onChange={(e) => onChange({ ...estancia, m2: parseFloat(e.target.value) || 0 })}
        className="col-span-2 px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-sm text-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <input
        type="text"
        value={estancia.tipoReforma}
        onChange={(e) => onChange({ ...estancia, tipoReforma: e.target.value })}
        className="col-span-2 px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-xs text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <input
        type="text"
        value={estancia.detalle}
        onChange={(e) => onChange({ ...estancia, detalle: e.target.value })}
        className="col-span-1 px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-xs text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      />
      <button type="button" onClick={onDelete} className="col-span-1 text-surface-muted hover:text-state-danger flex items-center justify-center">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  )
}

function PlanGenerated({ proyecto, onVerify }) {
  const verificado = proyecto.docs?.plan === true
  const [plan, setPlan] = useState(() => ({
    estancias: planMaestroMock.estancias.map((e) => ({ ...e })),
    trabajos: [...planMaestroMock.trabajos],
    materiales: planMaestroMock.materiales.map((m) => ({ ...m })),
    analisisEstilo: planMaestroMock.analisisEstilo,
    estimacionCostes: planMaestroMock.estimacionCostes,
    desgloseCostes: planMaestroMock.desgloseCostes.map((d) => ({ ...d })),
    m2Totales: planMaestroMock.m2Totales,
  }))

  function updateEstancia(idx, nueva) {
    setPlan((prev) => {
      const estancias = [...prev.estancias]
      estancias[idx] = nueva
      return { ...prev, estancias }
    })
  }

  function deleteEstancia(idx) {
    setPlan((prev) => ({ ...prev, estancias: prev.estancias.filter((_, i) => i !== idx) }))
  }

  function addEstancia() {
    setPlan((prev) => ({
      ...prev,
      estancias: [...prev.estancias, { id: `est-${Date.now()}`, nombre: 'Nueva estancia', tag: '', m2: 0, tipoReforma: '', detalle: '' }],
    }))
  }

  function updateMaterial(idx, nuevo) {
    setPlan((prev) => {
      const materiales = [...prev.materiales]
      materiales[idx] = nuevo
      return { ...prev, materiales }
    })
  }

  function deleteMaterial(idx) {
    setPlan((prev) => ({ ...prev, materiales: prev.materiales.filter((_, i) => i !== idx) }))
  }

  function addMaterial() {
    setPlan((prev) => ({
      ...prev,
      materiales: [...prev.materiales, { id: `mat-${Date.now()}`, categoria: 'Nueva categoría', descripcion: '', marca: '', modelo: '', comentarios: '' }],
    }))
  }

  function toggleTrabajo(t) {
    setPlan((prev) => {
      if (prev.trabajos.includes(t)) {
        return { ...prev, trabajos: prev.trabajos.filter((x) => x !== t) }
      }
      return { ...prev, trabajos: [...prev.trabajos, t] }
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-brand-900">Plan maestro generado</h3>
          <p className="mt-1 text-sm text-surface-muted">Edita cualquier campo directamente. Los cambios se guardan en memoria.</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${verificado ? 'bg-state-success/10 text-state-success' : 'bg-state-warning/10 text-state-warning'}`}>
          {verificado ? 'Verificado' : 'Generado, pendiente de revisión'}
        </span>
      </div>

      {/* Resumen del proyecto */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Resumen del proyecto</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-semibold text-brand-900 leading-none">{plan.estancias.length}</p>
            <p className="mt-1 text-xs text-surface-muted">Estancias</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-brand-900 leading-none">{plan.m2Totales} m²</p>
            <p className="mt-1 text-xs text-surface-muted">Superficie total</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-brand-900 leading-none">{proyecto.estilo || planMaestroMock.estiloGeneral || '—'}</p>
            <p className="mt-1 text-xs text-surface-muted">Estilo</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-brand-900 leading-none">{plan.trabajos.length}</p>
            <p className="mt-1 text-xs text-surface-muted">Trabajos</p>
          </div>
        </div>
      </div>

      {/* Estancias editables */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted">Estancias</h4>
          <button type="button" onClick={addEstancia} className="text-sm text-brand-700 hover:text-brand-800">+ Añadir estancia</button>
        </div>
        {/* Contenedor con scroll horizontal para que las columnas no se compriman */}
        <div className="overflow-x-auto -mx-6 px-6 pb-1">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider text-surface-muted mb-1 px-1">
              <span className="col-span-4">Nombre</span>
              <span className="col-span-2">Tag</span>
              <span className="col-span-2">m²</span>
              <span className="col-span-2">Tipo reforma</span>
              <span className="col-span-1">Detalle</span>
              <span className="col-span-1" />
            </div>
            {plan.estancias.map((est, idx) => (
              <EditableEstancia
                key={est.id}
                estancia={est}
                onChange={(nueva) => updateEstancia(idx, nueva)}
                onDelete={() => deleteEstancia(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trabajos a realizar */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Trabajos a realizar</h4>
        <div className="flex flex-wrap gap-2">
          {plan.trabajos.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTrabajo(t)}
              className="px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-medium hover:bg-brand-100 transition-colors"
            >
              {t}
            </button>
          ))}
          <button type="button" className="px-3 py-1 rounded-full border border-brand-200 text-brand-700 text-xs hover:bg-brand-50">+ Añadir trabajo</button>
        </div>
      </div>

      {/* Acabados y materiales sugeridos */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted">Acabados y materiales sugeridos</h4>
          <button type="button" onClick={addMaterial} className="text-sm text-brand-700 hover:text-brand-800">+ Añadir material</button>
        </div>
        <div className="space-y-4">
          {plan.materiales.map((mat, idx) => (
            <div key={mat.id} className="border-b border-brand-50 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={mat.categoria}
                  onChange={(e) => updateMaterial(idx, { ...mat, categoria: e.target.value })}
                  className="text-sm font-medium text-brand-900 bg-transparent border-b border-transparent focus:border-brand-200 focus:outline-none flex-1"
                />
                <button type="button" onClick={() => deleteMaterial(idx)} className="text-surface-muted hover:text-state-danger shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <input
                type="text"
                value={mat.descripcion}
                onChange={(e) => updateMaterial(idx, { ...mat, descripcion: e.target.value })}
                className="mt-1 w-full text-sm text-brand-800 bg-transparent border-b border-transparent focus:border-brand-200 focus:outline-none"
              />
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={mat.marca}
                  onChange={(e) => updateMaterial(idx, { ...mat, marca: e.target.value })}
                  placeholder="Marca"
                  className="text-xs text-surface-muted bg-transparent border-b border-transparent focus:border-brand-200 focus:outline-none flex-1"
                />
                <input
                  type="text"
                  value={mat.modelo}
                  onChange={(e) => updateMaterial(idx, { ...mat, modelo: e.target.value })}
                  placeholder="Modelo"
                  className="text-xs text-surface-muted bg-transparent border-b border-transparent focus:border-brand-200 focus:outline-none flex-1"
                />
              </div>
              <input
                type="text"
                value={mat.comentarios}
                onChange={(e) => updateMaterial(idx, { ...mat, comentarios: e.target.value })}
                placeholder="Comentarios..."
                className="mt-2 w-full px-3 py-1.5 rounded-lg border border-brand-100 bg-surface-base text-sm text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Análisis de estilo */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-3">Análisis de estilo</h4>
        <textarea
          value={plan.analisisEstilo}
          onChange={(e) => setPlan((prev) => ({ ...prev, analisisEstilo: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition resize-y"
        />
      </div>

      {/* Estimación de costes y gastos (orientativa, con desglose) */}
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-700">Estimación de costes y gastos</h4>
            <p className="text-xs text-surface-muted mt-0.5">
              Estimación orientativa basada en el plan. El ajuste económico detallado se realiza en la siguiente fase.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPlan((prev) => ({
              ...prev,
              desgloseCostes: [...prev.desgloseCostes, { id: `est-d-${Date.now()}`, concepto: '', importe: 0 }],
            }))}
            className="text-sm text-brand-700 hover:text-brand-800 font-medium"
          >
            + Añadir partida
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-surface-muted border-b border-brand-200">
              <th className="px-2 py-2 font-medium">Concepto</th>
              <th className="px-2 py-2 font-medium text-right w-32">Importe estimado</th>
              <th className="px-2 py-2 w-8" />
            </tr>
          </thead>
          <tbody>
            {plan.desgloseCostes.map((d, idx) => (
              <tr key={d.id} className="border-b border-brand-100 last:border-0">
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={d.concepto}
                    onChange={(e) => {
                      const desglose = [...plan.desgloseCostes]
                      desglose[idx] = { ...d, concepto: e.target.value }
                      setPlan((prev) => ({ ...prev, desgloseCostes: desglose }))
                    }}
                    className="w-full px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    step="0.01"
                    value={d.importe}
                    onChange={(e) => {
                      const desglose = [...plan.desgloseCostes]
                      desglose[idx] = { ...d, importe: parseFloat(e.target.value) || 0 }
                      setPlan((prev) => ({ ...prev, desgloseCostes: desglose }))
                    }}
                    className="w-full px-2 py-1.5 rounded-lg border border-brand-100 bg-white text-sm text-brand-800 text-right focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                  />
                </td>
                <td className="px-2 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => setPlan((prev) => ({ ...prev, desgloseCostes: prev.desgloseCostes.filter((_, i) => i !== idx) }))}
                    className="w-6 h-6 rounded-lg text-surface-muted hover:text-state-danger hover:bg-red-50 flex items-center justify-center transition-colors inline-flex"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-brand-300">
              <td className="px-2 py-3 text-right text-sm font-semibold text-brand-900">Total estimación de costes y gastos</td>
              <td className="px-2 py-3 text-right font-bold text-brand-900">
                {formatEur(plan.desgloseCostes.reduce((sum, d) => sum + (d.importe || 0), 0))}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Verificar */}
      {!verificado ? (
        <button
          type="button"
          onClick={onVerify}
          className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          Verificar plan
        </button>
      ) : null}
    </div>
  )
}

// --- Main PlanTab ---
export default function PlanTab({ proyecto, onTabChange }) {
  const { updateProject } = useProjects()
  const [fase, setFase] = useState('input') // 'input' | 'documento' | 'generando' | 'generado'
  const [multimedia, setMultimedia] = useState(proyecto.multimedia || [])
  const [seleccionados, setSeleccionados] = useState(() => new Set((proyecto.multimedia || []).map((m) => m.id)))
  const [respuestas, setRespuestas] = useState({})
  const [cargandoPlan, setCargandoPlan] = useState(false)
  const [textoNota, setTextoNota] = useState('')

  function toggleSeleccion(id) {
    setSeleccionados((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleTodos() {
    setSeleccionados((prev) => {
      if (prev.size === multimedia.length) return new Set()
      return new Set(multimedia.map((m) => m.id))
    })
  }

  function addMultimediaEntry(entry) {
    const nueva = { id: medId(), tipo: entry.tipo, fecha: new Date().toISOString(), contenido: entry.contenido }
    setMultimedia((prev) => [nueva, ...prev])
    setSeleccionados((prev) => new Set([...prev, nueva.id]))
  }

  function removeMultimediaEntry(id) {
    setMultimedia((prev) => prev.filter((m) => m.id !== id))
    setSeleccionados((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function addTextoNota() {
    const texto = textoNota.trim()
    if (!texto) return
    addMultimediaEntry({ tipo: 'texto', contenido: { texto } })
    setTextoNota('')
  }

  function handleGenerarDocumento() {
    handleGenerarPlan()
  }

  async function handleGenerarPlan() {
    setCargandoPlan(true)
    const docsIncluidos = multimedia.filter((m) => seleccionados.has(m.id))
    await generarPlan({ respuestas, multimedia: docsIncluidos })
    setCargandoPlan(false)
    setFase('generado')
  }

  function handleVerify() {
    updateProject(proyecto.id, { docs: { ...proyecto.docs, plan: true } })
  }

  // --- Vista: plan generado ---
  if (fase === 'generado' || proyecto.docs?.plan === true) {
    return <PlanGenerated proyecto={proyecto} onVerify={handleVerify} />
  }

  // --- Vista: input (histórico + referencias + notas + chat) ---
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-brand-900">Plan maestro</h3>
        <p className="mt-1 text-sm text-surface-muted">
          Selecciona los documentos del histórico, sube referencias y responde el chat para que la IA genere el plan más completo posible.
        </p>
      </div>

      {/* Histórico con checkboxes (arriba) */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-brand-900">Histórico</h4>
            <p className="text-xs text-surface-muted mt-0.5">
              Selecciona los documentos que la IA debe usar para generar el plan.
            </p>
          </div>
          {multimedia.length > 0 ? (
            <button type="button" onClick={toggleTodos} className="text-xs text-brand-700 hover:text-brand-800 font-medium">
              {seleccionados.size === multimedia.length ? 'Quitar todos' : 'Seleccionar todos'}
            </button>
          ) : null}
        </div>
        {multimedia.length === 0 ? (
          <p className="text-sm text-surface-muted">Aún no se ha añadido documentación. Las imágenes, notas de voz y texto que subas aparecerán aquí.</p>
        ) : (
          <div>
            {multimedia.map((entry) => (
              <DocCheckbox key={entry.id} entry={entry} checked={seleccionados.has(entry.id)} onToggle={() => toggleSeleccion(entry.id)} />
            ))}
            <p className="mt-3 text-xs text-surface-muted">{seleccionados.size} de {multimedia.length} documentos seleccionados</p>
          </div>
        )}
      </div>

      {/* Referencias (imágenes) */}
      <div>
        <h4 className="text-sm font-semibold text-brand-900 mb-3">Referencias</h4>
        <MediaUploader
          imagenes={multimedia.filter((m) => m.tipo === 'imagen')}
          onAdd={addMultimediaEntry}
          onRemove={removeMultimediaEntry}
        />
      </div>

      {/* Notas de texto */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-brand-900 mb-1">Notas de texto</h4>
        <p className="text-xs text-surface-muted mb-3">
          Ideas y sugerencias para complementar las peticiones del cliente. Se añadirán al histórico.
        </p>
        <textarea
          value={textoNota}
          onChange={(e) => setTextoNota(e.target.value)}
          placeholder="Ideas y sugerencias para complementar las peticiones del cliente..."
          rows={8}
          className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition resize-y"
        />
        <button
          type="button"
          onClick={addTextoNota}
          disabled={!textoNota.trim()}
          className="mt-3 px-4 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-50 transition-colors"
        >
          Añadir nota
        </button>
      </div>

      {/* Chat IA */}
      <ChatIA
        respuestas={respuestas}
        setRespuestas={setRespuestas}
        onGenerarDocumento={handleGenerarDocumento}
        docGenerado={fase === 'documento'}
      />
    </div>
  )
}