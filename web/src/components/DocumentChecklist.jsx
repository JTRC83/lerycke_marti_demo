import { formatEur } from '../data/projects.js'

// Checklist row: check icon when generated, empty circle when pending.
function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-state-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EmptyIcon() {
  return (
    <svg className="w-4 h-4 text-surface-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

// Single checklist item: icon + label.
function Item({ generated, label }) {
  return (
    <li className="flex items-center gap-2 py-1">
      {generated ? <CheckIcon /> : <EmptyIcon />}
      <span className="text-sm text-brand-800">{label}</span>
    </li>
  )
}

export default function DocumentChecklist({ docs }) {
  const rendersDone = docs.renders.generados === docs.renders.total
  const items = [
    { label: 'Presupuesto', generated: docs.presupuesto },
    { label: 'Plan', generated: docs.plan },
    { label: 'Memoria', generated: docs.memoria },
    { label: 'Renders', generated: rendersDone },
  ]
  const completed = items.filter((i) => i.generated).length

  return (
    <div className="mt-4 pt-4 border-t border-brand-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-muted">
          Documentos
        </p>
        <p className="text-xs text-surface-muted">Generados {completed}/4</p>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        {items.map((it) => (
          <Item key={it.label} generated={it.generated} label={it.label} />
        ))}
      </ul>
    </div>
  )
}