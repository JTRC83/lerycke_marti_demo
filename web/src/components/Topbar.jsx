import { useNavigate, useLocation } from 'react-router-dom'

// Global top bar: page title on the left, primary action on the right.
// "Nuevo proyecto" button only shows on the dashboard (Proyectos page).
export default function Topbar({ title = 'Proyectos' }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const showNuevoProyecto = pathname === '/dashboard'

  return (
    <header className="sticky top-0 z-20 h-16 bg-surface-card border-b border-brand-100 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-brand-900">{title}</h1>
      {showNuevoProyecto ? (
        <button
          type="button"
          onClick={() => navigate('/nuevo-proyecto')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Nuevo proyecto
        </button>
      ) : null}
    </header>
  )
}