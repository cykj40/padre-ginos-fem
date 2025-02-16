import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { router } from '@tanstack/react-router'

// Wait for the router to be ready before rendering
await router.load()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
) 