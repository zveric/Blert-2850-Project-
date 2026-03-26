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
    <div class="container">
        <h1>Enter Password</h1>
        <form id="passwordForm">
            <div class="input-group">
                <div class="input-container">
                    <input type="password" id="password" placeholder="Enter your password" />
                    <button type="button" id="toggleVisibility" aria-label="Show Password">👁️</button>
                </div>
            </div>
        </form>
    </div>
        </div>

    
  );
}


