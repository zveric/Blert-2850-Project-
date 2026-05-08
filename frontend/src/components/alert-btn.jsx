import { useState } from "react";
import { useWindowBreakpoints } from "./useWindowBreakpoints";

function AlertBtn(props) {
  const scrollRef = useState(null)[0];
  const [setAlerts] = useState([]);
  const { width, height, isMobile } = useWindowBreakpoints();

  console.log("Window size:", width, "x", height, "isMobile:", isMobile);

  const handleAlert = () => {
    const newAlert = {
      dateTime: new Date().toLocaleString(),
      message: "Manual Alert Triggered",
    };
    setAlerts((prev) => [newAlert, ...prev]);
    props.onTrigger();

    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={handleAlert}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#8b0000";
            e.currentTarget.style.boxShadow = "0 6px 18px rgba(183,28,28,0.45)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#b71c1c";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(183,28,28,0.3)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          style={{
            padding: "9px 20px",
            borderRadius: "10px",
            border: "3px solid #7f0000",
            backgroundColor: "#b71c1c",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(183,28,28,0.3)",
            transition:
              "background-color 0.15s, box-shadow 0.15s, transform 0.15s",
            flexShrink: 0,
            width: isMobile ? "93vw" : "18vw",
          }}
        >
          Send SMS
        </button>
        {/* <div style = {{maxHeight: isMobile ? '21vh' :  "38vh", overflowY: "scroll", width: "100%"}}>
                    <table style = {{borderCollapse: "collapse", width: "100%"}}>
                        <thead> 
                            <tr> 
                                <th style = {thStyle}>Date & Time</th>
                                <th style = {thStyle}>Alerts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.length == 0 ? (
                                <tr> 
                                    <td colSpan="2" style = {{textAlign: "center", padding: "16px", color: "#888"}}>
                                        No Alerts Triggered Yet
                                    </td>
                                </tr>
                            ) : ( 
                                alerts.map((alert, i) => (
                                    <tr key= {i}>
                                        <td style = {tdStyle}>{alert.dateTime}</td>
                                        <td style = {tdStyle}>{alert.message}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div> */}
      </div>
    </div>
  );
}
export default AlertBtn;
