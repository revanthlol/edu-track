 import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App.jsx'
    import './index.css'
    import { ThemeProvider } from './providers/ThemeProvider.jsx' // <-- IMPORT

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <ThemeProvider> //  -- WRAP HERE
          <App />
        </ThemeProvider>
      </React.StrictMode>,
    )