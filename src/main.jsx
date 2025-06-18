import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChequeProvider } from './context/ChequeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChequeProvider>
      <App />
    </ChequeProvider>
  </StrictMode>,
)
