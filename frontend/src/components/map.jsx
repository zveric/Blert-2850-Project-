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




function Map() {
    const [readingsA, setReadingsA] = useState([]);
    const [readingsB, setReadingsB] = useState([]);
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
        const MAX_WINDOW = 50 // Fetch up to Max window values for each animal
        Promise.all([
            getReadings(MAX_WINDOW, 1),
            getReadings(MAX_WINDOW, 2)
        ]).then(([dataA, dataB]) => {
            if (dataA) setReadingsA(dataA)
            if (dataB) setReadingsB(dataB)

            // const idxA = Math.max(0, Math.min(sliderValue - 1, (dataA?.length || 1) - 1)) //Calculate the value of an index from the slider value. Never go beond the max number. And convert to 0 based array.
            // if (dataA && [dataA[idxA].latitude,dataA[idxA].longitude]) {
            //     setPositionA([dataA[idxA].latitude,dataA[idxA].longitude])  // flip for leaflet
            // }

            // const idxB = Math.max(0, Math.min(sliderValue - 1, (dataB?.length || 1) - 1))
            // if (dataB && [dataB[idxB].latitude,dataB[idxB].longitude]) {
            //     setPositionB([dataB[idxB].latitude,dataB[idxB].longitude])
            // }
        }).catch(err => console.error("Error fetching readings:", err))
    }, [])

    // Class styles for the button
    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "20px",
        display: "inline-block",
        width: isMobile ? '100%' : '70%',
        height: isMobile ? '50vh' : '80vh',
    }; 

    const idxA = readingsA.length > 0? Math.max(0, Math.min(sliderValue - 1 , readingsA.length - 1)) : 0; 
    const idxB = readingsB.length > 0? Math.max(0, Math.min(sliderValue - 1 , readingsB.length - 1)) : 0; 

    
    const positionA = readingsA[idxA]?.latitude? [readingsA[idxA].latitude, readingsA[idxA].longitude] : null; 

    const positionB = readingsB[idxB]?.latitude? [readingsB[idxA].latitude,readingsB[idxA].longitude] : null; 

    if (!positionA|| !positionB) return <p> Map is mapping out your livestock ...</p>;


    

    return (
        // From leaflet docs
        <div className="gap-4" style={cardStyle}>
            <MapContainer center={positionA} zoom={16} scrollWheelZoom={true} style={{ height: isMobile ? '85%' : '90%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Recenter position={positionA} />

                {showA && <HotlineLayer readings={readingsA} sliderValue={sliderValue} />}
                {showB && <HotlineLayer readings={readingsB} sliderValue={sliderValue} />}

                {showA && positionA && <Marker position={positionA} icon={customIcon('#2947cd')}></Marker>}
                {showB && positionB && <Marker position={positionB} icon={customIcon('#00a2b7')}></Marker>}
                <Legend />
            </MapContainer>
            <div className='d-flex flex-row gap-4'>
                <p>Day: placeholder </p>
                <p>Month: placeholder </p>
                <p>Year: placeholder </p>

                <button
                    onClick = {() => setShowA(!showA)}
                    style = {{
                        padding: '5px 10px',
                        background: showA? ' #2947cd' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer', }}
                        >
                            Animal A
                </button>
                <button
                    onClick = {() => setShowB(!showB)}
                    style = {{
                        padding: '5px 10px',
                        background: showB? ' #2947cd' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '10px',
                        cursor: 'pointer', }}
                        >
                            Animal B
                </button>
            </div>
            <div>
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
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