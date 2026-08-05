import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useProjects } from '../context/ProjectsContext.jsx'
import { getClienteNombre, getCompletitud } from '../utils/project.js'
import SheetHeader from '../components/project-sheet/SheetHeader.jsx'
import SheetTabs from '../components/project-sheet/SheetTabs.jsx'
import SheetContent from '../components/project-sheet/SheetContent.jsx'

// Valid tab keys so the query param can't inject arbitrary values.
const TABS_VALIDAS = ['cliente', 'plan', 'presupuesto', 'renders', 'memoria', 'resumen']

// ProjectSheetPage: shell container for a single project (PRD 03).
// Reads :id, loads the project, and mounts header + grid (tabs | content).
// The active tab defaults to "cliente" but can be set via ?tab= query param,
// so navigating from the Presupuestos page opens directly on that tab.
export default function ProjectSheetPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getProject } = useProjects()
  const proyecto = getProject(id)

  const tabInicial = searchParams.get('tab')
  const [pestanaActiva, setPestanaActiva] = useState(
    TABS_VALIDAS.includes(tabInicial) ? tabInicial : 'cliente',
  )
  const [exportando, setExportando] = useState(false)
  const completitud = getCompletitud(proyecto)

  // Toggle a print-layout class on body during export so the @media print CSS
  // hides the sidebar/topbar and shows only the sheet. It is removed after.
  function handleExport() {
    setExportando(true)
    document.body.classList.add('printing-sheet')
    // Let React render with the class, then open the print dialog.
    setTimeout(() => {
      window.print()
      document.body.classList.remove('printing-sheet')
      setExportando(false)
    }, 50)
  }

  if (!proyecto) {
    // Redirect to the dashboard when the project id is unknown.
    return <Navigate to="/dashboard" replace />
  }

  // Precompute the client label used by the header.
  const proyectoConLabel = { ...proyecto, clienteLabel: getClienteNombre(proyecto) }

  return (
    <div className="space-y-5">
      <SheetHeader proyecto={proyectoConLabel} onExport={handleExport} exportando={exportando} />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
        <SheetTabs
          activa={pestanaActiva}
          onChange={setPestanaActiva}
          completitud={completitud}
        />
        <SheetContent
          activa={pestanaActiva}
          proyecto={proyectoConLabel}
          onIrDashboard={() => navigate('/dashboard')}
          onTabChange={setPestanaActiva}
        />
      </div>
    </div>
  )
}