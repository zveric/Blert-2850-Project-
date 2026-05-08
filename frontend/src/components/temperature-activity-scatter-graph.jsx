import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { getReadings } from "../api";
import { useState, useEffect } from "react";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, Title);

export default function TempVsActivity({ startDate, endDate }) {
  const [pointsA, setPointsA] = useState([]);
  const [pointsB, setPointsB] = useState([]);

  useEffect(() => {
    getReadings(200, 1, startDate, endDate).then((data) => {
      console.log(data);
      const points = data
        .filter((r) => r.ambient_temperature_c != null && r.accel_mag_g != null)
        .map((r) => ({ x: r.ambient_temperature_c, y: r.accel_mag_g }));
      setPointsA(points);
    });

    getReadings(200, 2, startDate, endDate).then((data) => {
      console.log(data);
      const points = data
        .filter((r) => r.ambient_temperature_c != null && r.accel_mag_g != null)
        .map((r) => ({ x: r.ambient_temperature_c, y: r.accel_mag_g }));
      setPointsB(points);
    });
  }, [startDate, endDate]);

  return (
    <div style={{ height: "100%" }}>
      <Scatter
        datasetIdKey="id"
        data={{
          datasets: [
            {
              id: 1,
              label: "herd1: cow",
              data: pointsA,
              backgroundColor: "rgba(0, 30, 255, 0.4)",
            },
            {
              id: 2,
              label: "herd2: goat",
              data: pointsB,
              backgroundColor: "rgba(255, 72, 0, 0.4)",
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "temperature vs activity level",
              font: { size: 14 },
            },
          },
          scales: {
            x: {
              title: { display: true, text: "temperature (°C)" },
            },
            y: {
              title: { display: true, text: "accel (g)" },
            },
          },
        }}
      />
    </div>
  );
}
