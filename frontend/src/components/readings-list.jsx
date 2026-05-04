import { useState, useEffect } from 'react'
import { getReadings } from '../api'
import './readings-list.css'

function ReadingsList() {
    const [readings, setReadings] = useState([])
    const [loading, setLoading] = useState(true)
    const [limit, setLimit] = useState(20)

    useEffect(() => {
        getReadings(limit).then(data => {
            setReadings(data)
            setLoading(false)
        })
    }, [limit])

    const getStatusBadgeClass = (status) => {
        const statusLower = status?.toLowerCase() || 'unknown' //Change to lowercase and if no status available then set to unknown
        return `status-badge status-${statusLower}` //Return the status of the reading
    }

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A'
        return new Date(timestamp).toLocaleString() //Return clean timestamp
    }

    const formatCoordinates = (coords) => {
        if (!coords) return 'N/A'
        //Written with the help of Copilot AI "How can I format coordinates for display"
        if (Array.isArray(coords)) {
            return `[${coords.map(c => c.toFixed(4)).join(', ')}]`
        }
        return String(coords)
    }

    if (loading) {
        return <div className="loading-container"><p>Loading...</p></div> //Shown while data is loading in. This usually doesn't take long. But when the backend isn't running this remains onscreen.
    }

    if (readings.length === 0) { //Shown if no readings found in database, but backend running
        return (
            <div className="readings-container">
                <div className="readings-header">
                    <h2>Readings List</h2>
                </div>
                <div className="empty-state">No readings available</div>
            </div>
        )
    }

    // Class styles for the button
    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "20px",
        display: "inline-block",
        width: '100%',
        height: '1000px',
        overflow: "hidden",
    };


    return (
        <div className="readings-container" style={cardStyle}>
            <div className="readings-header">
                <h2>Readings List</h2>
                <div className="readings-info">
                    <span>Show:</span>
                    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}> //Set the value chosen here to be the number of entry requested from the database.
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
            <div className="table-wrapper" style={{ maxHeight: '800px', overflowY: 'auto' }}>
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
                        {readings.map(reading => (
                            <tr key={reading.id}>
                                <td className="timestamp-cell">{formatTimestamp(reading.timestamp)}</td>
                                <td className="location-cell">{formatCoordinates(reading.geolocation?.coordinates)}</td>
                                <td className="temperature-cell">{reading.ambient_temperature_c}°C</td>
                                <td className="acceleration-cell">{reading.accel_mag_g} m/s²</td>
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
    )






}

export default ReadingsList