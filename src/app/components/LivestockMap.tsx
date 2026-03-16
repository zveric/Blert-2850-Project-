import React, { useState } from "react";
import { Map as MapIcon, Droplets, Sun, Trees } from "lucide-react";

export function LivestockMap() {
  const [timeline, setTimeline] = useState(50);

  return (
    <div className="flex flex-col gap-4 h-full bg-white rounded-2xl p-6 shadow-sm border border-slate-200 w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <MapIcon className="text-emerald-600" size={20} />
          Livestock Map
        </h2>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200"><Droplets size={12} className="text-blue-500"/> Water</span>
          <span className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200"><Trees size={12} className="text-emerald-700"/> Shade</span>
        </div>
      </div>
      
      {/* Map Container */}
      <div className="flex-grow rounded-xl border-2 border-slate-300 relative overflow-hidden min-h-[500px] bg-emerald-50 shadow-inner w-full">
        {/* Topography / Field pattern */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: 'radial-gradient(#047857 2px, transparent 2px)',
          backgroundSize: '30px 30px'
        }}></div>
        
        {/* Paddock Shape - High Contrast representation */}
        <div className="absolute inset-6 rounded-[40px] border-4 border-slate-700 bg-emerald-100 shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden" style={{ borderRadius: '15% 45% 30% 20% / 20% 40% 60% 30%'}}>
          
          {/* Topography lines inside paddock */}
          <div className="absolute inset-0 opacity-10 border-[20px] border-emerald-600 rounded-full scale-150 blur-xl"></div>
          <div className="absolute inset-0 opacity-10 border-[40px] border-emerald-800 rounded-full scale-125 blur-2xl translate-x-10 translate-y-10"></div>

          {/* Water Source */}
          <div className="absolute top-10 right-10 w-40 h-32 bg-blue-300/40 rounded-full blur-md"></div>
          <div className="absolute top-12 right-12 w-28 h-20 bg-blue-400/80 rounded-[40px] border-[3px] border-blue-200 shadow-inner flex items-center justify-center">
            <Droplets size={24} className="text-white opacity-70 drop-shadow-md"/>
          </div>

          {/* Shade / Trees */}
          <div className="absolute bottom-10 left-10 w-56 h-40 bg-emerald-900/20 rounded-full blur-md"></div>
          <div className="absolute bottom-12 left-12 w-48 h-32 bg-emerald-800/60 rounded-full border-[3px] border-emerald-600/50 shadow-lg flex items-center justify-center">
             <Trees size={40} className="text-emerald-100 opacity-60 drop-shadow-md"/>
          </div>
          
          {/* Feeding Troughs */}
          <div className="absolute bottom-24 right-1/4 flex flex-col gap-6">
            <div className="h-5 w-24 bg-amber-800 rounded-sm border-2 border-amber-950 shadow-md transform rotate-12 relative overflow-hidden">
               <div className="absolute inset-1 bg-amber-200/20 rounded-sm"></div>
            </div>
            <div className="h-5 w-24 bg-amber-800 rounded-sm border-2 border-amber-950 shadow-md transform rotate-12 relative overflow-hidden">
               <div className="absolute inset-1 bg-amber-200/20 rounded-sm"></div>
            </div>
          </div>

          {/* Fences/Gates */}
          <div className="absolute left-0 top-1/4 w-16 h-40 border-r-[6px] border-slate-800 border-dashed bg-slate-300/60 shadow-inner flex flex-col justify-evenly items-end pr-1">
             <div className="w-4 h-1 bg-slate-800 rounded"></div>
             <div className="w-4 h-1 bg-slate-800 rounded"></div>
             <div className="w-4 h-1 bg-slate-800 rounded"></div>
             <div className="w-4 h-1 bg-slate-800 rounded"></div>
          </div>

          {/* Animals */}
          {/* Alert Animal */}
          <div className="absolute top-1/2 left-1/3 flex flex-col items-center group cursor-pointer z-10 hover:scale-110 transition-transform">
             <div className="w-6 h-6 bg-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)] ring-4 ring-white animate-pulse flex items-center justify-center">
               <div className="w-2 h-2 bg-white rounded-full"></div>
             </div>
             <span className="text-xs font-bold text-red-700 mt-2 bg-white px-2.5 py-1 rounded-md shadow-lg border-2 border-red-200 relative">
               Cow A - ALERT
               <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-t-2 border-l-2 border-red-200 rotate-45"></div>
             </span>
          </div>
          
          {/* Normal Animals */}
          <div className="absolute top-1/4 right-1/3 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-transform">
             <div className="w-5 h-5 bg-emerald-500 rounded-full shadow-md ring-[3px] ring-white border border-emerald-600"></div>
             <span className="text-[11px] font-bold text-slate-700 mt-1 bg-white/95 px-2 py-0.5 rounded shadow border border-slate-200">Sheep B</span>
          </div>

          <div className="absolute bottom-1/3 left-1/4 flex flex-col items-center cursor-pointer z-10 hover:scale-110 transition-transform">
             <div className="w-5 h-5 bg-emerald-500 rounded-full shadow-md ring-[3px] ring-white border border-emerald-600"></div>
             <span className="text-[11px] font-bold text-slate-700 mt-1 bg-white/95 px-2 py-0.5 rounded shadow border border-slate-200">Cow C</span>
          </div>
        </div>
      </div>

      {/* Timeline Scrollbar */}
      <div className="mt-4 flex flex-col gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
          <span>00:00</span>
          <span className="text-emerald-700 flex items-center gap-2"><MapIcon size={14}/> Timeline History</span>
          <span>24:00</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={timeline} 
          onChange={(e) => setTimeline(Number(e.target.value))}
          className="w-full h-3 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-emerald-600 shadow-inner hover:accent-emerald-500 transition-all"
        />
      </div>
    </div>
  );
}
