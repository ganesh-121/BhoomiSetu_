import React, { useEffect, useState, useRef } from 'react';
import { useRole } from '../context/RoleContext';
import { Parcel } from '../types';
import { 
  Layers, 
  Search, 
  ShieldCheck, 
  FileText, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Filter,
  Maximize2,
  Info
} from 'lucide-react';

declare global {
  interface Window {
    L: any;
  }
}

export const GisMapView: React.FC = () => {
  const { navigateToParcel } = useRole();
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayers, setActiveLayers] = useState({
    baseCadastral: true,
    coreGovernance: true,
    infrastructure: false,
  });
  const [loading, setLoading] = useState(true);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const polygonLayersRef = useRef<any[]>([]);

  // Fetch Parcels Data from Backend API
  useEffect(() => {
    fetch('/api/parcels')
      .then(res => res.json())
      .then(data => {
        const parcelList = data.parcels || [];
        setParcels(parcelList);
        if (parcelList.length > 0) {
          setSelectedParcel(parcelList[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch parcels:", err);
        setLoading(false);
      });
  }, []);

  // Initialize & Render Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || parcels.length === 0 || !window.L) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const L = window.L;

    // Initial map centered at Pune/Haveli cluster
    const map = L.map(mapContainerRef.current, {
      center: [18.55, 73.80],
      zoom: 13,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Dark Tile Layer from OpenStreetMap CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Clear previous polygon layer references
    polygonLayersRef.current = [];

    // Render Parcel Polygons
    parcels.forEach((parcel) => {
      // Color logic based on status
      let fillColor = '#059669'; // Emerald for Verified
      let borderColor = '#10b981';

      if (parcel.status === 'Issue Found') {
        fillColor = '#e11d48'; // Rose for Issue Found
        borderColor = '#f43f5e';
      } else if (parcel.status === 'Pending Clearance') {
        fillColor = '#d97706'; // Amber for Pending
        borderColor = '#f59e0b';
      }

      // GeoJSON polygon coordinates in Leaflet [lat, lng] format
      const polygonCoords = parcel.coordinates;

      const polygon = L.polygon(polygonCoords, {
        color: borderColor,
        weight: selectedParcel?.ulpin === parcel.ulpin ? 4 : 2,
        fillColor: fillColor,
        fillOpacity: selectedParcel?.ulpin === parcel.ulpin ? 0.6 : 0.35,
        dashArray: activeLayers.infrastructure ? '5, 5' : null
      }).addTo(map);

      // Popup html
      const popupContent = `
        <div style="font-family: Inter, sans-serif; padding: 4px;">
          <div style="font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase; tracking: 0.05em;">ULPIN: ${parcel.ulpin}</div>
          <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-top: 2px;">Survey No: ${parcel.surveyNo} (${parcel.village})</div>
          <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Owner: <b>${parcel.owner.name}</b></div>
          <div style="font-size: 11px; color: #94a3b8;">Area: <b>${parcel.areaSqM} m²</b> (${parcel.areaAcres} Acres)</div>
          <div style="margin-top: 6px; padding: 3px 6px; font-size: 10px; font-weight: 700; border-radius: 4px; display: inline-block; background-color: ${fillColor}33; color: ${borderColor}; border: 1px solid ${borderColor}66;">
            ${parcel.status}
          </div>
        </div>
      `;

      polygon.bindPopup(popupContent);

      polygon.on('click', () => {
        setSelectedParcel(parcel);
      });

      polygonLayersRef.current.push({ ulpin: parcel.ulpin, polygon });
    });

    // Fit map bounds to encompass all parcels
    if (parcels.length > 0) {
      const allCoords = parcels.flatMap(p => p.coordinates);
      const bounds = L.latLngBounds(allCoords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [parcels, activeLayers]);

  // Handle Search on Map
  const handleMapSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = parcels.find(p => 
      p.ulpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.surveyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matched && mapInstanceRef.current && window.L) {
      setSelectedParcel(matched);
      mapInstanceRef.current.setView(matched.center, 16, { animate: true });
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Map Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Interactive Cadastral GIS Platform</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ULPIN parcel boundary layers integrated with Record of Rights, Municipal Tax, and Zoning.
          </p>
        </div>

        {/* Search Input on Map */}
        <form onSubmit={handleMapSearch} className="w-full sm:w-80">
          <div className="relative">
            <input
              type="text"
              placeholder="Locate ULPIN, Survey No, or Owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </form>

      </div>

      {/* Main Map Container + Side Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px]">
        
        {/* Left GIS Leaflet Canvas (8 Columns) */}
        <div className="lg:col-span-8 relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          
          {/* Map Layer Controls Floating Panel */}
          <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 p-3 rounded-xl border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs space-y-2 max-w-xs">
            <div className="font-bold text-white flex items-center space-x-1.5 pb-1 border-b border-slate-700">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Map Layer Control</span>
            </div>

            <label className="flex items-center space-x-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={activeLayers.baseCadastral}
                onChange={(e) => setActiveLayers({ ...activeLayers, baseCadastral: e.target.checked })}
                className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-800 border-slate-600"
              />
              <span className="font-medium">Base Cadastral Boundaries</span>
            </label>

            <label className="flex items-center space-x-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={activeLayers.coreGovernance}
                onChange={(e) => setActiveLayers({ ...activeLayers, coreGovernance: e.target.checked })}
                className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-800 border-slate-600"
              />
              <span className="font-medium">Core Governance (Ownership & Status)</span>
            </label>

            <label className="flex items-center space-x-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={activeLayers.infrastructure}
                onChange={(e) => setActiveLayers({ ...activeLayers, infrastructure: e.target.checked })}
                className="rounded text-cyan-500 focus:ring-cyan-500 bg-slate-800 border-slate-600"
              />
              <span className="font-medium">Utilities & Road Infrastructure</span>
            </label>
          </div>

          {/* Map Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-[400] bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700/80 shadow-2xl backdrop-blur-md text-[11px] flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-emerald-400"></span>
              <span className="text-slate-300">Verified</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block border border-rose-400"></span>
              <span className="text-slate-300">Issue / Dispute</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-amber-400"></span>
              <span className="text-slate-300">Pending</span>
            </div>
          </div>

          {/* Map Target HTML Div */}
          {loading ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
              Loading Cadastral Parcel Geometry...
            </div>
          ) : (
            <div ref={mapContainerRef} className="w-full h-full"></div>
          )}

        </div>

        {/* Right Selected Parcel Side Drawer (4 Columns) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl overflow-y-auto flex flex-col justify-between">
          
          {selectedParcel ? (
            <div className="space-y-5">
              
              {/* Drawer Header */}
              <div className="pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    ULPIN {selectedParcel.ulpin}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center space-x-1 ${
                    selectedParcel.status === 'Verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                    selectedParcel.status === 'Issue Found' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                    'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {selectedParcel.status === 'Verified' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {selectedParcel.status === 'Issue Found' && <AlertTriangle className="w-3.5 h-3.5" />}
                    {selectedParcel.status === 'Pending Clearance' && <Clock className="w-3.5 h-3.5" />}
                    <span>{selectedParcel.status}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-2">
                  Survey No. {selectedParcel.surveyNo}
                </h3>
                <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Village {selectedParcel.village}, {selectedParcel.taluka}, {selectedParcel.district}</span>
                </p>
              </div>

              {/* Quick Metadata Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Total Land Area</span>
                  <p className="text-sm font-bold text-white mt-0.5">{selectedParcel.areaSqM} m²</p>
                  <span className="text-[10px] text-slate-400">{selectedParcel.areaAcres} Acres</span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-slate-400 text-[10px] font-semibold uppercase">Land Use Zone</span>
                  <p className="text-sm font-bold text-cyan-300 mt-0.5 truncate">{selectedParcel.landUse.zone}</p>
                  <span className="text-[10px] text-slate-400">Max FSI: {selectedParcel.landUse.permissibleFSI}</span>
                </div>
              </div>

              {/* Ownership Card */}
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Registered Owner (RoR 7/12)</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">{selectedParcel.owner.khataNo}</span>
                </div>

                <div>
                  <p className="font-bold text-slate-200 text-sm">{selectedParcel.owner.name}</p>
                  <p className="text-slate-400 text-[11px]">S/o {selectedParcel.owner.fatherName}</p>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                  <span>Share: <strong className="text-white">{selectedParcel.owner.sharePercentage}%</strong></span>
                  <span>Aadhaar: <strong className="text-slate-300">{selectedParcel.owner.aadhaarMasked}</strong></span>
                </div>
              </div>

              {/* Status Domain Mini Badges */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Integrated Department Records</span>
                
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded-lg border border-slate-800">
                    <span className="text-slate-300">Title Deed & Stamp Duty</span>
                    <span className="font-semibold text-emerald-400">{selectedParcel.registration.status}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded-lg border border-slate-800">
                    <span className="text-slate-300">Encumbrance & Mortgage</span>
                    <span className={`font-semibold ${selectedParcel.encumbrance.status === 'Clear' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selectedParcel.encumbrance.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-slate-800/40 rounded-lg border border-slate-800">
                    <span className="text-slate-300">Municipal Property Tax</span>
                    <span className={`font-semibold ${selectedParcel.tax.status === 'Paid' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {selectedParcel.tax.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => navigateToParcel(selectedParcel.ulpin, 'parcel-details')}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl text-xs shadow-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Complete 8-Domain Parcel Details</span>
                </button>

                <button
                  onClick={() => navigateToParcel(selectedParcel.ulpin, 'verify')}
                  className="w-full py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Run "Verify Before You Buy" Audit</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Select a parcel polygon on the map to inspect details.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
