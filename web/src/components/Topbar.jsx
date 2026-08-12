import { useLocation } from 'react-router-dom'

// Global top bar: page title on the left. Primary actions live inside each
// page's content area (e.g. "Nuevo proyecto" in the dashboard, "Nuevo cliente"
// in the Clientes page), not here.
export default function Topbar({ title = 'Proyectos' }) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-surface-card border-b border-brand-100 flex items-center px-6">
      <h1 className="text-lg font-semibold text-brand-900">{title}</h1>
    </header>
  )
}