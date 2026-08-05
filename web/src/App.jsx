import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import AppShell from './components/AppShell.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NewProjectPage from './pages/NewProjectPage.jsx'
import ProjectSheetPage from './pages/ProjectSheetPage.jsx'
import ClientesPage from './pages/ClientesPage.jsx'
import PresupuestosPage from './pages/PresupuestosPage.jsx'
import RendersPage from './pages/RendersPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// Placeholder for protected routes outside Part 1 scope.
function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h2 className="text-2xl font-semibold text-brand-800">{title}</h2>
      <p className="mt-2 text-surface-muted">Próximamente</p>
    </div>
  )
}

// Wraps a page with the protected AppShell layout.
function ProtectedRoute({ children }) {
  const { sesionIniciada } = useAuth()
  if (!sesionIniciada) return <Navigate to="/login" replace />
  return <AppShell>{children}</AppShell>
}

export default function App() {
  const { sesionIniciada } = useAuth()

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={sesionIniciada ? '/dashboard' : '/login'} replace />}
      />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <ClientesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/presupuestos"
        element={
          <ProtectedRoute>
            <PresupuestosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/renders"
        element={
          <ProtectedRoute>
            <RendersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nuevo-proyecto"
        element={
          <ProtectedRoute>
            <NewProjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/proyecto/:id"
        element={
          <ProtectedRoute>
            <ProjectSheetPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}