import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import RegisterForm from './modules/auth/components'
import ProtectedRoute from './modules/auth/components/ProtectedRoute'
import { AuthProvider, useAuth } from './modules/auth/context/index'
import LoginForm from './modules/auth/components/LoginForm'
import Dashboard from './modules/dashboard/components/Dashboard'
import './App.css'

function AppRoutes() {
  const { user, signIn, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <main className="registration-page">
      <aside className="brand-panel">
        <div className="brand-lockup">
          <span className="brand-symbol">SR</span>
          <span>Slow Rush</span>
        </div>
        <div className="brand-copy">
          <p className="brand-kicker">Apuestas de carreras de caracoles</p>
          <p className="brand-statement">Elige tu caracol. Sigue cada carrera.</p>
        </div>
        <div className="brand-footer">La emoción de las carreras, a su propio ritmo.</div>
      </aside>
      <div className="form-stage">
        <Routes>
          <Route
            path="/"
            element={<RegisterForm onLogin={() => navigate('/login')} />}
          />
          <Route
            path="/login"
            element={
              <LoginForm
                onLogin={(authenticatedUser) => {
                  signIn(authenticatedUser)
                  navigate('/dashboard', { replace: true })
                }}
                onRegister={() => navigate('/', { replace: true })}
              />
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard
                    user={user}
                    onLogout={() => {
                      signOut()
                      navigate('/login', { replace: true })
                    }}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
