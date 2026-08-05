import { useState } from 'react'
import { useProjects } from '../../../context/ProjectsContext.jsx'
import ProjectForm from '../../new-project/ProjectForm.jsx'
import MediaUploader from '../../new-project/MediaUploader.jsx'
import TimelineMedia from '../../new-project/TimelineMedia.jsx'
import { getClienteObj, getClienteNombre } from '../../../utils/project.js'
import { medId } from '../../../utils/format.js'

// ClienteTab: shows client data, editable project form, multimedia upload
// (images, voice notes, text) with history, and a button to continue to Plan.

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-surface-muted">{label}</p>
      <p className="text-sm text-brand-800">{value || '—'}</p>
    </div>
  )
}

export default function ClienteTab({ proyecto, onIrPlan }) {
  const { updateProject } = useProjects()
  const cliente = getClienteObj(proyecto)
  const [datosProyecto, setDatosProyecto] = useState({
    nombre: proyecto.nombre || '',
    tipo: proyecto.tipo || '',
    estilo: proyecto.estilo || '',
    observacionesCliente: proyecto.observacionesCliente || '',
  })
  const [multimedia, setMultimedia] = useState(proyecto.multimedia || [])
  const [textoNota, setTextoNota] = useState('')

  // Persist multimedia to the project context so Plan tab can read it.
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
    addMultimediaEntry({
      tipo: 'texto',
      contenido: { texto },
    })
    setTextoNota('')
  }

  return (
    <div className="space-y-5">
      {/* Client data (read-only) */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h3 className="text-base font-semibold text-brand-900 mb-5">Datos del cliente</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ReadOnlyField label="Nombre" value={getClienteNombre(proyecto)} />
          <ReadOnlyField label="Email" value={cliente.email} />
          <ReadOnlyField label="Teléfono" value={cliente.telefono} />
          <ReadOnlyField label="Dirección" value={cliente.direccion} />
          <ReadOnlyField label="Ciudad" value={cliente.ciudad} />
          <ReadOnlyField label="Código postal" value={cliente.codigoPostal} />
        </div>
      </div>

      {/* Project data (editable, preloaded) */}
      <ProjectForm datos={datosProyecto} onChange={setDatosProyecto} errors={{}} />

      {/* Multimedia: images + voice notes */}
      <MediaUploader
        imagenes={multimedia.filter((m) => m.tipo === 'imagen')}
        onAdd={addMultimediaEntry}
        onRemove={removeMultimediaEntry}
      />

      {/* Text note input */}
      <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-brand-900 mb-1">Añadir nota de texto</h4>
        <p className="text-xs text-surface-muted mb-3">
          Escribe una nota sobre la visita, peticiones del cliente o cualquier detalle relevante.
          Se añadirá al histórico.
        </p>
        <div className="flex gap-3">
          <textarea
            value={textoNota}
            onChange={(e) => setTextoNota(e.target.value)}
            placeholder="Ej: El cliente quiere más luz natural en el salón, cambiar la cocina a estilo industrial..."
            rows={3}
            className="flex-1 px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition resize-y"
          />
          <button
            type="button"
            onClick={addTextoNota}
            disabled={!textoNota.trim()}
            className="px-4 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-50 transition-colors self-start whitespace-nowrap"
          >
            Añadir nota
          </button>
        </div>
      </div>

      {/* History */}
      <TimelineMedia historico={multimedia} onRemove={removeMultimediaEntry} />

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