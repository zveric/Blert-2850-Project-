import { windowBreakpoints } from "../components/windowBreakpoints.js";
import Navbar from '../components/navbar';
import LineChart from "../components/Line-Chart.jsx";
import AccelerationGraph from "../components/acceleration-graph.jsx";
import GrazingHeatmap from '../components/grazing-heatmap';
import ReportModal from '../components/ReportModal.jsx';
import AlertBreakdown from '../components/alert-breakdown.jsx';
import ActivityPattern from '../components/activity-pattern.jsx';
import DateRangeSelector from '../components/date-range-selector.jsx';
import DownloadCSV from '../components/export-btn.jsx';
import { useState, useRef } from 'react';

function Analysis() {
    const [showReport, setShowReport] = useState(false);
    const [startDate, setStartDate]   = useState(null);
    const [endDate, setEndDate]       = useState(null);
    const [appliedStart, setAppliedStart] = useState(null);
    const [appliedEnd, setAppliedEnd]     = useState(null);

    const tempChartRef     = useRef(null);
    const activityChartRef = useRef(null);
    const scatterChartRef = useRef(null); 
    const ActivityPatternRef = useRef(null); 
    const GrazingHeatmapRef = useRef(null); 

    const { isMobile }     = windowBreakpoints();

    const handleDateChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const handleApply = () => {
        setAppliedStart(startDate);
        setAppliedEnd(endDate);
    };

    const pageStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        margin: isMobile ? "0 0px" : "0 10vw",
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

    return (
        <>
            <main style={pageStyle}>
                <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#444', whiteSpace: 'nowrap' }}>
                            Filter charts:
                        </span>
                        <DateRangeSelector
                            startDate={startDate}
                            endDate={endDate}
                            onChange={handleDateChange}
                            onApply={handleApply}
                            showApply={true}
                        />
                    </div>
                    <div style={{gap: "20px", display: 'flex'}}>
                        <DownloadCSV/>

                        <button
                            onClick={() => setShowReport(true)}
                            onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#c62828';
                                e.currentTarget.style.boxShadow = '0 6px 18px rgba(229,57,53,0.45)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = '#e53935';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(229,57,53,0.3)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                            style={{
                                padding: '9px 20px',
                                borderRadius: '10px',
                                border: '3px solid #b71c1c',
                                backgroundColor: '#e53935',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 12px rgba(229,57,53,0.3)',
                                transition: 'background-color 0.15s, box-shadow 0.15s, transform 0.15s',
                                flexShrink: 0,
                            }}
                            title="Generate A Report"
                            aria-label="Generate A Report"
                        >
                            Generate Report
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '20px', alignItems: 'flex-start' }}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                        <div style={{ ...cardStyle, width: isMobile ? "100vw" : "100%", height: isMobile ? "30vh" : "30vh", minHeight: "300px" }} ref={tempChartRef}>
                            <LineChart
                                startDate={appliedStart}
                                endDate={appliedEnd}
                                hidePickers={true}
                            />
                        </div>
                        <div style={{ ...cardStyle, width: isMobile ? "100vw" : "100%", height: isMobile ? "30vh" : "30vh", minHeight: "300px" }} ref={activityChartRef}>
                            <AccelerationGraph
                                startDate={appliedStart}
                                endDate={appliedEnd}
                                hidePickers={true}
                            />
                        </div>
                        <div style={{ ...cardStyle, width: isMobile ? "100vw" : "100%", height: isMobile ? "30vh" : "30vh", minHeight: "300px" }} ref={scatterChartRef}>
                            <AlertBreakdown
                                startDate = {appliedStart}
                                endDate = {appliedEnd}                            
                            />
                        </div>
                    </div>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                        <div style={{ ...cardStyle, width: isMobile ? "100vw" : "100%", height: isMobile ? "30vh" : "55vh", minHeight: "300px" }} ref = {GrazingHeatmapRef}>
                            <GrazingHeatmap 
                                startDate = {appliedStart}
                                endDate = {appliedEnd}                             
                            />
                        </div>
                        <div style={{ ...cardStyle, width: isMobile ? "100vw" : "100%", height: isMobile ? "30vh" : "35vh", minHeight: "300px" }}ref={ActivityPatternRef}>
                            <ActivityPattern
                                startDate = {appliedStart}
                                endDate = {appliedEnd} 
                            />
                        </div>
                    </div>
                </div>

                {showReport && (
                    <ReportModal
                        onClose={() => setShowReport(false)}
                        tempChartRef={tempChartRef}
                        activityChartRef={activityChartRef}
                        scatterChartRef={scatterChartRef}
                        ActivityPatternRef={ActivityPatternRef}
                        GrazingHeatmapRef={GrazingHeatmapRef}
                    />
                )}
            </main>
        </>
    );
}

export default Analysis;