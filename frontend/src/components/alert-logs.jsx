import { useState, useEffect } from "react";
import { getReadings } from "../api";
import { windowBreakpoints } from "./windowBreakpoints";
import "./readings-list.css";

function AlertsLog() {
  const [alerts, setAlerts] = useState([]);
  const { isMobile } = windowBreakpoints();

  useEffect(() => {
    getReadings(200).then((data) => {
      const withAlerts = data.filter((reading) => reading.alert != null);
      setAlerts(withAlerts.slice(0, 10));
    });
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const formatCoordinates = (reading) => {
    if (!reading.latitude || !reading.longitude) return "N/A";
    return `[${reading.latitude.toFixed(4)}, ${reading.longitude.toFixed(4)}]`;
  };

  const formatLivestock = (livestock) => {
    if (!livestock) return "N/A";

    const match = livestock.match(/\/(\d+)\/$/);
    if (!match) return "Unknown";

    const id = match[1];
    if (id === "1") return "Cow Herd";
    if (id === "2") return "Goat Herd";
    return `Livestock ${id}`;
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    display: "inline-block",
    width: "100%",
    height: "60vh",
    overflow: "hidden",
  };

  return (
    <div
      className="readings-container"
      style={{ height: "100%", overflow: "hidden" }}
    >
      <h2 style={{ fontSize: "20px", margin: "0 0 10px 0" }}>
        Warning Alerts Log
      </h2>
      <div
        className="table-wrapper"
        style={{ maxHeight: "100%", overflowY: "auto" }}
      >
        <table
          className="readings-table"
          style={{ width: isMobile ? "93vw" : "100%" }}
        >
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Location</th>
              <th>Livestock</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((reading) => (
              <tr key={reading.id}>
                <td className="timestamp-cell">
                  {formatTimestamp(reading.timestamp)}
                </td>
                <td className="location-cell">{formatCoordinates(reading)}</td>
                <td className="livestock-cell">
                  {formatLivestock(reading.livestock)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlertsLog;
