import React, { useState } from 'react';
import { useRole } from '../context/RoleContext';
import { 
  Search, 
  Map, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Building2, 
  Landmark, 
  Activity, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle,
  Database,
  Lock,
  GitPullRequest
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, navigateToParcel } = useRole();
  const [searchInput, setSearchInput] = useState('');

  const sampleUlpins = [
    { code: 'IN-MH-411001-P1001', label: 'Baner (Clear Title)', status: 'Verified' },
    { code: 'IN-MH-411001-P1002', label: 'Aundh (Dispute & Mortgage)', status: 'Issue Found' },
    { code: 'IN-MH-411001-P1003', label: 'Wakad (Residential)', status: 'Verified' },
    { code: 'IN-MH-411001-P1004', label: 'Hinjawadi IT Park', status: 'Pending Clearance' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigateToParcel(searchInput.trim(), 'parcel-details');
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-emerald-600/10 blur-3xl rounded-full -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>SIH Problem Statement 26014 Solution</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
              One Parcel. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                Complete Information.
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              BhoomiSetu unifies fragmented land records across Sub-Registrars, Municipal Tax, RoR Land Records, Master Plan Zoning, and Environmental Authorities using the <strong>Unique Land Parcel Identification Number (ULPIN)</strong>.
            </p>

            {/* Hero Search Box */}
            <div className="max-w-2xl mx-auto bg-slate-800/90 p-3 rounded-2xl border border-slate-700 shadow-2xl backdrop-blur-lg">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter ULPIN (e.g. IN-MH-411001-P1001) or Survey No..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-cyan-600/30 flex items-center space-x-2 transition-all"
                >
                  <span>Search Parcel</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Sample ULPIN Quick Chips */}
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Try Demo Parcels:</span>
                {sampleUlpins.map((sample) => (
                  <button
                    key={sample.code}
                    onClick={() => navigateToParcel(sample.code, 'parcel-details')}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-cyan-300 font-mono transition-all flex items-center space-x-1.5"
                  >
                    <span>{sample.code}</span>
                    <span className={`text-[9px] px-1 rounded font-sans font-bold ${
                      sample.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400' :
                      sample.status === 'Issue Found' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {sample.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button
                onClick={() => setActiveView('map')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl shadow-lg flex items-center space-x-2 transition-all"
              >
                <Map className="w-5 h-5 text-cyan-400" />
                <span>Explore Interactive GIS Map</span>
              </button>

              <button
                onClick={() => setActiveView('verify')}
                className="px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold rounded-xl shadow-lg flex items-center space-x-2 transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Verify Property ("Verify Before You Buy")</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Problem vs Solution Comparison Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Fragmented Land Data Problem */}
          <div className="bg-slate-800/40 border border-rose-500/20 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">The Challenge: Fragmented Land Data</h3>
                <p className="text-xs text-rose-300 font-medium">Multiple isolated departmental silos</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Sub-Registrar deeds and RoR 7/12 mutation records operate independently without live sync.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Homebuyers risk buying properties with hidden bank mortgages, unpaid tax dues, or pending litigation.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Zoning violations and environmental restrictions (CRZ, High Tension lines) are discovered after purchase.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>Manual due diligence takes weeks with visits to 5+ government departments.</span>
              </li>
            </ul>
          </div>

          {/* Unified ULPIN Solution */}
          <div className="bg-slate-800/40 border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">The Solution: BhoomiSetu ULPIN Platform</h3>
                <p className="text-xs text-cyan-300 font-medium">Single source of truth parcel engine</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>ULPIN serves as the common 14-digit geospatial key linking all 8 departmental datasets.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Instant 7-point due diligence check ("Verify Before You Buy") generates an audit certificate in 2 seconds.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Interactive Cadastral GIS map visualizes exact parcel boundaries with togglable layer stacks.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>Transparent citizen service workflows and officer processing queues with audit trail logs.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Core Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-display font-bold text-white">Comprehensive Land Intelligence Stack</h2>
          <p className="text-sm text-slate-400 mt-2">Integrated features built specifically for Citizens, Government Officers, and Administrators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div 
            onClick={() => setActiveView('map')}
            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 hover:border-cyan-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Map className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
              Interactive GIS Cadastral Map
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Visualize vector parcel polygons powered by Leaflet & GeoJSON. Toggle Base Cadastral, Core Governance, and Infrastructure Utility layers.
            </p>
          </div>

          {/* Feature 2 */}
          <div 
            onClick={() => setActiveView('verify')}
            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
              "Verify Before You Buy" Engine
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Automated 7-point audit checks across ownership, deeds, bank liens, property tax, zoning, building permits, and environmental clearance.
            </p>
          </div>

          {/* Feature 3 */}
          <div 
            onClick={() => navigateToParcel('IN-MH-411001-P1001', 'parcel-details')}
            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 hover:border-sky-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
              Unified ULPIN Parcel Details
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Explore 8 structured sub-domains for any parcel: RoR 7/12, Sub-Registrar deeds, tax history, master plan zoning, and utility grid.
            </p>
          </div>

          {/* Feature 4 */}
          <div 
            onClick={() => setActiveView('citizen-dashboard')}
            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 hover:border-purple-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GitPullRequest className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
              Citizen Service Workflows
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Submit digital land record copy requests, mutation inquiries, or tax corrections. Track request status step-by-step in real time.
            </p>
          </div>

          {/* Feature 5 */}
          <div 
            onClick={() => setActiveView('officer-dashboard')}
            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 hover:border-amber-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
              Government Officer Desk
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Review application queues, perform field verification updates, approve/reject requests, and resolve RoR vs Sub-Registrar data conflicts.
            </p>
          </div>

          {/* Feature 6 */}
          <div 
            onClick={() => setActiveView('admin-dashboard')}
            className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 hover:border-rose-500/50 cursor-pointer transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
              API Gateway & Audit Logs
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Monitor 6 simulated state department API gateways, track inter-departmental dataset sync, and inspect immutable system audit logs.
            </p>
          </div>

        </div>
      </section>

      {/* Platform Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-display font-extrabold text-cyan-400">25+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Demo GeoJSON Parcels</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display font-extrabold text-emerald-400">6</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Department APIs Integrated</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display font-extrabold text-sky-400">7-Point</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Due Diligence Checks</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-display font-extrabold text-purple-400">100%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">ULPIN Centric Architecture</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
