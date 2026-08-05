// SelectField: labeled dropdown matching FormField rounded-xl style.
// options: array of strings OR array of { value, label } objects.
export default function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  error,
}) {
  const normalize = (opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt

  return (
    <div className="mb-4">
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-brand-800 mb-1">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={[
            'w-full appearance-none px-3 py-2.5 rounded-xl border bg-white text-brand-900',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition pr-9',
            value ? 'text-brand-900' : 'text-surface-muted',
            error ? 'border-state-danger' : 'border-brand-200',
          ].join(' ')}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => {
            const { value: v, label: l } = normalize(opt)
            return (
              <option key={v} value={v}>
                {l}
              </option>
            )
          })}
        </select>
        <svg
          className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-surface-muted pointer-events-none"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error ? <p className="mt-1 text-xs text-state-danger">{error}</p> : null}
    </div>
  )
}