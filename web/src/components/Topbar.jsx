import { useLocation } from 'react-router-dom'

// Global top bar: page title on the left. Primary actions live inside each
// page's content area (e.g. "Nuevo proyecto" in the dashboard, "Nuevo cliente"
// in the Clientes page), not here.
export default function Topbar({ title = 'Proyectos', onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-surface-card border-b border-brand-100 flex items-center gap-3 px-4 sm:px-6">
      <button
        type="button"
        aria-label="Abrir menú"
        onClick={onMenuClick}
        className="lg:hidden -ml-1 p-2 rounded-lg text-brand-900 hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <h1 className="text-lg font-semibold text-brand-900 truncate flex-1">{title}</h1>
    </header>
  )
}