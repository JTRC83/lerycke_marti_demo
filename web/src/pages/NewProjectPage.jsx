import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../context/ProjectsContext.jsx'
import { useClientes } from '../context/ClientesContext.jsx'
import { currentYYYYMM, medId } from '../utils/format.js'
import StepperHeader from '../components/new-project/StepperHeader.jsx'
import ClientForm from '../components/new-project/ClientForm.jsx'
import ProjectForm from '../components/new-project/ProjectForm.jsx'
import MediaUploader from '../components/new-project/MediaUploader.jsx'
import TimelineMedia from '../components/new-project/TimelineMedia.jsx'

// NewProjectPage: 2-step stepper in a single route (PRD 02).
// Step 1: client data. Step 2: project data + multimedia. On save, the project
// is created in "borrador" and we navigate to /proyecto/:id.
export default function NewProjectPage() {
  const navigate = useNavigate()
  const { addProject } = useProjects()
  const { addCliente, getCliente } = useClientes()

  const [step, setStep] = useState(1)
  const [datosCliente, setDatosCliente] = useState(null)
  const [datosProyecto, setDatosProyecto] = useState({
    nombre: '',
    tipo: '',
    estilo: '',
    observacionesCliente: '',
  })
  const [multimedia, setMultimedia] = useState([])
  const [textoNota, setTextoNota] = useState('')
  const [errors, setErrors] = useState({})
  const [guardando, setGuardando] = useState(false)

  // --- Multimedia handlers ---
  function addMultimediaEntry(entry) {
    const nueva = {
      id: medId(),
      tipo: entry.tipo,
      fecha: new Date().toISOString(),
      contenido: entry.contenido,
    }
    setMultimedia((prev) => [nueva, ...prev])
  }

  function removeMultimediaEntry(id) {
    setMultimedia((prev) => prev.filter((m) => m.id !== id))
  }

  function addTextoNota() {
    const texto = textoNota.trim()
    if (!texto) return
    addMultimediaEntry({ tipo: 'texto', contenido: { texto } })
    setTextoNota('')
  }

  // --- Validation ---
  function validateStep1() {
    const e = {}
    const nombre = (datosCliente?.nombre || '').trim()
    if (!nombre) e.nombre = 'El nombre del cliente es obligatorio.'
    return e
  }

  function validateStep2() {
    const e = {}
    const nombre = (datosProyecto.nombre || '').trim()
    if (!nombre) e.nombre = 'El nombre del proyecto es obligatorio.'
    return e
  }

  // --- Navigation handlers ---
  function handleSiguiente() {
    const e = validateStep1()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    setErrors({})
    setStep(2)
  }

  function handleAnterior() {
    setErrors({})
    setStep(1)
  }

  function handleCancelar() {
    navigate('/dashboard')
  }

  function handleGuardar() {
    const e = validateStep2()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }
    setErrors({})
    setGuardando(true)

    const cliente = datosCliente || {}
    const id = addProject({
      nombre: datosProyecto.nombre.trim(),
      tipo: datosProyecto.tipo || '',
      estilo: datosProyecto.estilo || '',
      observacionesCliente: datosProyecto.observacionesCliente || '',
      cliente: {
        id: cliente.id || '',
        nombre: cliente.nombre || '',
        cif: cliente.cif || '',
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        codigoPostal: cliente.codigoPostal || '',
      },
      direccion: cliente.direccion || '',
      ciudad: cliente.ciudad || '',
      estado: 'borrador',
      m2: null,
      estancias: null,
      presupuestoTotal: null,
      fecha: currentYYYYMM(),
      docs: {
        presupuesto: false,
        plan: false,
        memoria: false,
        renders: { generados: 0, total: 4 },
      },
      multimedia,
    })

    // Register the client in the ClientesContext so the CRM reflects it.
    // Only add if it is a new client (no existing id) to avoid duplicates.
    if (cliente.nombre && !cliente.id) {
      addCliente({
        nombre: cliente.nombre,
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        codigoPostal: cliente.codigoPostal || '',
      })
    } else if (cliente.id && !getCliente(cliente.id)) {
      // Safety net: if the id is not found in the context, add it anyway.
      addCliente({
        id: cliente.id,
        nombre: cliente.nombre,
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        codigoPostal: cliente.codigoPostal || '',
      })
    }

    setGuardando(false)
    navigate(`/proyecto/${id}`)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <StepperHeader step={step} />

      {/* STEP 1 */}
      {step === 1 ? (
        <div>
          <ClientForm datos={datosCliente || {}} onChange={setDatosCliente} errors={errors} />
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={handleCancelar}
              className="px-4 py-2.5 rounded-xl border border-brand-200 text-brand-800 text-sm font-medium hover:bg-surface-base transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSiguiente}
              className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}

      {/* STEP 2 */}
      {step === 2 ? (
        <div className="space-y-5">
          <ProjectForm datos={datosProyecto} onChange={setDatosProyecto} errors={errors} />

          {/* Multimedia + Notas de texto en dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MediaUploader
              imagenes={multimedia.filter((m) => m.tipo === 'imagen')}
              onAdd={addMultimediaEntry}
              onRemove={removeMultimediaEntry}
            />

            {/* Notas de texto */}
            <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
              <h4 className="text-sm font-semibold text-brand-900 mb-1">Notas de texto</h4>
              <p className="text-xs text-surface-muted mb-3">
                Escribe notas sobre la visita, peticiones del cliente o cualquier detalle relevante. Se añadirán al histórico.
              </p>
              <div className="flex gap-3">
                <textarea
                  value={textoNota}
                  onChange={(e) => setTextoNota(e.target.value)}
                  placeholder="Ideas y sugerencias para complementar las peticiones del cliente..."
                  rows={5}
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
          </div>

          {/* Histórico debajo */}
          <TimelineMedia historico={multimedia} onRemove={removeMultimediaEntry} />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleAnterior}
              className="px-4 py-2.5 rounded-xl border border-brand-200 text-brand-800 text-sm font-medium hover:bg-surface-base transition-colors"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={handleGuardar}
              disabled={guardando}
              className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}