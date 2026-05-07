import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import Login from './pages/Login'
import { getToken } from './api'
import './App.css'
 
// if there is no token redirect to login
function PrivateRoute({ children }) {
    if (!getToken()) {
        return <Navigate to="/login" replace />
    }
    return children
}
 
function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <Navbar />
                    <Dashboard />
                </PrivateRoute>
            } />
            <Route path="/analysis" element={
                <PrivateRoute>
                    <Navbar />
                    <Analysis />
                </PrivateRoute>
            } />
        </Routes>
    )
}
 
export default App
 