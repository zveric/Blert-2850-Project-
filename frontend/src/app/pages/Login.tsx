import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { AlertStatusChart } from '../components/AlertStatusChart';
import { AlertButton } from '../components/AlertButton';
import { AdvicePanel } from '../components/AdvicePanel';
import { DetailedTable } from '../components/DetailedTable';


export function Login() {
  return (
    <div className="space-y-6">
      {/* Top Row: 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          value="2" 
          total="2" 
          title="Animals Online" 
          alertColor="green"
        />
        <MetricCard 
          value="0" 
          total="2" 
          title="Animals Grazing" 
          alertColor="amber"
        />
        <MetricCard 
          value="32" 
          title="Days Since Breach" 
        />
      </div>

      {/* Middle Row: Action/Status Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Made Alert Status box bigger by spanning 2 columns */}
        <div className="xl:col-span-2 min-h-[400px]">
          <AlertStatusChart />
        </div>
        <div className="xl:col-span-1 min-h-[400px]">
          <AlertButton />
        </div>
        <div className="xl:col-span-1 min-h-[400px]">
          <AdvicePanel />
        </div>
      </div>

      {/* Bottom Row - Detailed Table */}
      <DetailedTable />
    </div>
  );
}
