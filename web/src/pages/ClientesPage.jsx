import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../context/ProjectsContext.jsx'
import { useClientes } from '../context/ClientesContext.jsx'
import { getClienteNombre } from '../utils/project.js'
import { formatEur } from '../data/projects.js'
import InputField from '../components/new-project/InputField.jsx'

// ClientesPage: lightweight CRM listing clients with KPIs, search, create,
// edit and delete. Merges clients from ClientesContext with any client objects
// attached to projects created via the stepper.

const EMPTY_FORM = {
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  codigoPostal: '',
}

function Avatar({ nombre, size = 'w-11 h-11 text-base' }) {
  return (
    <div className={`${size} rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-semibold shrink-0`}>
      {nombre.charAt(0)}
    </div>
  )
}

function CloseButton({ onClose }) {
  return (
    <button
      type="button"
      onClick={onClose}
      className="w-8 h-8 rounded-full bg-surface-base text-surface-muted flex items-center justify-center hover:bg-brand-50 transition-colors"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function ClienteCard({ cliente, proyectos, onOpen, navigate }) {
  const proyectosCliente = proyectos.filter((p) => getClienteNombre(p) === cliente.nombre)
  const activo = proyectosCliente.length > 0

  return (
    <div
      className="bg-surface-card border border-brand-100 rounded-xl p-6 cursor-pointer hover:border-brand-300 transition-colors"
      onClick={() => onOpen(cliente)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar nombre={cliente.nombre} />
          <div>
            <h3 className="text-sm font-semibold text-brand-900">{cliente.nombre}</h3>
            {cliente.email ? <p className="text-xs text-surface-muted">{cliente.email}</p> : null}
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
          activo ? 'bg-state-success/10 text-state-success' : 'bg-surface-base text-surface-muted'
        }`}>
          {activo ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Contacto rápido */}
      {(cliente.ciudad || cliente.telefono) ? (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-surface-muted">
          {cliente.ciudad ? <span>{cliente.ciudad}</span> : null}
          {cliente.telefono ? <span>Tel: {cliente.telefono}</span> : null}
        </div>
      ) : null}

      {/* Proyectos asociados */}
      {proyectosCliente.length > 0 ? (
        <div className="mt-4 pt-3 border-t border-brand-50 space-y-2">
          {proyectosCliente.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/proyecto/${p.id}`)
              }}
              className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg hover:bg-brand-50 transition-colors"
            >
              <div className="min-w-0">
                <span className="text-sm font-medium text-brand-900 truncate block">{p.nombre}</span>
                <span className="text-xs text-surface-muted">
                  {p.m2 != null ? `${p.m2} m²` : '—'}
                  {p.presupuestoTotal != null ? ` · ${formatEur(p.presupuestoTotal)}` : ''}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ml-2 ${
                p.estado === 'activo' ? 'bg-state-success/10 text-state-success' :
                p.estado === 'completado' ? 'bg-brand-100 text-brand-700' :
                'bg-surface-base text-surface-muted'
              }`}>{p.estado}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 pt-3 border-t border-brand-50">
          <p className="text-xs text-surface-muted">Sin proyectos asociados</p>
        </div>
      )}

      <p className="mt-3 text-xs text-brand-700 font-medium">Ver información →</p>
    </div>
  )
}

function NuevoClienteModal({ onClose, onGuardar }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nombre = (form.nombre || '').trim()
    if (!nombre) {
      setErrors({ nombre: 'El nombre del cliente es obligatorio.' })
      return
    }
    onGuardar({
      ...EMPTY_FORM,
      ...form,
      nombre,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-brand-100 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-semibold text-brand-900">Nuevo cliente</h3>
          <CloseButton onClose={onClose} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <InputField
              id="nuevo-nombre"
              label="Nombre"
              value={form.nombre}
              onChange={(e) => updateField('nombre', e.target.value)}
              placeholder="Nombre del cliente"
              error={errors.nombre}
              required
            />
            <InputField
              id="nuevo-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="cliente@email.com"
            />
            <InputField
              id="nuevo-telefono"
              label="Teléfono"
              type="tel"
              value={form.telefono}
              onChange={(e) => updateField('telefono', e.target.value)}
              placeholder="+34 6XX XXX XXX"
            />
            <InputField
              id="nuevo-ciudad"
              label="Ciudad"
              value={form.ciudad}
              onChange={(e) => updateField('ciudad', e.target.value)}
              placeholder="Sòller, Mallorca"
            />
            <InputField
              id="nuevo-direccion"
              label="Dirección"
              value={form.direccion}
              onChange={(e) => updateField('direccion', e.target.value)}
              placeholder="C/ Nombre, número"
            />
            <InputField
              id="nuevo-cp"
              label="Código postal"
              value={form.codigoPostal}
              onChange={(e) => updateField('codigoPostal', e.target.value)}
              placeholder="07100"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-brand-200 text-brand-800 text-sm font-medium hover:bg-surface-base transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
            >
              Guardar cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ClienteModal({ cliente, proyectos, navigate, onClose, onEditar, onEliminar }) {
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    nombre: cliente.nombre || '',
    email: cliente.email || '',
    telefono: cliente.telefono || '',
    direccion: cliente.direccion || '',
    ciudad: cliente.ciudad || '',
    codigoPostal: cliente.codigoPostal || '',
  })
  const [errors, setErrors] = useState({})
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false)

  const proyectosCliente = proyectos.filter((p) => getClienteNombre(p) === cliente.nombre)
  const puedeEliminar = proyectosCliente.length === 0

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleGuardarEdicion() {
    const nombre = (form.nombre || '').trim()
    if (!nombre) {
      setErrors({ nombre: 'El nombre del cliente es obligatorio.' })
      return
    }
    setErrors({})
    onEditar(cliente.id, { ...form, nombre })
    setEditando(false)
  }

  function handleCancelarEdicion() {
    setForm({
      nombre: cliente.nombre || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      ciudad: cliente.ciudad || '',
      codigoPostal: cliente.codigoPostal || '',
    })
    setErrors({})
    setEditando(false)
  }

  function handleEliminar() {
    if (confirmandoEliminar) {
      onEliminar(cliente.id)
    } else {
      setConfirmandoEliminar(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-brand-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <Avatar nombre={cliente.nombre} size="w-12 h-12 text-lg" />
            <div>
              <h3 className="text-lg font-semibold text-brand-900">{cliente.nombre}</h3>
              <p className="text-sm text-surface-muted">
                {proyectosCliente.length} {proyectosCliente.length === 1 ? 'proyecto' : 'proyectos'} asociados
              </p>
            </div>
          </div>
          <CloseButton onClose={onClose} />
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Datos de contacto */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-muted">Datos de contacto</h4>
              {editando ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelarEdicion}
                    className="px-3 py-1.5 rounded-xl border border-brand-200 text-brand-800 text-xs font-medium hover:bg-surface-base transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleGuardarEdicion}
                    className="px-3 py-1.5 rounded-xl bg-brand-700 text-white text-xs font-medium hover:bg-brand-800 transition-colors"
                  >
                    Guardar cambios
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditando(true)}
                  className="px-3 py-1.5 rounded-xl border border-brand-200 text-brand-800 text-xs font-medium hover:bg-surface-base transition-colors"
                >
                  Editar
                </button>
              )}
            </div>

            {editando ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <InputField
                  id="edit-nombre"
                  label="Nombre"
                  value={form.nombre}
                  onChange={(e) => updateField('nombre', e.target.value)}
                  error={errors.nombre}
                  required
                />
                <InputField
                  id="edit-email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
                <InputField
                  id="edit-telefono"
                  label="Teléfono"
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => updateField('telefono', e.target.value)}
                />
                <InputField
                  id="edit-ciudad"
                  label="Ciudad"
                  value={form.ciudad}
                  onChange={(e) => updateField('ciudad', e.target.value)}
                />
                <InputField
                  id="edit-direccion"
                  label="Dirección"
                  value={form.direccion}
                  onChange={(e) => updateField('direccion', e.target.value)}
                />
                <InputField
                  id="edit-cp"
                  label="Código postal"
                  value={form.codigoPostal}
                  onChange={(e) => updateField('codigoPostal', e.target.value)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoField label="Email" value={cliente.email} />
                <InfoField label="Teléfono" value={cliente.telefono} />
                <InfoField label="Dirección" value={cliente.direccion} />
                <InfoField label="Ciudad" value={cliente.ciudad} />
                <InfoField label="Código postal" value={cliente.codigoPostal} />
              </div>
            )}
          </div>

          {/* Proyectos asociados */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-muted mb-3">Proyectos asociados</h4>
            {proyectosCliente.length > 0 ? (
              <div className="space-y-2">
                {proyectosCliente.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => navigate(`/proyecto/${p.id}`)}
                    className="flex items-center justify-between w-full text-left px-4 py-3 rounded-xl border border-brand-100 hover:bg-brand-50 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-medium text-brand-900">{p.nombre}</span>
                      <span className="ml-2 text-xs text-surface-muted">{p.m2 != null ? `${p.m2} m²` : ''}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {p.presupuestoTotal != null ? (
                        <span className="text-xs text-surface-muted">{formatEur(p.presupuestoTotal)}</span>
                      ) : null}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        p.estado === 'activo' ? 'bg-state-success/10 text-state-success' :
                        p.estado === 'completado' ? 'bg-brand-100 text-brand-700' :
                        'bg-surface-base text-surface-muted'
                      }`}>{p.estado}</span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-muted">Este cliente aún no tiene proyectos asociados.</p>
            )}
          </div>

          {/* Eliminar cliente */}
          <div className="pt-4 border-t border-brand-100">
            {confirmandoEliminar ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-state-danger">
                  {puedeEliminar
                    ? 'Confirma que quieres eliminar este cliente.'
                    : 'No se puede eliminar: el cliente tiene proyectos asociados.'}
                </p>
                {puedeEliminar ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmandoEliminar(false)}
                      className="px-3 py-2 rounded-xl border border-brand-200 text-brand-800 text-xs font-medium hover:bg-surface-base transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleEliminar}
                      className="px-3 py-2 rounded-xl bg-state-danger text-white text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      Eliminar definitivamente
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmandoEliminar(false)}
                    className="px-3 py-2 rounded-xl border border-brand-200 text-brand-800 text-xs font-medium hover:bg-surface-base transition-colors"
                  >
                    Cerrar
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleEliminar}
                className="text-sm text-state-danger font-medium hover:underline"
              >
                Eliminar cliente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-surface-muted">{label}</p>
      <p className="text-sm text-brand-900 mt-0.5">{value || '—'}</p>
    </div>
  )
}

