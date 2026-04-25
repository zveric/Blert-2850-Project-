import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon } from "lucide-react";

export function AlertStatusChart() {
  const data = [
    { name: 'Green (Normal)', value: 85, color: '#15803d' },
    { name: 'Amber (Warning)', value: 10, color: '#b45309' },
    { name: 'Red (Critical)', value: 5, color: '#b91c1c' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <PieChartIcon className="text-blue-500" size={20} />
          Alert Status
        </h2>
      </div>
      
      <div className="flex-grow w-full min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-8">
            <span className="text-4xl font-light text-slate-800">100%</span>
            <span className="text-sm text-slate-500 uppercase tracking-widest mt-1">Active</span>
        </div>
      </div>
    </div>
  );
}
