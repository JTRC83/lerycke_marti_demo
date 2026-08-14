import { clientes } from '../../data/clientes.js'
import SelectField from './SelectField.jsx'
import InputField from './InputField.jsx'

// ClientForm: Paso 1. Select an existing client (autocompletes fields) or
// create a new one. Nombre is mandatory (marked with *).
const EMPTY = {
  id: '',
  nombre: '',
  cif: '',
  email: '',
  ciudad: '',
  telefono: '',
  direccion: '',
  codigoPostal: '',
}

export default function ClientForm({ datos, onChange, errors }) {
  const cliente = { ...EMPTY, ...datos }

  // When a client is selected from the dropdown, propagate the full object up.
  function handleSelectExisting(e) {
    const id = e.target.value
    if (!id) {
      onChange({ ...EMPTY })
      return
    }
    const found = clientes.find((c) => c.id === id)
    if (found) onChange(found)
  }

  // Edit a single field while keeping the rest of the client object intact.
  function updateField(field, value) {
    onChange({ ...cliente, [field]: value })
  }

  // When switching from a selected client to manual edit, drop the id so the
  // project treats it as a new client.

  return (
    <div className="bg-surface-card border border-brand-100 rounded-xl p-6">
      <h3 className="text-base font-semibold text-brand-900 mb-1">Datos del cliente</h3>
      <p className="text-sm text-surface-muted mb-5">
        Selecciona un cliente existente o crea uno nuevo
      </p>

      <SelectField
        id="clienteExistente"
        value={cliente.id || ''}
        onChange={handleSelectExisting}
        options={clientes.map((c) => ({ value: c.id, label: c.nombre }))}
        placeholder="Selecciona un cliente existente o crea uno nuevo"
      />

      <p className="text-xs uppercase tracking-wider text-surface-muted mt-4 mb-3">
        Datos del cliente
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <InputField
          id="nombreCliente"
          label="Nombre"
          value={cliente.nombre}
          onChange={(e) => updateField('nombre', e.target.value)}
          placeholder="Nombre del cliente"
          error={errors?.nombre}
          required
        />
        <InputField
          id="cifCliente"
          label="CIF / NIF"
          value={cliente.cif}
          onChange={(e) => updateField('cif', e.target.value)}
          placeholder="12345678A / B12345678"
        />
        <InputField
          id="emailCliente"
          label="Email"
          type="email"
          value={cliente.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="cliente@email.com"
          error={errors?.email}
        />
        <InputField
          id="ciudadCliente"
          label="Ciudad"
          value={cliente.ciudad}
          onChange={(e) => updateField('ciudad', e.target.value)}
          placeholder="Sòller, Mallorca"
        />
        <InputField
          id="telefonoCliente"
          label="Teléfono"
          type="tel"
          value={cliente.telefono}
          onChange={(e) => updateField('telefono', e.target.value)}
          placeholder="+34 6XX XXX XXX"
        />
        <InputField
          id="direccionCliente"
          label="Dirección"
          value={cliente.direccion}
          onChange={(e) => updateField('direccion', e.target.value)}
          placeholder="C/ Nombre, número"
        />
        <InputField
          id="cpCliente"
          label="Código postal"
          value={cliente.codigoPostal}
          onChange={(e) => updateField('codigoPostal', e.target.value)}
          placeholder="07100"
        />
      </div>
    </div>
  )
}