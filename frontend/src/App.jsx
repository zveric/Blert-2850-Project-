import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/navbar'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import Login from './pages/Login'
import Register from './pages/Register'
import { getToken } from './api'
import './App.css'
 
function PrivateRoute({ children }) {
    if (!getToken()) {
        return <Navigate to="/login" replace />
    }
    return children
}
 
function App() {

    useEffect(() => {
        const call =() => fetch('/utils/update-database/', {
            headers: {'Authorization': `Token $ {getToken()}`}
        });

        call(); 
        const interval = setInterval(call , 15*60*1000); 
        return () => clearInterval(interval)
    }, []);

    return (
        <Routes>
            <Route path="/register" element={<Register />} />
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
 