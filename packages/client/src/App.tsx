import { useState } from 'react'
import type { RegisteredUser } from '@app/shared'
import RegisterForm from './modules/auth/components'
import LoginForm from './modules/auth/components/LoginForm'
import Dashboard from './modules/dashboard/components/Dashboard'
import './App.css'

function App() {
  const [view, setView] = useState<'register' | 'login' | 'dashboard'>('register')
  const [user, setUser] = useState<RegisteredUser | null>(null)

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
        {view === 'register' && <RegisterForm onLogin={() => setView('login')} />}
        {view === 'login' && (
          <LoginForm
            onLogin={(authenticatedUser) => {
              setUser(authenticatedUser)
              setView('dashboard')
            }}
            onRegister={() => setView('register')}
          />
        )}
        {view === 'dashboard' && user && (
          <Dashboard user={user} />
        )}
      </div>
    </main>
  )
}

export default App
