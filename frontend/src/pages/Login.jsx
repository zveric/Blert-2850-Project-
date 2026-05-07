import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'
import logoImage from '../assets/logo.jpeg'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const navigate = useNavigate()

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
                <div className="col-md-4">

                    <img src={logoImage} alt="Blert Logo" className="rounded mb-2" />
                    <h2>Blert Login</h2>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    <button className="btn btn-dark" onClick={handleLogin}>Login</button>

                </div>
            </div>
        </div>
    )
}

export default Login