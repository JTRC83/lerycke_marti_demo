import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjects } from '../context/ProjectsContext.jsx'
import { clientes } from '../data/clientes.js'
import { getClienteNombre } from '../utils/project.js'

// ClientesPage: listado de clientes del estudio con modal de información.

function ClienteCard({ cliente, proyectos, onOpen }) {
  const proyectosCliente = proyectos.filter((p) => getClienteNombre(p) === cliente.nombre)

  return (
    <div
      className="bg-surface-card border border-brand-100 rounded-xl p-6 cursor-pointer hover:border-brand-300 transition-colors"
      onClick={() => onOpen(cliente)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-base font-semibold">
            {cliente.nombre.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-brand-900">{cliente.nombre}</h3>
            {cliente.email ? <p className="text-xs text-surface-muted">{cliente.email}</p> : null}
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
          {proyectosCliente.length} {proyectosCliente.length === 1 ? 'proyecto' : 'proyectos'}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-xs text-surface-muted">
        {cliente.telefono ? <p>Tel: {cliente.telefono}</p> : null}
        {cliente.direccion ? <p>{cliente.direccion}</p> : null}
        {cliente.ciudad ? <p>{cliente.ciudad}</p> : null}
      </div>

      <p className="mt-3 text-xs text-brand-700 font-medium">Ver información →</p>
    </div>
  )
}

function ClienteModal({ cliente, proyectos, navigate, onClose }) {
  const proyectosCliente = proyectos.filter((p) => getClienteNombre(p) === cliente.nombre)

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
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center text-lg font-semibold">
              {cliente.nombre.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-brand-900">{cliente.nombre}</h3>
              <p className="text-sm text-surface-muted">
                {proyectosCliente.length} {proyectosCliente.length === 1 ? 'proyecto' : 'proyectos'} asociados
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-base text-surface-muted flex items-center justify-center hover:bg-brand-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Datos de contacto */}
        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-muted mb-3">Datos de contacto</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoField label="Email" value={cliente.email} />
              <InfoField label="Teléfono" value={cliente.telefono} />
              <InfoField label="Dirección" value={cliente.direccion} />
              <InfoField label="Ciudad" value={cliente.ciudad} />
              <InfoField label="Código postal" value={cliente.codigoPostal} />
            </div>
          </div>

          {/* Proyectos asociados */}
          {proyectosCliente.length > 0 ? (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-muted mb-3">Proyectos asociados</h4>
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      p.estado === 'activo' ? 'bg-state-success/10 text-state-success' :
                      p.estado === 'completado' ? 'bg-brand-100 text-brand-700' :
                      'bg-surface-base text-surface-muted'
                    }`}>{p.estado}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-muted mb-3">Proyectos asociados</h4>
              <p className="text-sm text-surface-muted">Este cliente aún no tiene proyectos asociados.</p>
            </div>
          )}
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
  const [clienteAbierto, setClienteAbierto] = useState(null)

  // Merge seed clientes with any clientes from new projects
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
  const todosLosClientes = [...clientes, ...clientesExtra]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-brand-900">Clientes</h2>
        <p className="mt-1 text-sm text-surface-muted">
          {todosLosClientes.length} clientes en el estudio. Haz clic en un cliente para ver su información.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {todosLosClientes.map((cliente) => (
          <ClienteCard key={cliente.id} cliente={cliente} proyectos={projects} onOpen={setClienteAbierto} />
        ))}
      </div>

      {clienteAbierto ? (
        <ClienteModal
          cliente={clienteAbierto}
          proyectos={projects}
          navigate={navigate}
          onClose={() => setClienteAbierto(null)}
        />
      ) : null}
    </div>
  )
}