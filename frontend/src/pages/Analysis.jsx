import {windowBreakpoints} from "../components/windowBreakpoints.js";
import Navbar from '../components/navbar'
import LineChart from "../components/Line-Chart.jsx";
import AccelerationGraph from "../components/acceleration-graph.jsx";
import ReportModal from '../components/ReportModal.jsx';
import { useState, useRef } from 'react'


function Analysis() {
    const { isMobile } = windowBreakpoints();

    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: isMobile ? "0 0px" : "0 50px",
        margin: isMobile ? "0 0px" : "0 150px",
    };

    return (
        <main style={pageStyle}>
            <h1>Analysis</h1>
            <p>This is the analysis page.</p>
            <div style={{width : isMobile ? "100%" : "30%", height: isMobile ? "50vh" : "80vh"}}>
                <LineChart />
                <AccelerationGraph />
             </div>

        </main>
    )
}

export default Analysis