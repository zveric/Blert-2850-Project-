import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' 
import '../styles/navbar.css'
import '../index.css'
import { FaRegMap } from "react-icons/fa";
import logoImage from '../assets/logo.jpeg'

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">

            <div className="container">

                <a className="navbar-brand d-flex align-items-center gap-2" href="/">

                    Blert
                </a>
                <img src={logoImage} alt="Blert Logo" className={"navbar-logo"}/>

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
                            <a className="nav-link" href="/dashboard">Dashboard</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/analysis">Analysis</a>
                        </li>

                    </ul>

                </div>

            </div>

        </nav>
    )
}

export default Navbar