import { projects } from './projects'

// KPIs derived from the projects array per PRD 01.
// Documentos generados = sum of completed documents across projects.

function completedDocsCount(project) {
  const { docs } = project
  let count = 0
  if (docs.presupuesto) count += 1
  if (docs.plan) count += 1
  if (docs.memoria) count += 1
  // Renders count as generated when generados === total.
  if (docs.renders.generados === docs.renders.total) count += 1
  return count
}

const totalDocumentos = projects.reduce(
  (acc, p) => acc + completedDocsCount(p),
  0,
)

export const kpis = [
  {
    id: 'totales',
    etiqueta: 'Proyectos totales',
    valor: projects.length,
    icon: 'folder',
  },
  {
    id: 'activos',
    etiqueta: 'Activos',
    valor: projects.filter((p) => p.estado === 'activo').length,
    icon: 'bolt',
  },
  {
    id: 'borradores',
    etiqueta: 'Borradores',
    valor: projects.filter((p) => p.estado === 'borrador').length,
    icon: 'pencil',
  },
  {
    id: 'documentos',
    etiqueta: 'Documentos generados',
    valor: totalDocumentos,
    icon: 'doc',
  },
]