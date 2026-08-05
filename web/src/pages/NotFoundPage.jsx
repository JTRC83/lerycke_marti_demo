import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-900 text-white text-center px-6">
      <p className="text-6xl font-semibold">404</p>
      <p className="mt-3 text-white/70">La página que buscas no existe.</p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-6 px-5 py-2 rounded bg-white text-brand-900 text-sm font-medium hover:bg-brand-50 transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  )
}