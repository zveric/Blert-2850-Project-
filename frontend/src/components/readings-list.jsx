import { useState, useEffect } from 'react'
import { getReadings } from '../api'

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


    if (loading) return <p>Loading...</p>

    return (
        <div>
            <h2>Readings List</h2>
            <table>
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
                            <td>{reading.timestamp}</td>
                            <td>{reading.geolocation.coordinates}</td>
                            <td>{reading.temperature}</td>
                            <td>{reading.acceleration}</td>
                            <td>{reading.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )






}

export default ReadingsList