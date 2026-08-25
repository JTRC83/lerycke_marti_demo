import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import MediaUploader from '../../new-project/MediaUploader.jsx'
import { getClienteObj, getClienteNombre } from '../../../utils/project.js'
import { medId, formatFechaEs } from '../../../utils/format.js'

// ClienteTab: shows client data, editable project form, multimedia upload
// (images, voice notes, text) with a two-column history, and a button to Plan.

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-surface-muted">{label}</p>
      <p className="text-sm text-brand-800">{value || '—'}</p>
    </div>
  )
}

// --- Two-column history ---

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

function HistoryEntry({ entry, onRemove }) {
  const label = TYPE_LABELS[entry.tipo] || 'Documento'
  const preview = entry.tipo === 'imagen'
    ? entry.contenido?.nombre || 'Imagen'
    : entry.tipo === 'nota_voz'
      ? entry.contenido?.nombre || 'Nota de voz'
      : entry.tipo === 'texto'
        ? (entry.contenido?.texto || '').slice(0, 80) + (entry.contenido?.texto?.length > 80 ? '...' : '')
        : entry.contenido?.resumen || 'Entrada'

  return (
    <div className="relative pl-6 pb-4">
      {/* Timeline node */}
      <span className="absolute left-0 top-1 w-4 h-4 rounded-full flex items-center justify-center text-brand-700 bg-brand-50">
        <TypeIcon tipo={entry.tipo} />
      </span>
      {/* Vertical line */}
      <span className="absolute left-2 top-5 bottom-0 w-px bg-brand-100" aria-hidden />

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-brand-50 text-brand-700">{label}</span>
            <span className="text-xs text-surface-muted">{formatFechaEs(entry.fecha)}</span>
          </div>
          {/* Content preview */}
          {entry.tipo === 'imagen' ? (
            <div className="mt-2 rounded-lg overflow-hidden border border-brand-100 max-w-[160px]">
              <img src={entry.contenido.url} alt={entry.contenido.nombre} className="w-full h-24 object-cover" />
              <p className="px-2 py-1 text-xs text-surface-muted truncate">{entry.contenido.nombre}</p>
            </div>
          ) : entry.tipo === 'nota_voz' ? (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-surface-base border border-brand-100 px-3 py-2">
              <TypeIcon tipo="nota_voz" />
              <span className="text-sm text-brand-800">{entry.contenido?.nombre || 'Nota de voz'}</span>
              {entry.contenido?.transcripcion ? (
                <span className="text-xs text-surface-muted italic truncate ml-2">"{entry.contenido.transcripcion}"</span>
              ) : null}
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-brand-800">{preview}</p>
          )}
        </div>

        {/* Remove */}
        <button
          type="button"
          onClick={() => onRemove(entry.id)}
          className="shrink-0 w-7 h-7 rounded-lg text-surface-muted hover:bg-red-50 hover:text-state-danger flex items-center justify-center transition-colors"
          title="Eliminar entrada"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  )
}

function HistoryTwoColumns({ historico, onRemove, idsIniciales }) {
  // Left column: entries that existed before this session (iniciales).
  // Right column: entries added during this session (nuevas), newest first.
  const leftCol = historico.filter((e) => idsIniciales.has(e.id))
  const rightCol = historico.filter((e) => !idsIniciales.has(e.id))

  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
      <h3 className="text-base font-semibold text-brand-900 mb-4">Histórico</h3>
      {historico.length === 0 ? (
        <p className="text-sm text-surface-muted">
          Aún no se ha añadido multimedia. Las imágenes, notas de voz y texto que subas aparecerán aquí en orden cronológico.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column: older entries */}
          <div>
            {leftCol.length > 0 ? (
              <div>
                {leftCol.map((entry) => (
                  <HistoryEntry key={entry.id} entry={entry} onRemove={onRemove} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-muted">—</p>
            )}
          </div>
          {/* Right column: newer entries (newest on top) */}
          <div>
            {rightCol.length > 0 ? (
              <div>
                {rightCol.map((entry) => (
                  <HistoryEntry key={entry.id} entry={entry} onRemove={onRemove} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-muted">—</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ClienteTab({ proyecto, onIrPlan }) {
  const { updateProject } = useProjects()
  const cliente = getClienteObj(proyecto)
  const [multimedia, setMultimedia] = useState(proyecto.multimedia || [])
  const [textoNota, setTextoNota] = useState('')

  // Snapshot of the initial entry IDs so the history can split
  // left (existing) vs right (newly added in this session).
  const [idsIniciales] = useState(() => new Set((proyecto.multimedia || []).map((m) => m.id)))

  function syncMultimedia(nuevoMultimedia) {
    setMultimedia(nuevoMultimedia)
    updateProject(proyecto.id, { multimedia: nuevoMultimedia })
  }

  function addMultimediaEntry(entry) {
    const nueva = {
      id: medId(),
      tipo: entry.tipo,
      fecha: new Date().toISOString(),
      contenido: entry.contenido,
    }
    syncMultimedia([nueva, ...multimedia])
  }

  function removeMultimediaEntry(id) {
    syncMultimedia(multimedia.filter((m) => m.id !== id))
  }

  function addTextoNota() {
    const texto = textoNota.trim()
    if (!texto) return
    addMultimediaEntry({ tipo: 'texto', contenido: { texto } })
    setTextoNota('')
  }

  return (
    <div className="space-y-5">
      {/* Client data (read-only) */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h3 className="text-base font-semibold text-brand-900 mb-5">Datos del cliente</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReadOnlyField label="Nombre" value={getClienteNombre(proyecto)} />
          <ReadOnlyField label="CIF / NIF" value={cliente.cif} />
          <ReadOnlyField label="Email" value={cliente.email} />
          <ReadOnlyField label="Teléfono" value={cliente.telefono} />
          <ReadOnlyField label="Dirección" value={cliente.direccion} />
          <ReadOnlyField label="Ciudad" value={cliente.ciudad} />
          <ReadOnlyField label="Código postal" value={cliente.codigoPostal} />
        </div>
      </div>

      {/* Project data (read-only) */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h3 className="text-base font-semibold text-brand-900 mb-5">Datos del proyecto</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReadOnlyField label="Nombre del proyecto" value={proyecto.nombre} />
          <ReadOnlyField label="Tipo de proyecto" value={proyecto.tipo} />
          <ReadOnlyField label="Estilo / concepto" value={proyecto.estilo} />
          <ReadOnlyField label="Observaciones" value={proyecto.observacionesCliente} />
        </div>
      </div>

      {/* History (two columns, on top) */}
      <HistoryTwoColumns historico={multimedia} onRemove={removeMultimediaEntry} idsIniciales={idsIniciales} />

      {/* Multimedia: images + voice notes */}
      <MediaUploader
        imagenes={multimedia.filter((m) => m.tipo === 'imagen')}
        onAdd={addMultimediaEntry}
        onRemove={removeMultimediaEntry}
      />

      {/* Text note input */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-brand-900 mb-1">Notas de texto</h4>
        <p className="text-xs text-surface-muted mb-3">
          Escribe una nota sobre la visita, peticiones del cliente o cualquier detalle relevante.
          Se añadirá al histórico.
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

      {/* Continue to Plan */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onIrPlan}
          className="px-6 py-3 rounded-xl bg-brand-700 text-white text-sm font-semibold hover:bg-brand-800 transition-colors inline-flex items-center gap-2"
        >
          Pasar a Plan
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}