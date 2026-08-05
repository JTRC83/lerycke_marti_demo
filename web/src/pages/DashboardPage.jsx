import KpiCard from '../components/KpiCard.jsx'
import ProjectCard from '../components/ProjectCard.jsx'
import { kpis } from '../data/kpis.js'
import { useProjects } from '../context/ProjectsContext.jsx'

export default function DashboardPage() {
  const { projects } = useProjects()

  return (
    <>
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <KpiCard key={k.id} etiqueta={k.etiqueta} valor={k.valor} icon={k.icon} />
        ))}
      </div>

      {/* Projects grid */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-surface-muted mb-4">
          Gestión de proyectos de interiorismo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </>
  )
}