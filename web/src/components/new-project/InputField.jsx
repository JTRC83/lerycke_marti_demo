// InputField: text/email/tel input matching the login FormField style (rounded-xl).
export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-brand-800 mb-1">
        {label}
        {required ? <span className="text-state-danger"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={[
          'w-full px-3 py-2.5 rounded-xl border bg-white text-brand-900 placeholder:text-surface-muted',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition',
          error ? 'border-state-danger' : 'border-brand-200',
        ].join(' ')}
      />
      {error ? <p className="mt-1 text-xs text-state-danger">{error}</p> : null}
    </div>
  )
}