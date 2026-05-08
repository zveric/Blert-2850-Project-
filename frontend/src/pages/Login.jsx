 import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'
import logoImage from '../assets/logo.jpeg'
import {windowBreakpoints} from "../components/windowBreakpoints.js";

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const { isMobile } = windowBreakpoints();

    const navigate = useNavigate()

    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        display: "inline-block",
        width: '30vw',
        height: "100%",
        overflow: "hidden",  
        padding: "40px",
    }

    const handleLogin = () => {
        login(username, password).then(success => {
            if (success) {
                navigate('/dashboard')
            } else {
                setError('Invalid username or password')
            }
        })
    }

    
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4" style={cardStyle}>

                    <img src={logoImage} alt="Blert Logo" className="rounded mb-2" style={{ width: '35%', height: 'auto', display: 'block', margin: 'auto auto' }} />
                    <h2 style={{ fontWeight: 'bold' }}>Login</h2>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => {if (e.key === 'Enter') document.getElementById('password-input').focus()} } aria-label="Username"/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" id="password-input" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => {if (e.key === 'Enter') handleLogin()} } aria-label="Password"/>
                    </div>

                    <button className="btn btn-dark" onClick={handleLogin}>Login</button>
                    <p className="mt-3">Don't have an account? <a href="/register">Register</a></p>
                    
                </div>
            </div>
        </div>
    )
}

export default Login