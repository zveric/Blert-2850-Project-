import React from "react";
import { Table, LayoutGrid, AlertCircle, PlayCircle, Info } from "lucide-react";

export function DetailedTable() {
  const data = [
    { id: 'Cow 1', temp: '32°C', status: 'Bad Behaviour', advice: 'Keep in pen', action: 'Notified Handler 2', lat: '22.36°', lon: '67.67°', severity: 'amber' },
    { id: 'Cow 3', temp: '37°C', status: 'Stolen', advice: 'Police dispatch', action: 'Auto-police called', lat: '67°', lon: '30°', severity: 'red' },
    { id: 'P3', temp: '25°C', status: 'Normal', advice: 'None', action: 'None', lat: '22.36°', lon: '67.67°', severity: 'green' }
  ];

  const getSeverityClasses = (severity: string) => {
    switch(severity) {
      case 'red': return "bg-red-50 text-red-700 border-red-200";
      case 'amber': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'green': return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-6 flex flex-col w-full h-full">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <LayoutGrid className="text-indigo-500" size={20} />
          Detailed Log
        </h2>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-medium">
          Last updated: Just now
        </div>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
              <th className="px-6 py-4 border-b border-slate-200">ID</th>
              <th className="px-6 py-4 border-b border-slate-200">Temp</th>
              <th className="px-6 py-4 border-b border-slate-200">Alert Status</th>
              <th className="px-6 py-4 border-b border-slate-200">Advice</th>
              <th className="px-6 py-4 border-b border-slate-200">Auto-Action</th>
              <th className="px-6 py-4 border-b border-slate-200 text-right">Coordinates</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                  {row.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {row.temp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityClasses(row.severity)}`}>
                    {row.severity === 'red' && <AlertCircle size={12} className="mr-1" />}
                    {row.severity === 'amber' && <Info size={12} className="mr-1" />}
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {row.advice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    {row.action !== 'None' && <PlayCircle size={14} className="text-blue-500" />}
                    {row.action}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right font-mono text-xs">
                  {row.lat} Lat<br/>{row.lon} Lon
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}