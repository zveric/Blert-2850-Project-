import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { getReadings } from '../api'
import { divIcon } from 'leaflet'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'leaflet/dist/leaflet.css'
import { windowBreakpoints } from './windowBreakpoints';
import L from 'leaflet'; 
import ReportModal from './ReportModal'


function getColor(deviation) {
    if (deviation < 0.1) return '#2196f3'; 
    if (deviation < 0.3) return '#4CAF50'; 
    if (deviation < 0.4) return '#ff9800';
    return '#f44336'; 
}

function Recenter({ position }) {
    const map = useMap()
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom())
        }
    }, [position, map])
    return null
}

function Legend() {
    const map = useMap(); 

    useEffect(() => {
        const Legend = L.control ({position: 'bottomright'});

        Legend.onAdd = () => {
            const div = L.DomUtil.create('div'); 
            div.style.cssText = `
                background:white;
                padding: 10px 14px;
                border-radius: 8px; 
                box-shadow: 0 2px 8px rgba(0,0,0,0.2); 
                font-size: 15px; 
                line-height: 18px;
            `;
            div.innerHTML = `
                <strong style= "display: block; margin-bottom: 8px;">Activity Level</strong> 
                <span style="color: #2196f3;">&#9632;</span> Resting/Grazing <br/>
                <span style="color: #4CAF50;">&#9632;</span> Walking <br/>
                <span style="color: #ff9800;">&#9632;</span> Aggitated <br/>
                <span style="color: #f44336;">&#9632;</span> Running/Distressed
            `;
            return div;
        };

        Legend.addTo(map); 
        return () => Legend.remove();
    }, [map]);

    return null;
}

function HotlineLayer({readings, sliderValue}) {
    const map = useMap(); 

    useEffect(() => {
        if (!readings || readings.length < 2) return; 

        const visible = readings.slice(0, sliderValue);
        const layers = []; 

        try {
            for (let i = 1; i < visible.length; i++) {
                const prev = visible[i -1]; 
                const curr = visible[i];
                const deviation = Math.abs((curr.accel_mag_g ?? 1) - 1.0); 
                const color = getColor(deviation); 
                const segment = L.polyline([[prev.latitude, prev.longitude], [curr.latitude, curr.longitude]], { color, weight: 4, opacity: 0.7 }).addTo(map);
                layers.push(segment);
            }
        } catch (err) {
            console.error("Error creating hotline layer", err)  
        }

        return() => layers.forEach(layer => map.removeLayer(layer)); 
    }, [readings, sliderValue, map]); 

    return null; 
}


const btnStyle = (active, color) => ({
    padding: '4px 12px',
    background: active ? color : 'white',
    color: active ? 'white' : '#555',
    border: '1px solid',
    borderColor: active ? color : '#ccc',
    borderRadius: '20px',
    fontSize: '12px',
    cursor: 'pointer',
})


