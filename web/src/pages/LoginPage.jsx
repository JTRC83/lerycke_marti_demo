import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoginBackground from '../components/login/LoginBackground.jsx'
import LoginCard from '../components/login/LoginCard.jsx'

export default function LoginPage() {
  const { login, registro } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login')
  const [enviando, setEnviando] = useState(false)
  const [authError, setAuthError] = useState(null)

  async function handleSubmit({ nombre, email, pass }) {
    setEnviando(true)
    setAuthError(null)
    try {
      if (mode === 'login') {
        await login(email, pass)
      } else {
        await registro(nombre, email, pass)
      }
      navigate('/dashboard')
    } catch (err) {
      setAuthError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <LoginBackground>
      <LoginCard
        mode={mode}
        onModeChange={setMode}
        onSubmit={handleSubmit}
        enviando={enviando}
        authError={authError}
      />
    </LoginBackground>
  )
}