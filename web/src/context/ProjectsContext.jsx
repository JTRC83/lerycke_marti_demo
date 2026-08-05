import { createContext, useContext, useMemo, useState } from 'react'
import { projects as seedProjects } from '../data/projects.js'

// ProjectsContext: in-memory project store for the demo.
// Seeded from data/projects.js so the dashboard shows the 3 demo projects.
// New projects created via the "Nuevo proyecto" stepper are added here so
// the dashboard reflects them without a reload.

const ProjectsContext = createContext(null)

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(seedProjects)

  // Adds a project to the store. Generates an id when not provided.
  // Returns the id so the caller can navigate to /proyecto/:id.
  function addProject(proyecto) {
    const id = proyecto.id || `prj-${Date.now()}`
    const nuevo = { ...proyecto, id }
    setProjects((prev) => [nuevo, ...prev])
    return id
  }

  // Finds a project by id. Returns null when missing.
  function getProject(id) {
    return projects.find((p) => p.id === id) || null
  }

  // Merges partial updates into a project by id.
  function updateProject(id, partial) {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    )
  }

  const value = useMemo(
    () => ({ projects, addProject, getProject, updateProject }),
    [projects],
  )

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  )
}

export function useProjects() {
  const ctx = useContext(ProjectsContext)
  if (!ctx) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }
  return ctx
}