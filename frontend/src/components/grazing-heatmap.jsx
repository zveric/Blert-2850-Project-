import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { getReadings } from '../api'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'
import L from 'leaflet'
import { windowBreakpoints } from './windowBreakpoints'


// heatmap layer for each herd
function HeatLayer({readings, mode}) {
    const map = useMap()
    const layerRef = useRef(null)

    useEffect(() => {
        if (!readings || readings.length === 0) return

        const points = readings
            .filter(r => r.latitude != null && r.longitude != null)
            .map(r => {
                // if activity mode weight by accel otherwise just 1
                const weight = mode === 'activity' ? (r.accel_mag_g ?? 1) / 3 : 1
                return [r.latitude, r.longitude, weight]
            })

        console.log(points)

        if (layerRef.current) {
            map.removeLayer(layerRef.current)
        }

        layerRef.current = L.heatLayer(points, {
            radius: 18,
            blur: 22,
            maxZoom: 17,
            max: 1.0,
            // rainbow gradient low=blue mid=green/yellow high=red
            gradient: {0.0: 'blue', 0.3: 'cyan', 0.5: 'lime', 0.7: 'yellow', 1.0: 'red'},
        }).addTo(map)

        return() => {
            if (layerRef.current) map.removeLayer(layerRef.current)
        }
    }, [readings, map, mode])

    return null
}


function GrazingHeatmap({startDate, endDate}) {
    const [readingsA, setReadingsA] = useState([]);
    const [readingsB, setReadingsB] = useState([]);
    const [showA, setShowA] = useState(true);
    const [showB, setShowB] = useState(true);
    const [mode, setMode] = useState('density')
    const { isMobile } = windowBreakpoints();

    useEffect(() => {
        getReadings(500, 1, startDate, endDate).then(data => {
            console.log(data)
            setReadingsA(data)
        })

        getReadings(500, 2, startDate, endDate).then(data => {
            console.log(data)
            setReadingsB(data)
        });
    }, [startDate, endDate])

    if (!readingsA || !readingsB) return <p>loading heatmap...</p>

    return (
        <div className="readings-info bs-border-color-light gap-4" style={{ display: 'flex', flexDirection: 'column', height: "100%" }}>
            <MapContainer center={[-32.7775, 26.8404]} zoom={15} scrollWheelZoom={true} style={{ height: isMobile ? '85%' : '90%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {showA && <HeatLayer readings={readingsA} mode={mode} />}
                {showB && <HeatLayer readings={readingsB} mode={mode} />}

            </MapContainer>
            <div className='d-flex flex-row gap-4'>
                <button
                    onClick={() => setShowA(!showA)}
                    style={{
                        padding: '5px 10px',
                        background: showA ? '#2947cd' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer',
                    }}
                >
                    Animal A
                </button>
                <button
                    onClick={() => setShowB(!showB)}
                    style={{
                        padding: '5px 10px',
                        background: showB ? ' #2947cd' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer',
                    }}
                >
                    Animal B
                </button>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="density">Grazing density</option>
                    <option value="activity">Activity intensity</option>
                </select>
            </div>
        </div>
    )
}

export default GrazingHeatmap
