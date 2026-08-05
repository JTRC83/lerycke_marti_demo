// Tab switch between login and register modes.
export default function AuthTabs({ mode, onChange }) {
  const tabs = [
    { id: 'login', label: 'Iniciar sesión' },
    { id: 'registro', label: 'Crear cuenta' },
  ]

  return (
    <div className="grid grid-cols-2 mt-6 mb-6 border-b border-brand-100">
      {tabs.map((t) => {
        const active = mode === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={[
              'py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              active
                ? 'border-brand-700 text-brand-900'
                : 'border-transparent text-surface-muted hover:text-brand-700',
            ].join(' ')}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}