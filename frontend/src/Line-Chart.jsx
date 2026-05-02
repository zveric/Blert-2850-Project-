import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart() {
  return (
    <Line
      datasetIdKey='id'
      data={{
        labels: ['Jun', 'Jul', 'Aug'],
        datasets: [
          {
            id: 1,
            label: 'Dataset 1',
            data: [5, 6, 7],
            borderColor: 'rgb(0, 30, 255)', 
          },
          {
            id: 2,
            label: 'Dataset 2',
            data: [3, 2, 1],
            borderColor: 'rgb(255, 72, 0)',
          },
        ],
      }}
    />
  );
}