import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1 className="title">Vibe Overlay Test App</h1>
        <p className="subtitle">This is a test app for the Vibe Viewer agentic overlay system</p>
      </div>

      <div className="card">
        <button
          className="primary-button"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="description">
          Click the button to test interactivity
        </p>
      </div>

      <div className="features">
        <h2>Features to Comment On</h2>
        <div className="feature-grid">
          <div className="feature-card blue">
            <h3>Blue Card</h3>
            <p>This is a blue feature card</p>
          </div>
          <div className="feature-card green">
            <h3>Green Card</h3>
            <p>This is a green feature card</p>
          </div>
          <div className="feature-card red">
            <h3>Red Card</h3>
            <p>This is a red feature card</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>Footer content goes here</p>
      </footer>
    </>
  )
}

export default App