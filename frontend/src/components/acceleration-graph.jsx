import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getReadings } from '../api';
import { useState, useEffect } from 'react';
import { windowBreakpoints } from './windowBreakpoints';
import DatePicker from "react-datepicker"; //used ai to learn about this library and compare to alternatives
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AccelerationGraph() {
  const [acccel1, setacccel1] = useState([]);
  const [acccel2, setacccel2] = useState([]);
  const [labels, setLabels] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [fullData1, setFullData1] = useState([]);
  // const [fullData2, setFullData2] = useState([]);
  const { width, height,isMobile } = windowBreakpoints();

useEffect(() => {
  Promise.all([
      getReadings(500, 1, startDate, endDate),
      getReadings(500, 2, startDate, endDate)
    ]).then(([data1, data2]) => {

      setacccel1(data1.map(item => item.accel_mag_g));
      setacccel2(data2.map(item => item.accel_mag_g));


        setLabels(data1.map((item, index) => {
          return item.timestamp 
            ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : `Reading ${index + 1}`;
        }));
      });
  }, [startDate, endDate]);



  //     setacccel2(goatData.map(item => item.accel_mag_g));
  // useEffect(() => {
  //   getReadings(130000, 1).then(data => {
  //     data = data.reverse();
      
  //     const acccel1 = data.map(item => item.accel_mag_g);
  //     console.log(acccel1); 
  //     setacccel1(acccel1);

  //     const times = data.map((item, index) => {
  //       return item.timestamp 
  //         ? new Date(item.timestamp).toLocaleTimeString() 
  //         : `Reading ${index + 1}`;
  //     });
      
  //     setLabels(times);
  //   });

  //     getReadings(50, 2).then(data => {
  //     data = data.reverse();
      
  //     const acccel2 = data.map(item => item.accel_mag_g);
  //     console.log(acccel2); 
  //     setacccel2(acccel2);

  //     const times = data.map((item, index) => {
  //       return item.timestamp 
  //         ? new Date(item.timestamp).toLocaleTimeString() 
  //         : `Reading ${index + 1}`;
  //     });
      
  //     setLabels(times);
      
  //   }); 
  // }, []);

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
{/* used ai to debug the silly error where I forgot to add this card */}
    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', zIndex: 10, flexWrap: 'wrap' }}> 
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          showTimeSelect
          timeIntervals={15}
          placeholderText="Start Date & Time"
          style={{ padding: '5px' }}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          showTimeSelect
          timeIntervals={15}
          placeholderText="End Date & Time"
          style={{ padding: '5px' }}
        />
        <button onClick={() => {setStartDate(null); setEndDate(null)}} style={{borderRadius: '5px'}}>Clear</button>
      </div>

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