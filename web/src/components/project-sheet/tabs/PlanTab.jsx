import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import { generarPlan, planMaestroMock } from '../../../data/plan-maestro.js'
import { formatEur } from '../../../data/projects.js'
import { medId, formatFechaEs } from '../../../utils/format.js'
import MediaUploader from '../../new-project/MediaUploader.jsx'

// PlanTab: IA-generated master plan (PRD 03a).
// Two views: input (texto/voz/imagenes) and generated (estancias, trabajos, materiales).

// Icon per media type for the checkbox list.
function TypeIcon({ tipo }) {
  if (tipo === 'imagen') {
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
  }
  if (tipo === 'nota_voz') {
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><path d="M12 19v4" /></svg>
  }
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
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-0.5 w-4 h-4 rounded text-brand-700 focus:ring-brand-500/30 border-brand-300"
      />
      <div className="flex items-center gap-1.5 text-surface-muted shrink-0">
        <TypeIcon tipo={entry.tipo} />
      </div>
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

function PlanInput({ proyecto, onGenerate }) {
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(false)
  // Start with the project's existing history (from Cliente tab) plus any new entries.
  const [multimedia, setMultimedia] = useState(proyecto.multimedia || [])
  // All entries selected by default.
  const [seleccionados, setSeleccionados] = useState(() =>
    new Set((proyecto.multimedia || []).map((m) => m.id)),
  )

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
    const nueva = {
      id: medId(),
      tipo: entry.tipo,
      fecha: new Date().toISOString(),
      contenido: entry.contenido,
    }
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

  const numImagenes = multimedia.filter((m) => m.tipo === 'imagen').length
  const numNotasVoz = multimedia.filter((m) => m.tipo === 'nota_voz').length
  const numSeleccionados = seleccionados.size

  async function handleGenerate() {
    setCargando(true)
    const docsIncluidos = multimedia.filter((m) => seleccionados.has(m.id))
    await generarPlan({ texto, multimedia: docsIncluidos })
    setCargando(false)
    onGenerate()
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-brand-900">Plan maestro</h3>
        <p className="mt-1 text-sm text-surface-muted">
          Sube toda la documentación de la visita: texto, notas de voz, fotos y esbozos. La IA lo procesará todo para generar el plan.
        </p>
      </div>

      {/* Texto de la visita */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <label htmlFor="plan-texto" className="block text-sm font-medium text-brand-800 mb-1">
          Texto de la visita
        </label>
        <textarea
          id="plan-texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Pega aquí el texto de la visita al cliente, notas del proyecto, o el briefing completo..."
          rows={6}
          className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition resize-y"
        />
        <p className="mt-1 text-xs text-surface-muted">{texto.length} caracteres</p>
      </div>

      {/* Multimedia: imágenes + notas de voz */}
      <MediaUploader
        imagenes={multimedia.filter((m) => m.tipo === 'imagen')}
        onAdd={addMultimediaEntry}
        onRemove={removeMultimediaEntry}
      />

      {/* Histórico con checkboxes para seleccionar qué incluir */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-brand-900">Histórico</h4>
            <p className="text-xs text-surface-muted mt-0.5">
              Selecciona los documentos que la IA debe usar para generar el plan.
            </p>
          </div>
          {multimedia.length > 0 ? (
            <button
              type="button"
              onClick={toggleTodos}
              className="text-xs text-brand-700 hover:text-brand-800 font-medium"
            >
              {seleccionados.size === multimedia.length ? 'Quitar todos' : 'Seleccionar todos'}
            </button>
          ) : null}
        </div>

        {multimedia.length === 0 ? (
          <p className="text-sm text-surface-muted">
            Aún no se ha añadido documentación. Las imágenes, notas de voz y texto que subas aparecerán aquí.
          </p>
        ) : (
          <div>
            {multimedia.map((entry) => (
              <DocCheckbox
                key={entry.id}
                entry={entry}
                checked={seleccionados.has(entry.id)}
                onToggle={() => toggleSeleccion(entry.id)}
              />
            ))}
            <p className="mt-3 text-xs text-surface-muted">
              {numSeleccionados} de {multimedia.length} documentos seleccionados
            </p>
          </div>
        )}
      </div>

      {/* Resumen de inputs */}
      {(numImagenes > 0 || numNotasVoz > 0 || texto.length > 0 || numSeleccionados > 0) ? (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
          <p className="text-sm text-brand-800">
            <span className="font-medium">Resumen de inputs:</span>
            {numSeleccionados > 0 ? ` · ${numSeleccionados} ${numSeleccionados === 1 ? 'documento seleccionado' : 'documentos seleccionados'}` : ''}
            {texto.length > 0 ? ` · ${texto.length} caracteres de texto` : ''}
            {numImagenes > 0 ? ` · ${numImagenes} ${numImagenes === 1 ? 'foto' : 'fotos'}` : ''}
            {numNotasVoz > 0 ? ` · ${numNotasVoz} ${numNotasVoz === 1 ? 'nota de voz' : 'notas de voz'}` : ''}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={handleGenerate}
        disabled={cargando}
        className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-60 transition-colors"
      >
        {cargando ? 'Generando plan con IA...' : 'Generar plan con IA'}
      </button>
    </div>
  )
}

function MetricCard({ valor, etiqueta, subetiqueta }) {
  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
      <p className="text-2xl font-semibold text-brand-900 leading-none">{valor}</p>
      <p className="mt-1.5 text-sm text-brand-800">{etiqueta}</p>
      {subetiqueta ? <p className="text-xs text-surface-muted">{subetiqueta}</p> : null}
    </div>
  )
}

function PlanGenerated({ proyecto, onVerify }) {
  const plan = planMaestroMock
  const verificado = proyecto.docs?.plan === true

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-semibold text-brand-900">Plan maestro generado</h3>
          <p className="mt-1 text-sm text-surface-muted">
            Edita cualquier campo, añade comentarios o elimina elementos.
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${verificado ? 'bg-state-success/10 text-state-success' : 'bg-state-warning/10 text-state-warning'}`}>
          {verificado ? 'Verificado' : 'Generado, pendiente revisión'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard valor={plan.estancias.length} etiqueta="Estancias" subetiqueta="Estancias detectadas" />
        <MetricCard valor={`${plan.m2Totales} m²`} etiqueta="m² totales" />
        <MetricCard valor={`~${formatEur(plan.presupuestoEstimado)}`} etiqueta="Presupuesto est." />
      </div>

      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted">Estancias</h4>
          <button type="button" className="text-sm text-brand-700 hover:text-brand-800">+ Añadir estancia</button>
        </div>
        <div className="space-y-2">
          {plan.estancias.map((est) => (
            <div key={est.id} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-brand-50 last:border-0">
              <div className="col-span-4 font-medium text-brand-900 text-sm">{est.nombre}</div>
              <div className="col-span-2 text-xs text-surface-muted">{est.tag}</div>
              <div className="col-span-2 text-sm text-brand-800">{est.m2} m²</div>
              <div className="col-span-2 text-xs text-surface-muted">{est.tipoReforma}</div>
              <div className="col-span-2 text-xs text-surface-muted truncate">{est.detalle}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Trabajos a realizar</h4>
        <div className="flex flex-wrap gap-2">
          {plan.trabajos.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full bg-brand-50 text-brand-800 text-xs font-medium">{t}</span>
          ))}
          <button type="button" className="px-3 py-1 rounded-full border border-brand-200 text-brand-700 text-xs hover:bg-brand-50">+ Añadir trabajo</button>
        </div>
      </div>

      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">Materiales sugeridos</h4>
        <div className="space-y-4">
          {plan.materiales.map((mat) => (
            <div key={mat.id} className="border-b border-brand-50 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-brand-900">{mat.categoria}</p>
                  <p className="text-sm text-brand-800">{mat.descripcion}</p>
                  <p className="text-xs text-surface-muted">{mat.marca} · {mat.modelo}</p>
                </div>
                <button type="button" className="text-surface-muted hover:text-state-danger" title="Eliminar">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
              <input
                type="text"
                placeholder="Comentarios..."
                defaultValue={mat.comentarios}
                className="mt-2 w-full px-3 py-1.5 rounded-lg border border-brand-100 bg-surface-base text-sm text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-3">Análisis de estilo</h4>
        <p className="text-sm text-brand-800 leading-relaxed">{plan.analisisEstilo}</p>
      </div>

      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <label htmlFor="observaciones-plan" className="block text-sm font-medium text-brand-800 mb-2">
          Observaciones generales para regenerar
        </label>
        <p className="text-xs text-surface-muted mb-2">
          Estas observaciones se enviarán a la IA junto con los comentarios de cada campo al pulsar "Regenerar".
        </p>
        <textarea
          id="observaciones-plan"
          rows={3}
          placeholder="Ej: El cliente quiere más luz natural en el salón, cambiar la cocina a estilo industrial..."
          className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition resize-y"
        />
      </div>

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

export default function PlanTab({ proyecto }) {
  const { updateProject } = useProjects()
  const [generado, setGenerado] = useState(proyecto.docs?.plan === true)

  function handleVerify() {
    updateProject(proyecto.id, { docs: { ...proyecto.docs, plan: true } })
  }

  if (!generado) {
    return <PlanInput proyecto={proyecto} onGenerate={() => setGenerado(true)} />
  }
  return <PlanGenerated proyecto={proyecto} onVerify={handleVerify} />
}