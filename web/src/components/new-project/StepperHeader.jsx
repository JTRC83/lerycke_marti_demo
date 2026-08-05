import StepIndicator from './StepIndicator.jsx'

// StepperHeader: title + tagline for the "Nuevo proyecto" screen.
// Two-step indicator is rendered by StepIndicator.
export default function StepperHeader({ step }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold text-brand-900">Nuevo proyecto</h2>
      <p className="mt-1 text-sm text-surface-muted">
        De la visita al cliente a la memoria de calidades, un solo flujo
      </p>
      <div className="mt-5">
        <StepIndicator step={step} />
      </div>
    </div>
  )
}