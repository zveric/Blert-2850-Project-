import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getReadings } from '../api';
import { useState, useEffect } from 'react';
import { windowBreakpoints } from './windowBreakpoints';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ActivityPattern() {
    const [hourlyA, setHourlyA] = useState(new Array(24).fill(0));
    const [hourlyB, setHourlyB] = useState(new Array(24).fill(0));
    const { isMobile } = windowBreakpoints();

    useEffect(() => {
        getReadings(500, 1).then(data => {
            console.log(data)
            const buckets = new Array(24).fill(0)
            const counts = new Array(24).fill(0)
            data.forEach(r => {
                if (!r.timestamp || r.accel_mag_g == null) return
                const hour = new Date(r.timestamp).getHours()
                buckets[hour] += r.accel_mag_g
                counts[hour]++
            })
            setHourlyA(buckets.map((sum, i) => counts[i] ? +(sum / counts[i]).toFixed(3) : 0))
        })

        getReadings(500, 2).then(data => {
            console.log(data)
            const buckets = new Array(24).fill(0)
            const counts = new Array(24).fill(0)
            data.forEach(r => {
                if (!r.timestamp || r.accel_mag_g == null) return
                const hour = new Date(r.timestamp).getHours()
                buckets[hour] += r.accel_mag_g
                counts[hour]++
            })
            setHourlyB(buckets.map((sum, i) => counts[i] ? +(sum / counts[i]).toFixed(3) : 0))
        })
    }, [])

    const hours = Array.from({length: 24}, (_, i) => `${i}:00`)

    // Class styles for the button
    const cardStyle = {
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
        padding: "20px",
        display: "inline-block",
        width: '100%',
        height: isMobile ? "50vh" : "40%",
    };

    return (
        <div style={{height: "100%"}}>
            <Bar
                datasetIdKey='id'
                data={{
                    labels: hours,
                    datasets: [
                        {
                            id: 1,
                            label: 'herd1: cow',
                            data: hourlyA,
                            backgroundColor: 'rgba(0, 30, 255, 0.6)',
                        },
                        {
                            id: 2,
                            label: 'herd2: goat',
                            data: hourlyB,
                            backgroundColor: 'rgba(255, 72, 0, 0.6)',
                        },
                    ],
                }}
                options={{
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'avg activity level by hour of day',
                            font: {
                                size: 14,
                            }
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'avg accel (g)',
                            }
                        }
                    }
                }}
            />
        </div>
    )
}

// Generated nearly the entire file with Ai using Claude Sonnet 4.6