function Map() {
    const [readingsA, setReadingsA] = useState(1);
    const [readingsB, setReadingsB] = useState(1);
    const [livestock, setLivestock] = useState("1")
    const [timestamp, setTimestamp] = useState(null);
    const [sliderValue, setSliderValue] = useState(1);
    const { isMobile } = windowBreakpoints();
    const [showA, setShowA] = useState(true); 
    const [showB, setShowB] = useState(true); 
    const mapRef = useRef(null); 

    const customIcon = (color) => divIcon({
        className: '',
        html: `<i class="fa-solid fa-location-dot" style="color: ${color}; font-size: 32px;"></i>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    })

    useEffect(() => {
        const MAX_WINDOW = 50
        Promise.all([
            getReadings(MAX_WINDOW, 1),
            getReadings(MAX_WINDOW, 2)
        ]).then(([dataA, dataB]) => {
            if (dataA) setReadingsA(dataA)
            if (dataA) setTimestamp(dataA[idxA].timestamp)
            if (dataB) setReadingsB(dataB)
        }).catch(err => console.error("Error fetching readings:", err))
    }, [])

    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "20px",
        display: "inline-block",
        width: isMobile ? '100%' : '70%',
        height: isMobile ? '50vh' : '100%',
        boxSizing: 'border-box',
    }; 

    const idxA = readingsA.length > 0? Math.max(0, Math.min(sliderValue - 1 , readingsA.length - 1)) : 0; 
    const idxB = readingsB.length > 0? Math.max(0, Math.min(sliderValue - 1 , readingsB.length - 1)) : 0; 

    useEffect(() => {
        const idxA = Math.max(0, Math.min(sliderValue - 1, readingsA.length - 1));
        if (readingsA[idxA]?.timestamp) {
            setTimestamp(readingsA[idxA].timestamp);
        }
    }, [sliderValue, livestock, readingsA, readingsB]);
    
    const positionA = readingsA[idxA]?.latitude? [readingsA[idxA].latitude, readingsA[idxA].longitude] : null; 
    const positionB = readingsB[idxB]?.latitude? [readingsB[idxB].latitude,readingsB[idxB].longitude] : null; 

    if (!positionA|| !positionB) return <p> Map is mapping out your livestock ...</p>;

    return (
        <div className="readings-info bs-border-color-light gap-4" style={cardStyle}>
            <MapContainer center={livestock === "1" ? positionA : positionB} zoom={16} scrollWheelZoom={true} style={{ height: isMobile ? '75%' : '82%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Recenter position={livestock === "1" ? positionA : positionB} />

                {showA && <HotlineLayer readings={readingsA} sliderValue={sliderValue} />}
                {showB && <HotlineLayer readings={readingsB} sliderValue={sliderValue} />}

                {showA && positionA && <Marker position={positionA} icon={customIcon('#2947cd')}></Marker>}
                {showB && positionB && <Marker position={positionB} icon={customIcon('#00a2b7')}></Marker>}
                <Legend />
            </MapContainer>

            <div className='d-flex flex-row gap-4' style={{fontSize: '12px', color: '#555', marginTop: '6px'}}>
                <p style={{margin: 0}}>Day: {timestamp ? new Date(timestamp).getDate() : 'N/A'} </p>
                <p style={{margin: 0}}>Month: {timestamp ? new Date(timestamp).getMonth() + 1 : 'N/A'} </p>
                <p style={{margin: 0}}>Year: {timestamp ? new Date(timestamp).getFullYear() : 'N/A'} </p>
                <p style={{margin: 0}}>Time: {timestamp ? new Date(timestamp).toLocaleTimeString() : 'N/A'} </p>
            </div>

            <div className='d-flex flex-row align-items-center gap-3' style={{marginTop: '8px', flexWrap: 'wrap'}}>

                <input
                    type="range"
                    min="1"
                    max="50"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    style={{flex: 1, minWidth: '100px'}}
                />
                <label style={{fontSize: '11px', color: '#555', whiteSpace: 'nowrap'}}>Time: {sliderValue}</label>

                <button onClick={() => setShowA(!showA)} style={btnStyle(showA, '#2947cd')}>Animal A</button>
                <button onClick={() => setShowB(!showB)} style={btnStyle(showB, '#00a2b7')}>Animal B</button>

                <div className='d-flex flex-row gap-2' style={{fontSize: '11px'}}>
                    <label style={{cursor: 'pointer'}}>
                        <input type="radio" name="livestock" value="1" checked={livestock === "1"} onChange={(e) => setLivestock(e.target.value)} style={{marginRight: '4px'}}/>
                        Cow Herd
                    </label>
                    <label style={{cursor: 'pointer'}}>
                        <input type="radio" name="livestock" value="2" checked={livestock === "2"} onChange={(e) => setLivestock(e.target.value)} style={{marginRight: '4px'}}/>
                        Goat Herd
                    </label>
                </div>

            </div>
        </div>
    )
}

export default Map