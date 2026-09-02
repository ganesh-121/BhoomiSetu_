import React from 'react';
import { RoleProvider, useRole } from './context/RoleContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { GisMapView } from './components/GisMapView';
import { ParcelDetailsView } from './components/ParcelDetailsView';
import { PropertyVerification } from './components/PropertyVerification';
import { CitizenDashboard } from './components/CitizenDashboard';
import { OfficerDashboard } from './components/OfficerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Layers, ShieldCheck, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView } = useRole();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {activeView === 'landing' && <LandingPage />}
      {activeView === 'map' && <GisMapView />}
      {activeView === 'parcel-details' && <ParcelDetailsView />}
      {activeView === 'verify' && <PropertyVerification />}
      {activeView === 'citizen-dashboard' && <CitizenDashboard />}
      {activeView === 'officer-dashboard' && <OfficerDashboard />}
      {activeView === 'admin-dashboard' && <AdminDashboard />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <RoleProvider>
      <div className="min-h-screen flex flex-col bg-[#0b1329] text-slate-100 selection:bg-cyan-500 selection:text-white">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Dynamic App Content */}
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Footer */}
        <footer className="bg-slate-950 border-t border-slate-800 py-8 text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">BhoomiSetu Platform</p>
                <p className="text-[11px] text-slate-400">SIH Problem Statement 26014 — Unified ULPIN GIS Parcel Stack</p>
              </div>
            </div>

            <div className="text-center md:text-right space-y-1">
              <p className="text-slate-400">
                Built with React, TypeScript, Leaflet, GeoJSON & Node.js REST Gateway.
              </p>
              <p className="text-[11px] text-slate-400">
                Mock dataset demonstration for Smart India Hackathon evaluation.
              </p>
            </div>

          </div>
        </footer>

      </div>
    </RoleProvider>
  );
};

export default App;
