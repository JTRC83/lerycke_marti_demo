import SelectField from './SelectField.jsx'
import InputField from './InputField.jsx'

// ProjectForm: Paso 2 bloque A. Datos del proyecto.
export const TIPOS_PROYECTO = [
  'Reforma integral vivienda',
  'Reforma integral comercial',
  'Diseño de interiores',
  'Vivienda unifamiliar',
  'Rehabilitación rústica',
]

export const ESTILOS = [
  'Rústico mediterráneo',
  'Minimalista',
  'Industrial',
  'Nórdico',
  'Japandi',
  'Contemporáneo',
]

export default function ProjectForm({ datos, onChange, errors }) {
  function updateField(field, value) {
    onChange({ ...datos, [field]: value })
  }

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

        <SelectField
          id="tipoProyecto"
          label="Tipo de proyecto"
          value={datos.tipo || ''}
          onChange={(e) => updateField('tipo', e.target.value)}
          options={TIPOS_PROYECTO}
        />

        <SelectField
          id="estiloProyecto"
          label="Estilo / concepto"
          value={datos.estilo || ''}
          onChange={(e) => updateField('estilo', e.target.value)}
          options={ESTILOS}
        />

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