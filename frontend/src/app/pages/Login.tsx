import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { AlertStatusChart } from '../components/AlertStatusChart';
import { AlertButton } from '../components/AlertButton';
import { AdvicePanel } from '../components/AdvicePanel';
import { DetailedTable } from '../components/DetailedTable';


export function Login() {
  return (
    <div className="space-y-6">
     <input name="username" />
     <input name="password" />
    </div>
  );
}
