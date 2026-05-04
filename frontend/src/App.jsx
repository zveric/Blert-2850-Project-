import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import './App.css'

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analysis" element={<Analysis />} />
            </Routes>
        </>
    )
}

export default App