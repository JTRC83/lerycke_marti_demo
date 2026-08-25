import { useState } from 'react'
import SelectField from './SelectField.jsx'
import InputField from './InputField.jsx'

// ProjectForm: Paso 2 bloque A. Datos del proyecto.
// Tipos y estilos soportan "Otros" para añadir opciones personalizadas.
export const TIPOS_PROYECTO = [
  'Reforma integral vivienda',
  'Reforma integral comercial',
  'Diseño de interiores',
  'Vivienda unifamiliar',
  'Rehabilitación rústica',
  'Otros',
]

export const ESTILOS = [
  'Rústico mediterráneo',
  'Minimalista',
  'Industrial',
  'Nórdico',
  'Japandi',
  'Contemporáneo',
  'Otros',
]

export default function ProjectForm({ datos, onChange, errors }) {
  const [tipoPersonalizado, setTipoPersonalizado] = useState('')
  const [estiloPersonalizado, setEstiloPersonalizado] = useState('')

  function updateField(field, value) {
    onChange({ ...datos, [field]: value })
  }

  function handleTipoChange(e) {
    const val = e.target.value
    if (val === 'Otros') {
      updateField('tipo', '')
      setTipoPersonalizado('')
    } else {
      updateField('tipo', val)
      setTipoPersonalizado('')
    }
  }

  function handleTipoPersonalizado(e) {
    const val = e.target.value
    setTipoPersonalizado(val)
    updateField('tipo', val)
  }

  function handleEstiloChange(e) {
    const val = e.target.value
    if (val === 'Otros') {
      updateField('estilo', '')
      setEstiloPersonalizado('')
    } else {
      updateField('estilo', val)
      setEstiloPersonalizado('')
    }
  }

  function handleEstiloPersonalizado(e) {
    const val = e.target.value
    setEstiloPersonalizado(val)
    updateField('estilo', val)
  }

  // Detect if current value is a custom one (not in the preset list)
  const tipoEsOtro = datos.tipo && !TIPOS_PROYECTO.includes(datos.tipo)
  const estiloEsOtro = datos.estilo && !ESTILOS.includes(datos.estilo)

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
          <SelectField
            id="tipoProyecto"
            label="Tipo de proyecto"
            value={tipoEsOtro ? 'Otros' : (datos.tipo || '')}
            onChange={handleTipoChange}
            options={TIPOS_PROYECTO}
          />
          {(tipoEsOtro || datos.tipo === '' && tipoPersonalizado !== '') ? (
            <input
              type="text"
              value={tipoPersonalizado}
              onChange={handleTipoPersonalizado}
              placeholder="Escribe el tipo de proyecto..."
              className="mt-2 w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
            />
          ) : null}
        </div>

        {/* Estilo / concepto */}
        <div className="mb-4">
          <SelectField
            id="estiloProyecto"
            label="Estilo / concepto"
            value={estiloEsOtro ? 'Otros' : (datos.estilo || '')}
            onChange={handleEstiloChange}
            options={ESTILOS}
          />
          {(estiloEsOtro || datos.estilo === '' && estiloPersonalizado !== '') ? (
            <input
              type="text"
              value={estiloPersonalizado}
              onChange={handleEstiloPersonalizado}
              placeholder="Escribe el estilo o concepto..."
              className="mt-2 w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
            />
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