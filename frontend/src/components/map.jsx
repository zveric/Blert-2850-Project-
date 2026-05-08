import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { getReadings } from "../api";
import { divIcon } from "leaflet";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "leaflet/dist/leaflet.css";
import { useWindowBreakpoints } from "./useWindowBreakpoints";
import L from "leaflet";

function getColor(deviation) {
  if (deviation < 0.1) return "#2196f3";
  if (deviation < 0.3) return "#4CAF50";
  if (deviation < 0.4) return "#ff9800";
  return "#f44336";
}

function Recenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);
  return null;
}

function Legend() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div");
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
                <span style="color: #0b5ea8;">&#9632;</span> Resting/Grazing <br/>
                <span style="color: #276b27;">&#9632;</span> Walking <br/>
                <span style="color: #7a4900;">&#9632;</span> Aggitated <br/>
                <span style="color: #b91c1c;">&#9632;</span> Running/Distressed
            `;
      return div;
    };

    legend.addTo(map);
    return () => legend.remove();
  }, [map]);

  return null;
}

function HotlineLayer({ readings, sliderValue }) {
  const map = useMap();

  useEffect(() => {
    if (!readings || readings.length < 2) return;

    const visible = readings.slice(0, sliderValue);
    const layers = [];

    try {
      for (let i = 1; i < visible.length; i++) {
        const prev = visible[i - 1];
        const curr = visible[i];
        const deviation = Math.abs((curr.accel_mag_g ?? 1) - 1.0);
        const color = getColor(deviation);
        const segment = L.polyline(
          [
            [prev.latitude, prev.longitude],
            [curr.latitude, curr.longitude],
          ],
          { color, weight: 4, opacity: 0.7 },
        ).addTo(map);
        layers.push(segment);
      }
    } catch (err) {
      console.error("Error creating hotline layer", err);
    }

    return () => layers.forEach((layer) => map.removeLayer(layer));
  }, [readings, sliderValue, map]);

  return null;
}

const btnStyle = (active, color) => ({
  padding: "4px 12px",
  background: active ? color : "white",
  color: active ? "white" : "#555",
  border: "1px solid",
  borderColor: active ? color : "#ccc",
  borderRadius: "20px",
  fontSize: "12px",
  cursor: "pointer",
});

function Map({ startDate, endDate }) {
  const [readingsA, setReadingsA] = useState([]);
  const [readingsB, setReadingsB] = useState([]);
  const [livestock, setLivestock] = useState("1");
  const [sliderValue, setSliderValue] = useState(1);
  const { isMobile } = useWindowBreakpoints();
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);

  const customIcon = (color) =>
    divIcon({
      className: "",
      html: `<i class="fa-solid fa-location-dot" style="color: ${color}; font-size: 32px;"></i>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

  useEffect(() => {
    const MAX_WINDOW = 50;
    Promise.all([
      getReadings(MAX_WINDOW, 1, startDate, endDate),
      getReadings(MAX_WINDOW, 2, startDate, endDate),
    ])
      .then(([dataA, dataB]) => {
        if (dataA && dataA.length > 0) setReadingsA(dataA);
        if (dataB && dataB.length > 0) setReadingsB(dataB);
        setSliderValue(1);
      })
      .catch((err) => console.error("Error fetching readings:", err));
  }, [startDate, endDate]);

  const idxA =
    readingsA.length > 0
      ? Math.max(0, Math.min(sliderValue - 1, readingsA.length - 1))
      : 0;
  const idxB =
    readingsB.length > 0
      ? Math.max(0, Math.min(sliderValue - 1, readingsB.length - 1))
      : 0;

  const timestamp = readingsA[idxA]?.timestamp ?? null;

  const positionA = readingsA[idxA]?.latitude
    ? [readingsA[idxA].latitude, readingsA[idxA].longitude]
    : null;
  const positionB = readingsB[idxB]?.latitude
    ? [readingsB[idxB].latitude, readingsB[idxB].longitude]
    : null;

  const cardStyle = {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    padding: "20px",
    display: "inline-block",
    width: isMobile ? "100%" : "70%",
    height: isMobile ? "50vh" : "100%",
    boxSizing: "border-box",
  };

  if (!positionA || !positionB)
    return <p> Map is mapping out your livestock ...</p>;

  return (
    <div
      className="readings-info bs-border-color-light gap-4"
      style={cardStyle}
    >
      <MapContainer
        center={livestock === "1" ? positionA : positionB}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: isMobile ? "75%" : "90%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter position={livestock === "1" ? positionA : positionB} />

        {showA && (
          <HotlineLayer readings={readingsA} sliderValue={sliderValue} />
        )}
        {showB && (
          <HotlineLayer readings={readingsB} sliderValue={sliderValue} />
        )}

        {showA && positionA && (
          <Marker position={positionA} icon={customIcon("#2947cd")} />
        )}
        {showB && positionB && (
          <Marker position={positionB} icon={customIcon("#006f7e")} />
        )}
        <Legend />
      </MapContainer>
      <div style={{ height: isMobile ? "25%" : "10%", alignItems: "center" }}>
        <div
          className="d-flex flex-row gap-4"
          style={{ fontSize: "12px", color: "#555", marginTop: "6px" }}
        >
          <p style={{ margin: 0 }}>
            Day: {timestamp ? new Date(timestamp).getDate() : "N/A"}
          </p>
          <p style={{ margin: 0 }}>
            Month: {timestamp ? new Date(timestamp).getMonth() + 1 : "N/A"}
          </p>
          <p style={{ margin: 0 }}>
            Year: {timestamp ? new Date(timestamp).getFullYear() : "N/A"}
          </p>
          <p style={{ margin: 0 }}>
            Time: {timestamp ? new Date(timestamp).toLocaleTimeString() : "N/A"}
          </p>
        </div>

        <div
          className="d-flex flex-row align-items-center gap-3"
          style={{ marginTop: "8px", flexWrap: "wrap" }}
        >
          <input
            type="range"
            min="1"
            max={Math.max(readingsA.length, readingsB.length, 1)}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            style={{ flex: 1, minWidth: "100px" }}
            aria-label="Timeline slider for Map"
          />
          <label
            style={{ fontSize: "11px", color: "#555", whiteSpace: "nowrap" }}
          >
            Time: {sliderValue}
          </label>

          <button
            onClick={() => setShowA(!showA)}
            style={btnStyle(showA, "#2947cd")}
            aria-label="Toggle Cow Herd visibility"
          >
            Cow
          </button>
          <button
            onClick={() => setShowB(!showB)}
            style={btnStyle(showB, "#006f7e")}
            aria-label="Toggle Goat Herd visibility"
          >
            Goat
          </button>

          <div className="d-flex flex-row gap-2" style={{ fontSize: "11px" }}>
            <label style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name="livestock"
                value="1"
                checked={livestock === "1"}
                onChange={(e) => setLivestock(e.target.value)}
                style={{ marginRight: "4px" }}
              />
              Cow Herd
            </label>
            <label style={{ cursor: "pointer" }}>
              <input
                type="radio"
                name="livestock"
                value="2"
                checked={livestock === "2"}
                onChange={(e) => setLivestock(e.target.value)}
                style={{ marginRight: "4px" }}
              />
              Goat Herd
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Map;
