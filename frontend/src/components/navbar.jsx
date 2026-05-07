import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' 
import '../styles/navbar.css'
import '../index.css'
import { Link } from 'react-router-dom'
import { FaRegMap } from "react-icons/fa";
import logoImage from '../assets/logo.jpeg'
import { logout } from '../api'

function Navbar() {

    const navBarStyle = {
        display: "flex",
        flexDirection: "row",
        gap: "20px",
        margin: "0 150px",
        width: "100%"
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">

            <div style={navBarStyle}>

                <img src={logoImage} alt="Blert Logo" className={"navbar-logo"}/>
                <a className="navbar-brand d-flex align-items-center gap-2" href="/">
                    Blert
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>

                </button>

                <div className="collapse navbar-collapse" id="navbarNav">

                    <ul className="navbar-nav ms-auto gap-5">

                        <li className="nav-item">
                            <Link className="nav-link" to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/analysis">Analysis</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login" onClick={logout}>Logout</Link>
                        </li>
                    </ul>

                </div>

            </div>

        </nav>
    )
}

export default Navbar