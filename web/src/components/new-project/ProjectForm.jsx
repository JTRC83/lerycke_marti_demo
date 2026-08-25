import { useState } from 'react'
import SelectField from './SelectField.jsx'
import InputField from './InputField.jsx'

// ProjectForm: Paso 2 bloque A. Datos del proyecto.
// Tipos y estilos soportan "Otros" para añadir opciones personalizadas.
const TIPOS_BASE = [
  'Reforma integral vivienda',
  'Reforma integral comercial',
  'Diseño de interiores',
  'Vivienda unifamiliar',
  'Rehabilitación rústica',
]

const ESTILOS_BASE = [
  'Rústico mediterráneo',
  'Minimalista',
  'Industrial',
  'Nórdico',
  'Japandi',
  'Contemporáneo',
]

export default function ProjectForm({ datos, onChange, errors }) {
  // Persistent lists that grow when the user adds custom types/styles.
  const [tipos, setTipos] = useState(TIPOS_BASE)
  const [estilos, setEstilos] = useState(ESTILOS_BASE)
  const [nuevoTipo, setNuevoTipo] = useState('')
  const [nuevoEstilo, setNuevoEstilo] = useState('')

  function updateField(field, value) {
    onChange({ ...datos, [field]: value })
  }

  // --- Tipo de proyecto ---
  function handleTipoChange(e) {
    const val = e.target.value
    if (val === '__otro__') {
      // Don't change tipo yet; user must type the custom value
      updateField('tipo', '__otro__')
      setNuevoTipo('')
    } else {
      updateField('tipo', val)
      setNuevoTipo('')
    }
  }

  function handleAddTipo() {
    const val = nuevoTipo.trim()
    if (!val || tipos.includes(val)) return
    setTipos((prev) => [...prev, val])
    updateField('tipo', val)
    setNuevoTipo('')
  }

  // --- Estilo / concepto ---
  function handleEstiloChange(e) {
    const val = e.target.value
    if (val === '__otro__') {
      updateField('estilo', '__otro__')
      setNuevoEstilo('')
    } else {
      updateField('estilo', val)
      setNuevoEstilo('')
    }
  }

  function handleAddEstilo() {
    const val = nuevoEstilo.trim()
    if (!val || estilos.includes(val)) return
    setEstilos((prev) => [...prev, val])
    updateField('estilo', val)
    setNuevoEstilo('')
  }

  // Convert internal "__otro__" marker to display "Otros..." in the select
  const tipoSelectValue = datos.tipo === '__otro__' ? '__otro__' : (datos.tipo || '')
  const estiloSelectValue = datos.estilo === '__otro__' ? '__otro__' : (datos.estilo || '')
  const mostrarInputTipo = datos.tipo === '__otro__'
  const mostrarInputEstilo = datos.estilo === '__otro__'

  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
      <h3 className="text-base font-semibold text-brand-900 mb-5">Datos del proyecto</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <div className="sm:col-span-2">
          <InputField
            id="nombreProyecto"
            label="Nombre del proyecto"
            value={datos.nombre || ''}
            onChange={(e) => updateField('nombre', e.target.value)}
            placeholder="Ej: SON POU, Ramon Llull 31..."
            error={errors?.nombre}
            required
          />
        </div>

        {/* Tipo de proyecto */}
        <div className="mb-4">
          <label htmlFor="tipoProyecto" className="block text-sm font-medium text-brand-800 mb-1">
            Tipo de proyecto
          </label>
          <div className="relative">
            <select
              id="tipoProyecto"
              value={tipoSelectValue}
              onChange={handleTipoChange}
              className="w-full appearance-none px-3 py-2.5 rounded-xl border bg-white text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition pr-9 border-brand-200"
            >
              <option value="">Seleccionar...</option>
              {tipos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
              <option value="__otro__">+ Otros (añadir nuevo)</option>
            </select>
            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {mostrarInputTipo ? (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value)}
                placeholder="Escribe el nuevo tipo de proyecto..."
                className="flex-1 px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
              />
              <button
                type="button"
                onClick={handleAddTipo}
                disabled={!nuevoTipo.trim()}
                className="px-3 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                Añadir
              </button>
            </div>
          ) : null}
        </div>

        {/* Estilo / concepto */}
        <div className="mb-4">
          <label htmlFor="estiloProyecto" className="block text-sm font-medium text-brand-800 mb-1">
            Estilo / concepto
          </label>
          <div className="relative">
            <select
              id="estiloProyecto"
              value={estiloSelectValue}
              onChange={handleEstiloChange}
              className="w-full appearance-none px-3 py-2.5 rounded-xl border bg-white text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition pr-9 border-brand-200"
            >
              <option value="">Seleccionar...</option>
              {estilos.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="__otro__">+ Otros (añadir nuevo)</option>
            </select>
            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {mostrarInputEstilo ? (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={nuevoEstilo}
                onChange={(e) => setNuevoEstilo(e.target.value)}
                placeholder="Escribe el nuevo estilo o concepto..."
                className="flex-1 px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
              />
              <button
                type="button"
                onClick={handleAddEstilo}
                disabled={!nuevoEstilo.trim()}
                className="px-3 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                Añadir
              </button>
            </div>
          ) : null}
        </div>

        <div className="sm:col-span-2 mb-4">
          <label htmlFor="observaciones" className="block text-sm font-medium text-brand-800 mb-1">
            Observaciones del cliente
          </label>
          <textarea
            id="observaciones"
            value={datos.observacionesCliente || ''}
            onChange={(e) => updateField('observacionesCliente', e.target.value)}
            placeholder="Notas de la visita, peticiones del cliente..."
            rows={4}
            className={[
              'w-full px-3 py-2.5 rounded-xl border bg-white text-brand-900 placeholder:text-surface-muted',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition resize-y',
              'border-brand-200',
            ].join(' ')}
          />
        </div>
      </div>
    </div>
  )
}