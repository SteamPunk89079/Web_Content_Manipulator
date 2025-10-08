import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'
import App2 from './App2.jsx'
import App3 from './App3.jsx'
import App4 from './App4.jsx'
import App5 from './App5.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="app-container">
      <h1 className='app-card'style={{ display: "flex", gap: "10%", alignItems: "flex-start", justifyContent:"center"}}>FFmpeg Image Processor</h1>
      <div className='app-card'>
        <App />
      </div>
      <div className='app-card'>
        <App2 />
      </div>
      <div className='app-card'>
        <App3 />
      </div>
      <div className='app-card'>
        <App4 />
      </div>
      <div className='app-card'>
        <App5 />
      </div>
    </div>
  </StrictMode>,
)
