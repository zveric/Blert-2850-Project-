import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import LineChart from './Line-Chart'
import Navbar from './components/navbar'
import Map from "./components/map"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <section className="" id="Dashboard">
      <Navbar />

      <div className="container">
        <Map />
      </div>
    </section>
  )
}

export default App
