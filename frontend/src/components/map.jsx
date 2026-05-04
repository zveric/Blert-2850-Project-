import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { getReadings } from '../api'
import { divIcon } from 'leaflet'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'leaflet/dist/leaflet.css'
import { windowBreakpoints } from './windowBreakpoints';




function Map() {
    const [positionA, setPositionA] = useState(null);
    const [positionB, setPositionB] = useState(null);
    const [sliderValue, setSliderValue] = useState(1);
    const { width, height,isMobile } = windowBreakpoints();

    const customIcon = (color) => divIcon({
        className: '',
        html: `<i class="fa-solid fa-location-dot" style="color: ${color}; font-size: 32px;"></i>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    })

    useEffect(() => {
        Promise.all([ // Promise just allows the values to be there before we know them
            getReadings(sliderValue, 1), // cow
            getReadings(sliderValue, 2) //goat
        ]).then(([dataA, dataB]) => {
            if (dataA[0]) {
                const coords = dataA[0].geolocation.coordinates
                setPositionA([coords[1], coords[0]])  // flip: [lat, lng]
            }
            if (dataB[0]) {
                const coords = dataB[0].geolocation.coordinates
                setPositionB([coords[1], coords[0]])
            }
        })
    }, [sliderValue])

    // if (!positionA) return <p>Loading map...</p>
    // if (!positionB) return <p>Loading map...</p>

    // Class styles for the button
    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "20px",
        display: "inline-block",
        width: isMobile ? '100%' : '80%',
        height: isMobile ? '50vh' : '80vh',
    }; 

    return (
        // From leaflet docs
        <div className="gap-4" style={cardStyle}>
            <MapContainer center={positionA} zoom={16} scrollWheelZoom={true} style={{ height: isMobile ? '85%' : '90%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={positionA} icon={customIcon('#2947cd')}></Marker>
                <Marker position={positionB} icon={customIcon('#00a2b7')}></Marker>
            </MapContainer>
            <div className='d-flex flex-row gap-4'>
                <p>Day: placeholder </p>
                <p>Month: placeholder </p>
                <p>Year: placeholder </p>
            </div>
            <div>
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(e.target.value)}
                    style={{width: '83%'}}
                />
                <div style={{width: '17%', display: 'inline-block', textAlign: 'center'}}>
                    <label>Time: {sliderValue}</label>
                </div>
            </div>
        </div>
    )
}

export default Map