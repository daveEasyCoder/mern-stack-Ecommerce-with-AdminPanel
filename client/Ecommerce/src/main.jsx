import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import EcommerceProvider from '../context/EcommerceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EcommerceProvider>
        <App />
    </EcommerceProvider>
  </StrictMode>,
)
