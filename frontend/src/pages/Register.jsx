import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api'
import logoImage from '../assets/logo.jpeg'

function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

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


    const handleRegister = () => {
        register(username, password).then(success => {
            if (success) {
                navigate('/login')
            } else {
                setError('Username already exists')
            }
        })
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4" style={cardStyle}>

                    <img src={logoImage} alt="Blert Logo" className="rounded mb-2" style={{ width: '35%', height: 'auto', display: 'block', margin: 'auto auto' }} />
                    <h2 style={{ fontWeight: 'bold' }}>Register</h2>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)}  onKeyDown={e => {if (e.key === 'Enter') document.getElementById('password-input').focus()} } aria-label="Username"/>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" id="password-input" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => {if (e.key === 'Enter') handleRegister()} } aria-label="Password"/>
                    </div>

                    <button className="btn btn-dark" onClick={handleRegister}>Register</button>
                    <p className="mt-3">Already have an account? <a href="/login">Login</a></p>

                </div>
            </div>
        </div>
    )
}

export default Register