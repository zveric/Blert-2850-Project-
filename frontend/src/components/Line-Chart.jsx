import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getReadings } from "../api";
import { useState, useEffect } from "react";
import { windowBreakpoints } from "./windowBreakpoints";
import DateRangeSelector from "./date-range-selector";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function LineChart({
  startDate: externalStart,
  endDate: externalEnd,
  hidePickers = false,
}) {
  const isControlled = externalStart !== undefined && externalEnd !== undefined;

  const [internalStart, setInternalStart] = useState(null);
  const [internalEnd, setInternalEnd] = useState(null);

  const startDate = isControlled ? externalStart : internalStart;
  const endDate = isControlled ? externalEnd : internalEnd;

  const [temperatures, setTemperatures] = useState([]);
  const [temperatures2, setTemperatures2] = useState([]);
  const [labels, setLabels] = useState([]);

  const { isMobile } = windowBreakpoints();

  useEffect(() => {
    getReadings(50, 1, startDate, endDate).then((data) => {
      data = data.reverse();
      setTemperatures(data.map((item) => item.ambient_temperature_c));
      setLabels(
        data.map((item, index) =>
          item.timestamp
            ? new Date(item.timestamp).toLocaleTimeString()
            : `Reading ${index + 1}`,
        ),
      );
    });

    getReadings(50, 2, startDate, endDate).then((data) => {
      data = data.reverse();
      setTemperatures2(data.map((item) => item.ambient_temperature_c));
    });
  }, [startDate, endDate]);

  const showBuiltInPickers = !hidePickers && !isControlled;

  return (
    <div style={{ height: "100%" }}>
      {showBuiltInPickers && (
        <div style={{ marginBottom: "15px", zIndex: 10 }}>
          <DateRangeSelector
            startDate={internalStart}
            endDate={internalEnd}
            onChange={({ startDate, endDate }) => {
              setInternalStart(startDate);
              setInternalEnd(endDate);
            }}
            showApply={false}
          />
        </div>
      )}

      <div
        style={{
          flexGrow: 1,
          minHeight: 0,
          height: showBuiltInPickers ? "80%" : "100%",
        }}
      >
        <Line
          datasetIdKey="id"
          data={{
            labels,
            datasets: [
              {
                id: 1,
                label: "herd1: cow",
                data: temperatures,
                borderColor: "rgb(0, 30, 255)",
              },
              {
                id: 2,
                label: "herd2: goat",
                data: temperatures2,
                borderColor: "rgb(255, 72, 0)",
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "Ambient temperatures of cows (blue) and goats (red)",
                font: { size: 14 },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
