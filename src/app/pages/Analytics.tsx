import React from 'react';
import { AlertStatusChart } from '../components/AlertStatusChart';
import { DetailedTable } from '../components/DetailedTable';
import { MetricCard } from '../components/MetricCard';
import { Activity } from 'lucide-react';

export function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
         <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <Activity size={24} />
         </div>
         <h1 className="text-2xl font-bold text-slate-800">Analytics Overview</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard value="98%" title="System Uptime" alertColor="green" />
        <MetricCard value="12" title="Alerts this week" alertColor="amber" />
        <MetricCard value="1.2s" title="Average Response" alertColor="green" />
        <MetricCard value="5" title="Active Sensors" alertColor="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
         <div className="h-full"><AlertStatusChart /></div>
         <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full flex flex-col items-center justify-center text-slate-400 gap-4">
           <Activity size={48} className="opacity-20" />
           <p>Historical Data Chart (In Development)</p>
         </div>
      </div>
      
      <DetailedTable />
    </div>
  );
}
