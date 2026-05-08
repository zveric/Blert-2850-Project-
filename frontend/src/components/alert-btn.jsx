import { useState } from "react";
import { windowBreakpoints } from "./windowBreakpoints";

function AlertBtn(props) {
  const scrollRef = useState(null)[0];
  const [alerts, setAlerts] = useState([]);
  const [isHovering, setIsHovering] = useState(false);
  const { width, height, isMobile } = windowBreakpoints();

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

  // Class styles for the button
  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    padding: "20px",
    display: "inline-block",
    overflow: "hidden",
    width: "100%",
    height: isMobile ? "30vh" : "50%",
  };

  const buttonStyle = {
    width: "75px",
    height: "75px",
    borderRadius: "50%",
    backgroundColor: isHovering ? "#cc322f" : "#b71c1c",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    fontSize: "28px",
    boxShadow: "0 4px 12px rgba(229,57,53,0.5)",
    transform: isHovering ? "scale(1.05)" : "scale(1)",
    transition:
      "transform 0.1s, box-shadow 0.1s, background-color 0.1s ease-in-out",
  };

  const thStyle = {
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    paddingBottom: "4px",
    paddingRight: "12px",
    color: "#888",
    fontWeight: "500",
    fontSize: "12px",
  };

  const tdStyle = {
    paddingTop: "6px",
    paddingRight: "12px",
    verticalAlign: "top",
    fontSize: "12px",
    borderBottom: "1px solid #eee",
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
