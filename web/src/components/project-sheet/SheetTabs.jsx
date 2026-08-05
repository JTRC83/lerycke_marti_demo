// SheetTabs: vertical submenu with 6 tabs (PRD 03). The active item is
// highlighted with brand-50 background and a left border; pending items are
// dimmed so the user can see which documents still need work.

function IconClient() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPlan() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9h18M9 21V9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconBudget() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13h8M8 17h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconRender() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconMemo() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSummary() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const TABS = [
  { key: 'cliente', label: 'Cliente', Icon: IconClient },
  { key: 'plan', label: 'Plan', Icon: IconPlan },
  { key: 'presupuesto', label: 'Presupuesto', Icon: IconBudget },
  { key: 'renders', label: 'Renders', Icon: IconRender },
  { key: 'memoria', label: 'Memoria', Icon: IconMemo },
  { key: 'resumen', label: 'Resumen', Icon: IconSummary },
]

export default function SheetTabs({ activa, onChange, completitud }) {
  // Pending docs are dimmed so the user sees what still needs work. Resumen and
  // Cliente are always fully visible because they are always available.
  const pending = (key) =>
    completitud && !completitud[key] && key !== 'cliente' && key !== 'resumen'

  return (
    <nav className="bg-surface-card border border-brand-100 rounded-xl p-2 print:hidden">
      <ul className="space-y-1">
        {TABS.map(({ key, label, Icon }) => {
          const isActive = key === activa
          const isPending = pending(key)
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onChange(key)}
                className={[
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors',
                  isActive
                    ? 'bg-brand-50 text-brand-800 border-l-2 border-brand-700'
                    : 'text-brand-800 hover:bg-brand-50/50',
                  isPending && !isActive ? 'opacity-50' : '',
                ].join(' ')}
              >
                <span className={isActive ? 'text-brand-700' : 'text-surface-muted'}>
                  <Icon />
                </span>
                <span>{label}</span>
                {isPending ? (
                  <span className="ml-auto w-2 h-2 rounded-full bg-state-warning" title="Pendiente" />
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}