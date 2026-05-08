import { useState } from "react";
import { useWindowBreakpoints } from "../components/useWindowBreakpoints.js";
import HerdTrackingMap from "../components/herd-tracking-map.jsx";
import SendSMSButton from "../components/send-sms-button.jsx";
import AmbientTemperatureGraph from "../components/ambient-temperature-graph.jsx";
import ReadingListTable from "../components/readings-list-table.jsx";
import AlertSystem from "../components/alert-sms-system.jsx";
import AlertsLogTable from "../components/alerts-log-table.jsx";
import DateRangeSelector from "../components/date-range-selector.jsx";

function Dashboard() {
  const { isMobile } = useWindowBreakpoints();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [appliedStart, setAppliedStart] = useState(null);
  const [appliedEnd, setAppliedEnd] = useState(null);

  const handleDateChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleApply = () => {
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  };

  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: isMobile ? "0 0px" : "0 15vw",
  };

  const mapAndAlertStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: "20px",
    margin: isMobile ? "0 0px" : "0 10vw",
    height: isMobile ? "100%" : "95vh",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    display: "inline-block",
    width: "100%",
    height: isMobile ? "50vh" : "50%",
    overflow: "hidden",
  };

  const [manualTrigger, setManualTrigger] = useState(false);

  return (
    <section style={pageStyle}>
      <AlertSystem
        manualTrigger={manualTrigger}
        onManualClose={() => setManualTrigger(false)}
      />
      <div style={mapAndAlertStyle}>
        <HerdTrackingMap startDate={appliedStart} endDate={appliedEnd} />
        <div
          style={{
            width: isMobile ? "100%" : "30%",
            gap: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={cardStyle}>
            <div
              style={{
                height: "100%",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SendSMSButton onTrigger={() => setManualTrigger(true)} />
              <AlertsLogTable />
            </div>
          </div>
          <div style={{ ...cardStyle, padding: "20px" }}>
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateChange}
              onApply={handleApply}
              showApply={true}
            />
            <div style={{ height: "83%" }}>
              <a
                href="/analysis"
                target="_self"
                rel="noopener noreferrer"
                aria-label="Click to go to Analysis page"
              >
                <AmbientTemperatureGraph
                  startDate={appliedStart}
                  endDate={appliedEnd}
                  hidePickers={true}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div style={{ margin: isMobile ? "0 0px" : "0 10vw" }}>
        <ReadingListTable />
      </div>
      <div style={{ padding: "0 50px" }}></div>
    </section>
  );
}

export default Dashboard;
