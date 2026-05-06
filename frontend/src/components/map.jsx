import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { getReadings } from '../api'
import { divIcon } from 'leaflet'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'leaflet/dist/leaflet.css'
import { windowBreakpoints } from './windowBreakpoints';




function Map() {
    const [positionA, setPositionA] = useState(null);
    const [positionB, setPositionB] = useState(null);
    const [livestock, setLivestock] = useState(1)
    const [timestamp, setTimestamp] = useState(null);
    const [sliderValue, setSliderValue] = useState(1);
    const { isMobile } = windowBreakpoints();

    const customIcon = (color) => divIcon({
        className: '',
        html: `<i class="fa-solid fa-location-dot" style="color: ${color}; font-size: 32px;"></i>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    })

    useEffect(() => {
        const MAX_WINDOW = 50 // Fetch up to Max window values for each animal
        Promise.all([
            getReadings(MAX_WINDOW, 1),
            getReadings(MAX_WINDOW, 2)
        ]).then(([dataA, dataB]) => {
            const idxA = Math.max(0, Math.min(sliderValue - 1, (dataA?.length || 1) - 1)) //Calculate the value of an index from the slider value. Never go beond the max number. And convert to 0 based array.
            if (dataA && [dataA[idxA].latitude,dataA[idxA].longitude]) {
                setPositionA([dataA[idxA].latitude,dataA[idxA].longitude])  // flip for leaflet
                setTimestamp(dataA[idxA].timestamp)
            }

            const idxB = Math.max(0, Math.min(sliderValue - 1, (dataB?.length || 1) - 1))
            if (dataB && [dataB[idxB].latitude,dataB[idxB].longitude]) {
                setPositionB([dataB[idxB].latitude,dataB[idxB].longitude])
            }
        }).catch(err => console.error("Error fetching readings:", err))
    }, [sliderValue])

  // Update the centering of the map as the slider position changes.
    function Recenter({ position }) {
        const map = useMap()
        useEffect(() => {
            if (position) {
                // preserve current zoom
                map.setView(position, map.getZoom())
            }
        }, [position, map])
        return null
    }
    if (!positionA) return <p>Loading map...</p>
    if (!positionB) return <p>Loading map...</p>

    // Class styles for the button
    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "20px",
        display: "inline-block",
        width: isMobile ? '100%' : '70%',
        height: isMobile ? '50vh' : '100%',
    }; 

    return (
        // From leaflet docs
        <div className="readings-info bs-border-color-light gap-4" style={cardStyle}>
            <MapContainer center={livestock === "1" ? positionA : positionB} zoom={16} scrollWheelZoom={true} style={{ height: isMobile ? '85%' : '90%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Recenter position={livestock === "1" ? positionA : positionB} />
                <Marker position={positionA} icon={customIcon('#2947cd')}></Marker>
                <Marker position={positionB} icon={customIcon('#00a2b7')}></Marker>
            </MapContainer>
            <div className='d-flex flex-row gap-4'>
                <p>Day: {timestamp ? new Date(timestamp).getDate() : 'N/A'} </p>
                <p>Month: {timestamp ? new Date(timestamp).getMonth() + 1 : 'N/A'} </p>
                <p>Year: {timestamp ? new Date(timestamp).getFullYear() : 'N/A'} </p>
            </div>
            <div>
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    style={{width: '75%'}}
                />
                <div style={{width: '10%', display: 'inline-block', textAlign: 'center'}}>
                    <label>Time: {sliderValue}</label>
                </div>
                <select  value={livestock} onChange={(e) => setLivestock(e.target.value)}>
                    <option value= {"1"}>Cow Herd</option>
                    <option value= {"2"}>Goat Herd</option>
                </select>
            </div>
        </div>
    )
}

export default Map