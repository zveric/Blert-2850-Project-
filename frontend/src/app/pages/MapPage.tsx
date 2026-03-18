import React from 'react';
import { LivestockMap } from '../components/LivestockMap';
import { AdvicePanel } from '../components/AdvicePanel';
import { DetailedTable } from '../components/DetailedTable';

export function MapPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-160px)] min-h-[700px]">
        <div className="xl:col-span-3 h-full">
          <LivestockMap />
        </div>
        <div className="xl:col-span-1 h-full flex flex-col gap-6">
          <div className="flex-grow min-h-[300px]">
             <AdvicePanel />
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
             <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
               Map Controls
             </h3>
             <div className="space-y-4">
               <label className="flex items-center gap-3 text-sm text-slate-600 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" /> 
                  Show Topography
               </label>
               <label className="flex items-center gap-3 text-sm text-slate-600 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> 
                  Show Water Sources
               </label>
               <label className="flex items-center gap-3 text-sm text-slate-600 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-emerald-800 focus:ring-emerald-800" /> 
                  Show Shade Zones
               </label>
               <label className="flex items-center gap-3 text-sm text-slate-600 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-amber-700 focus:ring-amber-700" /> 
                  Show Feeding Areas
               </label>
               <label className="flex items-center gap-3 text-sm text-slate-600 font-medium cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-red-500 focus:ring-red-500" /> 
                  Highlight Alerts Only
               </label>
             </div>
          </div>
        </div>
      </div>
      <DetailedTable />
    </div>
  );
}
