import { useState, useEffect } from "react";
import { getReadings } from "../api";
import "./readings-list.css";

function ReadingsList() {
  const [readings, setReadings] = useState([]);

  const [limit, setLimit] = useState(10);
  const [livestock, setLivestock] = useState(1);

  useEffect(() => {
    getReadings(limit, livestock).then((data) => {
      setReadings(data);
    });
  }, [limit, livestock]);

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase() || "unknown"; //Change to lowercase and if no status available then set to unknown (i belive all statuses should be present but jic)
    return `status-badge status-${statusLower}`; //Return the status of the reading
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString(); //Return clean timestamp
  };

  const formatCoordinates = (coords) => {
    if (!coords) return "N/A";
    //Written with the help of Copilot AI "How can I format coordinates for display" as I was unsure how to format the coordinates for display.
    if (Array.isArray(coords)) {
      return `[${coords.map((c) => c.toFixed(4)).join(", ")}]`;
    }
    return String(coords);
  };

  // Class styles for the button
  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    padding: "20px",
    display: "inline-block",
    width: "100%",
    height: "63vh",
    overflow: "hidden",
  };

  return (
    <div className="readings-container" style={cardStyle}>
      <div className="readings-header">
        <h2>Readings List</h2>
        <div className="readings-info bs-border-color-light">
          <select
            aria-label="Livestock selection"
            value={livestock}
            onChange={(e) => setLivestock(e.target.value)}
          >
            <option value="1">Cow Herd</option>
            <option value="2">Goat Herd</option>
          </select>
          <span>Show:</span>
          {/*Input for number of readings (better than the old dropdown)*/}
          <input
            aria-label="Number of readings"
            type="number"
            min="1"
            value={limit}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (Number.isInteger(v) && v >= 0) setLimit(v);
            }}
            className="form-control bs-border-color-light"
            style={{ width: 80 }}
          />
        </div>
      </div>
      <div
        className="table-wrapper"
        style={{ maxHeight: "51vh", overflowY: "auto" }}
      >
        <table className="readings-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Location</th>
              <th>Temperature</th>
              <th>Acceleration</th>
              <th>Status</th>
            </tr>
          </thead>
          {/*// The data from inside the table. Class names for css.*/}
          <tbody>
            {readings.map((reading) => (
              <tr key={reading.id}>
                <td className="timestamp-cell">
                  {formatTimestamp(reading.timestamp)}
                </td>
                <td className="location-cell">
                  {formatCoordinates([reading.latitude, reading.longitude])}
                </td>
                <td className="temperature-cell">
                  {reading.ambient_temperature_c}°C
                </td>
                <td className="acceleration-cell">
                  {reading.accel_mag_g} m/s²
                </td>
                <td className="status-cell">
                  <span className={getStatusBadgeClass(reading.status)}>
                    {reading.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReadingsList;
