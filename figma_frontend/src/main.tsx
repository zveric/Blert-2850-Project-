import React from 'react'
import ReactDOM from 'react-dom/client'
// This imports your App component from the app folder
import App from './app/App' 
import './styles/index.css'
// Import your main styles if you have a global css file (e.g., in your styles folder)
// import './styles/globals.css' 

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

