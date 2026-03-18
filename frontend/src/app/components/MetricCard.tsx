import React from "react";

export function MetricCard({ 
  value, 
  total, 
  title, 
  alertColor,
  icon: Icon
}: { 
  value: string | number; 
  total?: string | number; 
  title: string; 
  alertColor?: 'green' | 'amber' | 'red';
  icon?: React.ElementType;
}) {
  const colorClasses = {
    green: 'text-green-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
    default: 'text-slate-800'
  };

  const ringClasses = {
    green: 'ring-green-100',
    amber: 'ring-amber-100',
    red: 'ring-red-100',
    default: 'ring-slate-100'
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
      {Icon && (
        <div className={`absolute top-4 right-4 text-slate-300`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
      )}
      <div className={`text-6xl font-light mb-2 flex items-baseline ${alertColor ? colorClasses[alertColor] : colorClasses.default}`}>
        {value}
        {total && (
          <span className="text-3xl text-slate-400 ml-1">/{total}</span>
        )}
      </div>
      <div className="text-slate-500 font-medium text-center text-sm uppercase tracking-wider">{title}</div>
    </div>
  );
}
