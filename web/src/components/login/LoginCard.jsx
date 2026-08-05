import BrandHeader from './BrandHeader.jsx'
import AuthTabs from './AuthTabs.jsx'
import LoginForm from './LoginForm.jsx'
import RegisterForm from './RegisterForm.jsx'

export default function LoginCard({ mode, onModeChange, onSubmit, enviando, authError }) {
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
      <BrandHeader />
      <AuthTabs mode={mode} onChange={onModeChange} />

      {authError ? (
        <div className="mb-4 rounded-xl border border-state-danger bg-state-danger/5 px-3 py-2 text-sm text-state-danger">
          {authError}
        </div>
      ) : null}

      {mode === 'login' ? (
        <LoginForm onSubmit={onSubmit} enviando={enviando} />
      ) : (
        <RegisterForm onSubmit={onSubmit} enviando={enviando} />
      )}

      {mode === 'login' ? (
        <div className="mt-4 rounded-xl bg-surface-base px-3 py-2 text-center text-xs text-surface-muted">
          Demo: <span className="font-medium text-brand-800">admin@example.com</span>
          {' / '}
          <span className="font-medium text-brand-800">secret</span>
        </div>
      ) : null}

      <p className="mt-4 text-center text-xs text-surface-muted">
        Demo LERYCKEMARTI #designstudio
      </p>
    </div>
  )
}