export default function ClientesPage() {
  const navigate = useNavigate()
  const { projects } = useProjects()
  const { clientes, addCliente, updateCliente, removeCliente } = useClientes()
  const [clienteAbierto, setClienteAbierto] = useState(null)
  const [mostrarNuevo, setMostrarNuevo] = useState(false)
  const [busqueda, setBusqueda] = useState('')

  // Merge context clientes with any clientes from new projects that are not
  // already in the context (same dedupe-by-name logic as before).
  const todosLosClientes = useMemo(() => {
    const nombresVistos = new Set(clientes.map((c) => c.nombre))
    const clientesExtra = projects
      .filter((p) => {
        const nombre = getClienteNombre(p)
        return nombre && !nombresVistos.has(nombre) && (nombresVistos.add(nombre), true)
      })
      .map((p, i) => {
        const c = typeof p.cliente === 'object' ? p.cliente : { nombre: p.cliente }
        return { ...c, id: c.id || `cli-extra-${i}` }
      })
    return [...clientes, ...clientesExtra]
  }, [clientes, projects])

  // Filtered list by search term (nombre, email, ciudad).
  const clientesFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase()
    if (!term) return todosLosClientes
    return todosLosClientes.filter((c) => {
      const enNombre = (c.nombre || '').toLowerCase().includes(term)
      const enEmail = (c.email || '').toLowerCase().includes(term)
      const enCiudad = (c.ciudad || '').toLowerCase().includes(term)
      return enNombre || enEmail || enCiudad
    })
  }, [todosLosClientes, busqueda])

  // KPIs
  const totalClientes = todosLosClientes.length
  const clientesConProyectos = todosLosClientes.filter((c) =>
    projects.some((p) => getClienteNombre(p) === c.nombre)
  ).length
  const clientesSinProyectos = totalClientes - clientesConProyectos

  function handleGuardarNuevo(datos) {
    addCliente(datos)
    setMostrarNuevo(false)
  }

  function handleEditar(id, partial) {
    updateCliente(id, partial)
    // Keep the open modal in sync with the updated client.
    setClienteAbierto((prev) => (prev && prev.id === id ? { ...prev, ...partial } : prev))
  }

  function handleEliminar(id) {
    removeCliente(id)
    setClienteAbierto(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-brand-900">Clientes</h2>
          <p className="mt-1 text-sm text-surface-muted">
            {totalClientes} clientes en el estudio. Haz clic en un cliente para ver su información.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMostrarNuevo(true)}
          className="px-4 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Nuevo cliente
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
          <p className="text-2xl font-semibold text-brand-900">{totalClientes}</p>
          <p className="mt-1 text-sm text-surface-muted">Total clientes</p>
        </div>
        <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
          <p className="text-2xl font-semibold text-brand-900">{clientesConProyectos}</p>
          <p className="mt-1 text-sm text-surface-muted">Con proyectos</p>
        </div>
        <div className="bg-surface-card border border-brand-100 rounded-xl p-5">
          <p className="text-2xl font-semibold text-brand-900">{clientesSinProyectos}</p>
          <p className="mt-1 text-sm text-surface-muted">Sin proyectos</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted pointer-events-none"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre, email o ciudad"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-900 placeholder:text-surface-muted focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition"
        />
      </div>

      {/* Grid */}
      {clientesFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <ClienteCard key={cliente.id} cliente={cliente} proyectos={projects} onOpen={setClienteAbierto} navigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="bg-surface-card border border-brand-100 rounded-xl p-10 text-center">
          <p className="text-sm text-surface-muted">
            {busqueda ? 'No se han encontrado clientes con ese criterio de búsqueda.' : 'Aún no hay clientes.'}
          </p>
        </div>
      )}

      {/* Modales */}
      {mostrarNuevo ? (
        <NuevoClienteModal
          onClose={() => setMostrarNuevo(false)}
          onGuardar={handleGuardarNuevo}
        />
      ) : null}
      {clienteAbierto ? (
        <ClienteModal
          cliente={clienteAbierto}
          proyectos={projects}
          navigate={navigate}
          onClose={() => setClienteAbierto(null)}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      ) : null}
    </div>
  )
}