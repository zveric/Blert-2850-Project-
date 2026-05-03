import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { getReadings } from '../api'



function Map() {
    const [positionA, setPositionA] = useState(null)
    const [positionB, setPositionB] = useState(null)

    useEffect(() => {
        getReadings(1, 1).then(data => {
            const coords = data[0].geolocation.coordinates
            console.log(coords)
            setPositionA([coords[1], coords[0]])  // flip: [lat, lng]
        })

        getReadings(1,2).then(data => {
            const coords = data[0].geolocation.coordinates
            console.log(coords)
            setPositionB([coords[1], coords[0]])
        })
    }, [])

    if (!positionA) return <p>Loading map...</p>
    if (!positionB) return <p>Loading map...</p>

    return (
        // From leaflet docs
        <MapContainer center={positionA} zoom={16} scrollWheelZoom={true} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={positionA}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <Marker position={positionB}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map