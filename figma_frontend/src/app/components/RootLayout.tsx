import React from 'react';
import { Outlet, NavLink } from 'react-router';
import { HelpCircle, Activity, Bell, LogOut, User, LayoutDashboard, Map as MapIcon } from 'lucide-react';

export function RootLayout() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-2 py-5 border-b-2 transition-colors ${isActive ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-800 hover:border-slate-300'}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              b
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              blert <span className="text-sm font-normal text-slate-500 ml-1 tracking-normal">a moovement tracker</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <NavLink to="/" className={navLinkClass} end>
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink to="/analytics" className={navLinkClass}>
                <Activity size={16} /> Analytics
              </NavLink>
              <NavLink to="/map" className={navLinkClass}>
                <MapIcon size={16} /> Live Map
              </NavLink>
            </nav>
            
            <div className="w-px h-6 bg-slate-200 mx-2 hidden sm:block"></div>
            
            <div className="flex items-center gap-4">
              <button className="relative text-slate-400 hover:text-slate-600 transition-colors" aria-label="Alerts">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <button className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Help">
                <HelpCircle size={20} />
              </button>
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden shadow-sm ring-2 ring-white cursor-pointer hover:ring-blue-100 transition-all ml-2">
                <User size={18} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area for Pages */}
      <main className="flex-grow p-6">
        <div className="max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
