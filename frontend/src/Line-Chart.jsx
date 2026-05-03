import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getReadings } from './api';
import { useState, useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart() {
  const [temperatures, setTemperatures] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    getReadings(1, 50).then(data => {
      
      const temps = data.map(item => item.ambient_temperature_c);
      console.log(temps); 
      setTemperatures(temps);

      const times = data.map((item, index) => {
        return item.timestamp 
          ? new Date(item.timestamp).toLocaleTimeString() 
          : `Reading ${index + 1}`;
      });
      
      setLabels(times);
      
    }); 
  }, []);

  return (
    <Line
      datasetIdKey='id'
      data={{
        labels: labels, 
        datasets: [
          {
            id: 1,
            label: 'temp1 1',
            data: temperatures, 
            borderColor: 'rgb(0, 30, 255)', 
          },
          {
            id: 2,
            label: 'temp 2',
            data: temperatures,
            borderColor: 'rgb(255, 72, 0)',
          },
        ],
      }}
    />
  );
}