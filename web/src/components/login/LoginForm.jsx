import { useState } from 'react'
import FormField from './FormField.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginForm({ onSubmit, enviando }) {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!email) e.email = 'Introduce tu email.'
    else if (!EMAIL_RE.test(email)) e.email = 'Email no válido.'
    if (!pass) e.pass = 'Introduce tu contraseña.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({ email, pass })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        error={errors.email}
        autoComplete="email"
      />
      <FormField
        id="login-pass"
        label="Contraseña"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="********"
        error={errors.pass}
        autoComplete="current-password"
      />

      <button
        type="submit"
        disabled={enviando}
        className="w-full mt-2 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {enviando ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}