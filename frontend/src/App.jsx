import { useState } from 'react'
import LineChart from './Line-Chart'
import Navbar from './components/navbar'
import Map from "./components/map"
import AlertBtn from './components/alert-btn'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <section className="d-flex flex-column gap-5" id="Dashboard">
      <Navbar/>

      <div className="container d-flex gap-4">
        <AlertBtn />
        <Map />
      </div>
    </section>
  )
}

export default App
