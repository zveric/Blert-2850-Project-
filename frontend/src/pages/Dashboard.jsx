import {useState} from "react";
import {windowBreakpoints} from "../components/windowBreakpoints.js";
import Map from "../components/map.jsx";
import AlertBtn from "../components/alert-btn.jsx";
import LineChart from "../components/Line-Chart.jsx";
import ReadingList from "../components/readings-list.jsx";
import AlertSystem from "../components/AlertSystem.jsx";
import AlertLog from "../components/alert-logs.jsx";

function Dashboard() {
    const [count, setCount] = useState(0)

    const { width, height,isMobile } = windowBreakpoints();

    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: isMobile ? "0 0px" : "0 15vw",
    };

    const mapAndAlertStyle = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '20px',
        margin: isMobile ? "0 0px" : "0 10vw",
        height: isMobile ? "100%" : "95vh",
    };

    
    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        display: "inline-block",
        width: '100%',
        height: isMobile ? "50vh" : "50%",
        overflow: "hidden",  
    }; 

    const [manualTrigger, setManualTrigger] = useState(false)

    return (
        <section style={pageStyle}>
            <AlertSystem manualTrigger= {manualTrigger} onManualClose={() => setManualTrigger(false)}/>
            <div style={mapAndAlertStyle}>
                <Map />
                <div style={{ width: isMobile ? "100%" : "30%", gap: "20px", display: 'flex', flexDirection: 'column' }}>
                    <div style={cardStyle}>
                        <div style={{height: "100%", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <AlertBtn onTrigger = {() => setManualTrigger(true)} />
                            <AlertLog />
                        </div>
                    </div>
                    <a style={{...cardStyle, padding: "20px"}} href="/analysis" target="_self" rel="noopener noreferrer">
                        <LineChart />
                    </a>
                </div>
            </div>
            <div style={{margin: isMobile ? "0 0px" : "0 150px",}}>
                <ReadingList/>
            </div>
            <div style={{padding: "0 50px"}}></div>

        </section>
    )
}

export default Dashboard
