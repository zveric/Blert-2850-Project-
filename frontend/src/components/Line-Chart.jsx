import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getReadings } from '../api';
import { useState, useEffect } from 'react';
import { windowBreakpoints } from './windowBreakpoints';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart() {
  const [temperatures, setTemperatures] = useState([]);
  const [temperatures2, setTemperatures2] = useState([]);
  const [labels, setLabels] = useState([]);
  const { width, height,isMobile } = windowBreakpoints();

  useEffect(() => {
    getReadings(50, 1).then(data => {
      data = data.reverse();
      
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

      getReadings(50, 2).then(data => {
      data = data.reverse();
      
      const temps2 = data.map(item => item.ambient_temperature_c);
      console.log(temps2); 
      setTemperatures2(temps2);

      const times = data.map((item, index) => {
        return item.timestamp 
          ? new Date(item.timestamp).toLocaleTimeString() 
          : `Reading ${index + 1}`;
      });
      
      setLabels(times);
      
    }); 
  }, []);

  // Class styles for the button
    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "20px",
        display: "inline-block",
        width: '100%',
        height: isMobile ? "300px" : '600px',
    }; 

  return (
    <div style={cardStyle}>
    <Line
      datasetIdKey='id'
      data={{
        labels: labels, 
        datasets: [
          {
            id: 1,
            label: 'herd1: cow',
            data: temperatures, 
            borderColor: 'rgb(0, 30, 255)', 
          },
                    {
            id: 2,
            label: 'herd2: goat',
            data: temperatures2,
            borderColor: 'rgb(255, 72, 0)',
          },
        ],
      }}
      options={{
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Ambient temperatures of cows (blue) and goats (red)', 
              font: {
                size: 14,
              }
            }
          }
        }}
    />
    </div>
  );
}