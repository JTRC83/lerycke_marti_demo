import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { useProjects } from '../context/ProjectsContext.jsx'

// Global layout: fixed sidebar + topbar + routed content via Outlet.
// Page title is derived from the current route.
const titlesByPath = {
  '/dashboard': 'Proyectos',
  '/dashboard-economico': 'Dashboard',
  '/clientes': 'Clientes',
  '/presupuestos': 'Presupuestos',
  '/renders': 'Renders',
  '/nuevo-proyecto': 'Nuevo proyecto',
}

// Extracts the project id from a /proyecto/:id route.
function projectIdFromPath(pathname) {
  const m = pathname.match(/^\/proyecto\/(.+)$/)
  return m ? decodeURIComponent(m[1]) : null
}

function usePageTitle() {
  const { pathname } = useLocation()
  const { getProject } = useProjects()
  if (titlesByPath[pathname]) return titlesByPath[pathname]
  if (pathname.startsWith('/proyecto/')) {
    const id = projectIdFromPath(pathname)
    const proyecto = id ? getProject(id) : null
    return proyecto ? proyecto.nombre : 'Ficha de proyecto'
  }
  return 'Proyectos'
}

export default function AppShell({ children }) {
  const title = usePageTitle()

  return (
    <div className="min-h-screen bg-surface-base">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar title={title} />
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}