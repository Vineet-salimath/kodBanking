import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'rgba(15, 15, 30, 0.95)',
          color: '#e2e8f0',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          fontSize: '0.875rem',
        },
        success: {
          iconTheme: { primary: '#818cf8', secondary: '#1e1b4b' },
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#1e1b4b' },
        },
      }}
    />
  </React.StrictMode>,
)
