import { createContext, useContext, useMemo, useState } from 'react'
import { materialesSeed } from '../data/materiales.js'

// MaterialesContext: CRUD of materials catalog.
const MaterialesContext = createContext(null)

export function MaterialesProvider({ children }) {
  const [materiales, setMateriales] = useState(materialesSeed)

  function addMaterial(material) {
    const id = material.id || `mat-${Date.now()}`
    setMateriales((prev) => [{ ...material, id }, ...prev])
    return id
  }

  function updateMaterial(id, partial) {
    setMateriales((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...partial } : m)),
    )
  }

  function deleteMaterial(id) {
    setMateriales((prev) => prev.filter((m) => m.id !== id))
  }

  function getMaterial(id) {
    return materiales.find((m) => m.id === id) || null
  }

  const value = useMemo(
    () => ({ materiales, addMaterial, updateMaterial, deleteMaterial, getMaterial }),
    [materiales],
  )

  return (
    <MaterialesContext.Provider value={value}>{children}</MaterialesContext.Provider>
  )
}

export function useMateriales() {
  const ctx = useContext(MaterialesContext)
  if (!ctx) {
    throw new Error('useMateriales must be used within a MaterialesProvider')
  }
  return ctx
}