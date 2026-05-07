import {windowBreakpoints} from "../components/windowBreakpoints.js";
import Navbar from '../components/navbar'
import LineChart from "../components/Line-Chart.jsx";
import AccelerationGraph from "../components/acceleration-graph.jsx";
import GrazingHeatmap from '../components/grazing-heatmap'
import ReportModal from '../components/ReportModal.jsx';
import AlertBreakdown from '../components/alert-breakdown.jsx'
import ActivityPattern from '../components/activity-pattern.jsx'
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
        height: "100vh",
    };

    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "20px",
        display: "inline-block",
        width: '100%',
    }; 

    const buttonStyle = {
        width: "75px",
        height: "75px",
        borderRadius: "50%",
        backgroundColor: "#e53935",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        fontSize: "15px",
        boxShadow: "0 4px 12px rgba(229,57,53,0.5)",
        transform: "scale(1)",
        transition: "transform 0.1s, box-shadow 0.1s, background-color 0.1s ease-in-out",
    };

    return (
        <>
            <main style={pageStyle}>
                <div style = {{display: 'flex', justifyContent: 'space-between', alignItem: 'center', marginBottom: '1.5rem'}}> 
                    <div>
                        <h1>Analysis</h1>
                        <p>This is the analysis page.</p>
                    </div>

                    <button
                        onClick = {() => setShowReport(true)} 
                        style = {buttonStyle}
                    >
                        Generate A Report
                    </button>

                </div>

                <div style = {{display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: 'flex-start'}}>

                    <div style = {{height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1}}>
                        <div style = {{...cardStyle,width: isMobile ? "100vw" : "100%", height: isMobile ? "50vh" : "30vh"}} ref = {tempChartRef}>
                            <LineChart />
                        </div>
                        <div style = {{...cardStyle,width: isMobile ? "100vw" : "100%", height: isMobile ? "50vh" : "30vh"}} ref = {activityChartRef}> 
                            <AccelerationGraph />
                        </div>
                        <div style = {{...cardStyle,width: isMobile ? "100vw" : "100%", height: isMobile ? "50vh" : "30vh"}}>
                            <AlertBreakdown />
                        </div>
                    </div>

                    <div style = {{height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1}}>
                        <div style = {{...cardStyle,width: isMobile ? "100vw" : "100%", height: isMobile ? "50vh" : "55vh"}}>
                            <GrazingHeatmap />
                        </div>
                        <div style = {{...cardStyle,width: isMobile ? "100vw" : "100%", height: isMobile ? "50vh" : "35vh"}}>
                            <ActivityPattern />
                        </div>
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