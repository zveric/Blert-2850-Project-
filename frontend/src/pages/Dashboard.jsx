import {useState} from "react";
import {windowBreakpoints} from "../components/windowBreakpoints.js";
import Map from "../components/map.jsx";
import AlertBtn from "../components/alert-btn.jsx";
import LineChart from "../components/Line-Chart.jsx";
import ReadingList from "../components/readings-list.jsx";

function Dashboard() {
    const [count, setCount] = useState(0)

    const { width, height,isMobile } = windowBreakpoints();

    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: isMobile ? "0 0px" : "0 150px",
    };

    const mapAndAlertStyle = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '20px',
        margin: isMobile ? "0 0px" : "0 150px",
        height: isMobile ? "100%" : "95vh",
    };

    return (
        <section style={pageStyle}>
            <div style={mapAndAlertStyle}>
                <Map />
                <div style={{width: isMobile ? "100%" : "30%"}}>
                    <AlertBtn />
                    <a href="/analysis" target="_self" rel="noopener noreferrer">
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
