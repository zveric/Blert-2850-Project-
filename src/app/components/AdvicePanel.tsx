import React from "react";
import { Lightbulb, CheckCircle2 } from "lucide-react";

export function AdvicePanel() {
  const advices = [
    { text: "Keep Cow A in pen", status: "pending" },
    { text: "Get handler 2 to fetch goat 1", status: "actioned" },
    { text: "Monitor ambient temperature for Paddock 3", status: "pending" }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-sm border border-blue-100 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full mix-blend-overlay blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 relative z-10">
          <Lightbulb className="text-yellow-500 fill-yellow-500" size={20} />
          Automated Advice
        </h2>
      </div>
      
      <div className="flex-grow flex flex-col gap-3 relative z-10">
        {advices.map((advice, i) => (
          <div key={i} className="flex items-start gap-3 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm transition-all hover:bg-white hover:-translate-y-0.5">
            {advice.status === 'actioned' ? (
              <CheckCircle2 size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
            ) : (
              <div className="w-4.5 h-4.5 rounded-full border-2 border-slate-300 mt-0.5 flex-shrink-0"></div>
            )}
            <span className={`text-sm ${advice.status === 'actioned' ? 'text-slate-500 line-through' : 'text-slate-700 font-medium'}`}>
              {advice.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
