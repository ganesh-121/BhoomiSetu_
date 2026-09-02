import React, { useState } from 'react';
import { useRole, AppView } from '../context/RoleContext';
import { UserRole } from '../types';
import { 
  Map, 
  ShieldCheck, 
  User, 
  Building2, 
  Sliders, 
  Search, 
  Layers, 
  Bell, 
  Globe, 
  Sparkles,
  ChevronDown,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, setRole, activeView, setActiveView, navigateToParcel } = useRole();
  const [searchInput, setSearchInput] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigateToParcel(searchInput.trim(), 'parcel-details');
      setSearchInput('');
    }
  };

  const navLinks: { view: AppView; label: string; icon: React.ReactNode; roles?: UserRole[] }[] = [
    { view: 'landing', label: 'Overview', icon: <Globe className="w-4 h-4" /> },
    { view: 'map', label: 'Interactive GIS Map', icon: <Map className="w-4 h-4" /> },
    { view: 'verify', label: 'Verify Property', icon: <ShieldCheck className="w-4 h-4" /> },
    { view: 'citizen-dashboard', label: 'Citizen Portal', icon: <User className="w-4 h-4" /> },
    { view: 'officer-dashboard', label: 'Officer Desk', icon: <Building2 className="w-4 h-4" /> },
    { view: 'admin-dashboard', label: 'Admin & Gateway', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Emblem */}
          <div 
            onClick={() => setActiveView('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  BhoomiSetu
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  SIH 26014
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">One Parcel. Complete Information.</p>
            </div>
          </div>

          {/* Center Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search ULPIN (e.g. IN-MH-411001-P1001) or Survey No..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => setActiveView(link.view)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeView === link.view
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Actions: Role Switcher & Notifications */}
          <div className="flex items-center space-x-3">
            
            {/* SIH Role Switcher Bar */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center shadow-inner">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
                Role:
              </span>
              {(['Citizen', 'Officer', 'Admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    role === r
                      ? r === 'Admin' 
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30 font-semibold'
                        : r === 'Officer'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30 font-semibold'
                        : 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Notification Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 relative transition-all"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Live Notifications</span>
                    </h4>
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono">3 New</span>
                  </div>
                  <div className="divide-y divide-slate-700/50 text-xs">
                    <div className="py-2.5">
                      <p className="font-semibold text-slate-200">Mutation Status Updated</p>
                      <p className="text-[11px] text-slate-400">REQ-2024-8801 has been approved by Haveli Circle Officer.</p>
                      <span className="text-[10px] text-slate-500">10 mins ago</span>
                    </div>
                    <div className="py-2.5">
                      <p className="font-semibold text-amber-300">Data Conflict Detected</p>
                      <p className="text-[11px] text-slate-400">ULPIN IN-MH-411001-P1002 mismatch between RoR & Sub-Registrar.</p>
                      <span className="text-[10px] text-slate-500">1 hour ago</span>
                    </div>
                    <div className="py-2.5">
                      <p className="font-semibold text-emerald-400">API Gateway Health</p>
                      <p className="text-[11px] text-slate-400">All 6 state departmental APIs operating at 99.8% uptime.</p>
                      <span className="text-[10px] text-slate-500">2 hours ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
