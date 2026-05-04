import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getReadings } from '../api';
import { useState, useEffect } from 'react';
import { windowBreakpoints } from './windowBreakpoints';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function accelerationGraph() {
  const [acccel1, setacccel1] = useState([]);
  const [acccel2, setacccel2] = useState([]);
  const [labels, setLabels] = useState([]);
  const { width, height,isMobile } = windowBreakpoints();

  useEffect(() => {
    getReadings(50, 1).then(data => {
      data = data.reverse();
      
      const acccel1 = data.map(item => item.g_acceleration);
      console.log(acccel1); 
      setacccel1(acccel1);

      const times = data.map((item, index) => {
        return item.timestamp 
          ? new Date(item.timestamp).toLocaleTimeString() 
          : `Reading ${index + 1}`;
      });
      
      setLabels(times);
    });

      getReadings(50, 2).then(data => {
      data = data.reverse();
      
      const acccel2 = data.map(item => item.g_acceleration);
      console.log(acccel2); 
      setacccel2(acccel2);

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
        height: isMobile ? "300px" : "40%",
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
            data: acccel1, 
            borderColor: 'rgb(0, 30, 255)', 
          },
                    {
            id: 2,
            label: 'herd2: goat',
            data: acccel2,
            borderColor: 'rgb(255, 72, 0)',
          },
        ],
      }}
      options={{
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'graph of acceleration of cows and goats', 
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