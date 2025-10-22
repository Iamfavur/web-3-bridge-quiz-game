import './App.css'
import Quiz from './components/Quiz'

function App() {

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Quiz Game</h1>
        <p className="subtitle">Test your knowledge — one question at a time</p>
      </header>

      <main className="app-main">
        <Quiz />
      </main>

      <footer className="app-footer">
        <small>Built with React + TypeScript + Vite</small>
      </footer>
    </div>
  )
}

export default App
