import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'
import App2 from './App2.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="app-container">
      <div className='app-card'>
        <App />
      </div>
      <div className='app-card'>
        <App2 />
      </div>
    </div>
  </StrictMode>,
)
