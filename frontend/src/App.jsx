import { useState } from 'react';
import LineChart from './components/Line-Chart.jsx';
import Navbar from './components/navbar';
import Map from "./components/map";
import AlertBtn from './components/alert-btn';
import ReadingList from './components/readings-list';
import './App.css';
import { windowBreakpoints } from './components/windowBreakpoints';

function App() {
  const [count, setCount] = useState(0)

  const { width, height,isMobile } = windowBreakpoints();
  
  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const mapAndAlertStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '20px',
    margin: '0 px',
    margin: isMobile ? "0 0px" : "0 150px",
  };

  return (
    <section style={pageStyle} id="Dashboard">
      <Navbar/>

      <div style={mapAndAlertStyle}>
        <Map />
        <div style={{width : "30%"}}>
          <AlertBtn />
          <LineChart/>
          <accelerationGraph/>      
        </div>
      </div>
      <div style={{gap: "20px", padding: "0 50px",margin: isMobile ? "0 0px" : "0 150px",}}>
          <ReadingList/>
      </div>
      <div style={{padding: "0 50px"}}></div>

    </section>
  )
}

export default App
