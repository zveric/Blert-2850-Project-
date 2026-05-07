import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getReadings } from '../api';
import { useState, useEffect } from 'react';
import { windowBreakpoints } from './windowBreakpoints';
import DateRangeSelector from './date-range-selector';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AccelerationGraph({ startDate: externalStart, endDate: externalEnd, hidePickers = false }) {
  const isControlled = externalStart !== undefined && externalEnd !== undefined;

  const [internalStart, setInternalStart] = useState(null);
  const [internalEnd, setInternalEnd]     = useState(null);

  const startDate = isControlled ? externalStart : internalStart;
  const endDate   = isControlled ? externalEnd   : internalEnd;

  const [accel1, setAccel1] = useState([]);
  const [accel2, setAccel2] = useState([]);
  const [labels, setLabels] = useState([]);

  const { isMobile } = windowBreakpoints();

  const fetchGraphData = () => {
    Promise.all([
      getReadings(500, 1, startDate, endDate),
      getReadings(500, 2, startDate, endDate),
    ]).then(([data1, data2]) => {
      if (!data1 || !data2) return;
      setAccel1(data1.map(item => item.accel_mag_g));
      setAccel2(data2.map(item => item.accel_mag_g));
      setLabels(data1.map((item, index) =>
        item.timestamp
          ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : `Reading ${index + 1}`
      ));
    }).catch(err => console.error('AccelerationGraph fetch failed:', err));
  };

  // Re-fetch whenever the active dates change
  useEffect(() => {
    fetchGraphData();
  }, [startDate, endDate]);

  const handleInternalDateChange = ({ startDate, endDate }) => {
    setInternalStart(startDate);
    setInternalEnd(endDate);
  };

  const showBuiltInPickers = !hidePickers && !isControlled;

  return (
    <div style={{ height: '100%' }}>
      {showBuiltInPickers && (
        <div style={{ marginBottom: '15px', zIndex: 10 }}>
          <DateRangeSelector
            startDate={internalStart}
            endDate={internalEnd}
            onChange={handleInternalDateChange}
            onApply={fetchGraphData}
            showApply={true}
          />
        </div>
      )}

      <div style={{ flexGrow: 1, minHeight: 0, height: showBuiltInPickers ? '80%' : '100%' }}>
        <Line
          datasetIdKey="id"
          data={{
            labels,
            datasets: [
              { id: 1, label: 'herd1: cow',  data: accel1, borderColor: 'rgb(0, 30, 255)' },
              { id: 2, label: 'herd2: goat', data: accel2, borderColor: 'rgb(255, 72, 0)' },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: 'Graph of acceleration of cows and goats',
                font: { size: 14 },
              },
            },
          }}
        />
      </div>
    </div>
  );
}