import React from "react";
import { AlertTriangle, Speaker } from "lucide-react";

export function AlertButton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={20} />
          Alert System
        </h2>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <button className="group relative w-32 h-32 rounded-full bg-red-50 hover:bg-red-100 transition-colors border-4 border-red-500 shadow-xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-red-500 opacity-10 group-hover:opacity-20 animate-pulse"></div>
          <div className="w-20 h-20 rounded-full bg-red-500 group-hover:bg-red-600 transition-colors flex items-center justify-center text-white shadow-inner">
             <span className="font-bold uppercase tracking-wider text-sm text-center leading-tight shadow-text">Break<br/>Glass</span>
          </div>
        </button>
        
        <div className="mt-6 w-full">
           <label htmlFor="alert-message" className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-2">
              <Speaker size={14} className="text-slate-400"/>
              Announcement Feature
           </label>
           
           <textarea 
             id="alert-message"
             className="w-full h-20 bg-slate-50 rounded-lg border border-slate-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
             placeholder="Type alert message here..."
           ></textarea>
           
           <div className="flex justify-end mt-2">
              <button className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                Broadcast
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}