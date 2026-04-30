// import React, { useState, useEffect } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"

// // This tells TypeScript what the data coming from Django looks like
// interface Reading {
//   id: number;
//   timestamp: string;
//   site_id: string;
//   latitude: number;
//   longitude: number;
//   accel_mag_g: number;
//   ambient_temperature_c: number;
//   status: string;
// }

// export function DetailedTable() {
//   const [readings, setReadings] = useState<Reading[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Fetch the data from your Django backend
//     // Make sure your Django server is running on port 8000!
//     fetch('http://localhost:8000/readings/')
//       .then(response => {
//         if (!response.ok) throw new Error("Failed to fetch data");
//         return response.json();
//       })
//       .then(data => {
//         // Because your CSV is huge (140,000+ rows), let's just grab the last 20 for the table
//         // In a real app, you would handle this pagination on the backend!
//         const latestReadings = Array.isArray(data) ? data.slice(-20) : data.results?.slice(-20) || [];
//         setReadings(latestReadings);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error("Error loading table data:", error);
//         setLoading(false);
//       });
//   }, []);

//   // Helper function to format the timestamp into something readable
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString([], {
//       month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return <div className="p-8 text-center text-slate-500">Loading sensor data...</div>;
//   }

//   return (
//     <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
//       <Table>
//         <TableHeader className="bg-slate-50">
//           <TableRow>
//             <TableHead>Time</TableHead>
//             <TableHead>Herd ID</TableHead>
//             <TableHead>Location (Lat/Lng)</TableHead>
//             <TableHead className="text-right">Temp (°C)</TableHead>
//             <TableHead className="text-right">Activity (G)</TableHead>
//             <TableHead className="text-center">Status</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {readings.map((reading, index) => (
//             <TableRow key={reading.id || index}>
//               <TableCell className="font-medium text-slate-700">
//                 {formatDate(reading.timestamp)}
//               </TableCell>
//               <TableCell>{reading.site_id}</TableCell>
//               <TableCell className="text-slate-500 text-xs font-mono">
//                 {reading.latitude.toFixed(4)}, {reading.longitude.toFixed(4)}
//               </TableCell>
//               <TableCell className="text-right">{reading.ambient_temperature_c.toFixed(1)}°</TableCell>
//               <TableCell className="text-right">{reading.accel_mag_g.toFixed(2)}</TableCell>
//               <TableCell className="text-center">
//                 {/* Dynamically color the badge based on the status */}
//                 <Badge variant={reading.status === 'normal' ? 'outline' : 'destructive'} 
//                        className={reading.status === 'normal' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
//                   {reading.status.toUpperCase()}
//                 </Badge>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }