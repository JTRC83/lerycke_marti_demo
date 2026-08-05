import { createContext, useContext, useMemo, useState } from 'react'

// Demo AuthContext. Simulated auth with setTimeout, no persistence.
// On reload the session is lost (demo behaviour per PRD 00).

const AuthContext = createContext(null)

// Demo credentials. Only this exact pair grants access.
const DEMO_EMAIL = 'admin@example.com'
const DEMO_PASS = 'secret'
const DEMO_USER = {
  id: 'usr-001',
  nombre: 'Lerycke',
  email: DEMO_EMAIL,
}

class AuthError extends Error {
  constructor(message) {
    super(message)
    this.name = 'AuthError'
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const sesionIniciada = user !== null

  // Validates exact demo credentials. Throws AuthError on mismatch.
  async function login(email, pass) {
    await delay(600)
    if (email !== DEMO_EMAIL || pass !== DEMO_PASS) {
      throw new AuthError('Credenciales incorrectas.')
    }
    setUser(DEMO_USER)
    return DEMO_USER
  }

  // Registration is demo-only: any name + email + pass (>=6) creates a session.
  async function registro(nombre, email) {
    await delay(600)
    const newUser = { ...DEMO_USER, nombre: nombre || DEMO_USER.nombre, email }
    setUser(newUser)
    return newUser
  }

  function logout() {
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, sesionIniciada, login, registro, logout }),
    [user, sesionIniciada],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}