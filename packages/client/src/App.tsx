import RegisterForm from './modules/auth/components'
import './App.css'

function App() {
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
        <RegisterForm />
      </div>
    </main>
  )
}

export default App
