// StepIndicator: two-step visual indicator for the stepper.
// Active step is highlighted, completed step shows a check, next step is muted.
function StepDot({ number, label, state }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={[
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border transition-colors',
          state === 'active'
            ? 'bg-brand-700 text-white border-brand-700'
            : state === 'done'
              ? 'bg-brand-700 text-white border-brand-700'
              : 'bg-surface-card text-surface-muted border-brand-200',
        ].join(' ')}
      >
        {state === 'done' ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          number
        )}
      </span>
      <span
        className={[
          'text-sm font-medium',
          state === 'active' ? 'text-brand-900' : 'text-surface-muted',
        ].join(' ')}
      >
        {number}. {label}
      </span>
    </div>
  )
}

export default function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-4">
      <StepDot number={1} label="Cliente" state={step > 1 ? 'done' : 'active'} />
      <div className="flex-1 h-px bg-brand-100 max-w-[48px]" />
      <StepDot number={2} label="Datos del proyecto" state={step === 2 ? 'active' : 'next'} />
    </div>
  )
}