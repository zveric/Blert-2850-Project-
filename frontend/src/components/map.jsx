import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { getReadings } from '../api'
import { divIcon } from 'leaflet'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'leaflet/dist/leaflet.css'



function Map() {
    const [positionA, setPositionA] = useState(null)
    const [positionB, setPositionB] = useState(null)

    const customIcon = (color) => divIcon({
        className: '',
        html: `<i class="fa-solid fa-location-dot" style="color: ${color}; font-size: 32px;"></i>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    })

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
            <Marker position={positionA} icon={customIcon('#2947cd')}></Marker>
            <Marker position={positionB} icon={customIcon('#00a2b7')}></Marker>
        </MapContainer>
    )
}

export default Map