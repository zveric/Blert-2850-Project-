import {windowBreakpoints} from "../components/windowBreakpoints.js";
import Navbar from '../components/navbar'
import LineChart from "../components/Line-Chart.jsx";
import AccelerationGraph from "../components/acceleration-graph.jsx";
import ReportModal from '../components/ReportModal.jsx';
import { useState, useRef } from 'react'


function Analysis() {

    const [showReport, setShowReport] = useState(false); 
    const tempChartRef = useRef(null); 
    const activityChartRef = useRef(null); 
    const { isMobile } = windowBreakpoints();

    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: isMobile ? "0 0px" : "0 50px",
        margin: isMobile ? "0 0px" : "0 150px",
    };


    return (
        <>
            <main style={{pageStyle}}>
                <div style  = {{display: 'flex', justifyContent: 'space-between', alignItem: 'center', marginBottom: '1.5rem'}}> 
                    <div>
                        <h1>Analysis</h1>
                        <p>This is the analysis page.</p>
                    </div>

                    <button
                        onClick = {() => setShowReport(true)} 
                        style={{
                            background: '#213aab', 
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '14px', 
                            cursor: 'pointer', 
                            fontWeight: 500,
                        }}
                    >
                        Generate A Report
                    </button>

                </div>
                <div style= {{width : isMobile ? "100%" : "30%", height: isMobile ? "50vh" : "80vh"}}>
                    <div ref = {tempChartRef}>
                        <LineChart />
                    </div>
                    <div ref = {activityChartRef}> 
                        <AccelerationGraph />
                    </div>
                    
                </div>

                {showReport && (
                    <ReportModal 
                        onClose={() => setShowReport(false)}
                        tempChartRef= {tempChartRef}
                        activityChartRef={activityChartRef}
                        /> 
                )}

            </main>
        </>
)}

export default Analysis