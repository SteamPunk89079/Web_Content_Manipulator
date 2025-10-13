import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import DefaultResizer from './DefaultResizer.jsx'
import CustomResizer from './CustomResizer.jsx'
import WordToPdf from './WordToPdf.jsx'
import App4 from './App4.jsx'
import App5 from './App5.jsx'
import Footer from './Footer.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="app-container">
      <h1 className='app-card'style={{ display: "flex", gap: "10%", alignItems: "flex-start", justifyContent:"center"}}>FFmpeg Image Processor</h1>
      <div className='app-card'>
        <DefaultResizer />
      </div>
      <div className='app-card'>
        <CustomResizer />
      </div>
      <div className='app-card'>
        <WordToPdf />
      </div>
      <div className='app-card'>
        <App4 />
      </div>
      <div className='app-card'>
        <App5 />
      </div>
      <div className='app-card'>
        <Footer />
      </div>
    </div>
  </StrictMode>,
)
