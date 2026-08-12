import { createContext, useContext, useMemo, useState } from 'react'
import { clientes as seedClientes } from '../data/clientes.js'

// ClientesContext: in-memory client store for the demo (lightweight CRM).
// Seeded from data/clientes.js so the Clientes page shows the 5 demo clients.
// New clients created from the Clientes page or the "Nuevo proyecto" stepper
// are added here so the CRM reflects them without a reload.

const ClientesContext = createContext(null)

export function ClientesProvider({ children }) {
  const [clientes, setClientes] = useState(seedClientes)

  // Adds a client to the store. Generates an id when not provided.
  // Returns the id so the caller can reference it (e.g. NewProjectPage).
  function addCliente(cliente) {
    const id = cliente.id || `cli-${Date.now()}`
    const nuevo = { ...cliente, id }
    setClientes((prev) => [nuevo, ...prev])
    return id
  }

  // Finds a client by id. Returns null when missing.
  function getCliente(id) {
    return clientes.find((c) => c.id === id) || null
  }

  // Merges partial updates into a client by id.
  function updateCliente(id, partial) {
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    )
  }

  // Removes a client by id. Caller is responsible for ensuring the client
  // has no associated projects (enforced in the UI).
  function removeCliente(id) {
    setClientes((prev) => prev.filter((c) => c.id !== id))
  }

  const value = useMemo(
    () => ({ clientes, addCliente, getCliente, updateCliente, removeCliente }),
    [clientes],
  )

  return (
    <ClientesContext.Provider value={value}>{children}</ClientesContext.Provider>
  )
}

export function useClientes() {
  const ctx = useContext(ClientesContext)
  if (!ctx) {
    throw new Error('useClientes must be used within a ClientesProvider')
  }
  return ctx
}