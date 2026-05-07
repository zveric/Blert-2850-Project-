import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api'
import logoImage from '../assets/logo.jpeg'

function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    const navigate = useNavigate()

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
                <div className="col-md-4">

                    <img src={logoImage} alt="Blert Logo" className="rounded-circle mb-2" width="60" />
                    <h2>Blert Register</h2>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    <button className="btn btn-dark" onClick={handleRegister}>Register</button>

                </div>
            </div>
        </div>
    )
}

export default Register