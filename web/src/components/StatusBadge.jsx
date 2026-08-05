// Project status badge using the brand palette.
const styles = {
  borrador: 'bg-brand-50 text-brand-700 border-brand-200',
  activo: 'bg-brand-700 text-white border-brand-700',
  completado: 'bg-brand-900 text-white border-brand-900',
}

const labels = {
  borrador: 'borrador',
  activo: 'activo',
  completado: 'completado',
}

export default function StatusBadge({ estado }) {
  const cls = styles[estado] ?? styles.borrador
  const label = labels[estado] ?? estado

  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium border',
        cls,
      ].join(' ')}
    >
      {label}
    </span>
  )
}