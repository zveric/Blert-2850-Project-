import { useState, useEffect } from 'react'
import { getReadings } from '../api'
import './readings-list.css'

function AlertsLog() {
    const [alerts, setAlerts] = useState([])

    useEffect(() => {
        getReadings(200).then(data => {
            const withAlerts = data.filter(reading => reading.alert != null)
            setAlerts(withAlerts.slice(0, 10))
        })
    }, [])

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A'
        return new Date(timestamp).toLocaleString()
    }

    const formatCoordinates = (reading) => {
        if (!reading.latitude || !reading.longitude) return 'N/A'
        return `[${reading.latitude.toFixed(4)}, ${reading.longitude.toFixed(4)}]`
    }

    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "20px",
        display: "inline-block",
        width: '100%',
        height: '60vh',
        overflow: "hidden",
    }

    return (
        <div className="readings-container" style={cardStyle}>
            <div className="readings-header">
                <h2>Alerts Log</h2>
            </div>
            <div className="table-wrapper" style={{ maxHeight: '51vh', overflowY: 'auto' }}>
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
                    <tbody>
                        {alerts.map(reading => (
                            <tr key={reading.id}>
                                <td className="timestamp-cell">{formatTimestamp(reading.timestamp)}</td>
                                <td className="location-cell">{formatCoordinates(reading)}</td>
                                <td className="temperature-cell">{reading.ambient_temperature_c}°C</td>
                                <td className="acceleration-cell">{reading.accel_mag_g} m/s²</td>
                                <td className="status-cell">
                                    <span className={`status-badge status-${reading.status?.toLowerCase()}`}>
                                        {reading.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AlertsLog