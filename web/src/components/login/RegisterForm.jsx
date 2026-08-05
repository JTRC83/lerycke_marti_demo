import { useState } from 'react'
import FormField from './FormField.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RegisterForm({ onSubmit, enviando }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!nombre.trim()) e.nombre = 'Introduce tu nombre.'
    if (!email) e.email = 'Introduce tu email.'
    else if (!EMAIL_RE.test(email)) e.email = 'Email no válido.'
    if (!pass) e.pass = 'Introduce una contraseña.'
    else if (pass.length < 6) e.pass = 'Mínimo 6 caracteres.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({ nombre, email, pass })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        id="reg-nombre"
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        error={errors.nombre}
        autoComplete="name"
      />
      <FormField
        id="reg-email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        error={errors.email}
        autoComplete="email"
      />
      <FormField
        id="reg-pass"
        label="Contraseña"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        placeholder="Mínimo 6 caracteres"
        error={errors.pass}
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={enviando}
        className="w-full mt-2 py-2.5 rounded-xl bg-brand-700 text-white text-sm font-medium hover:bg-brand-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {enviando ? 'Creando...' : 'Crear cuenta'}
      </button>
    </form>
  )
}