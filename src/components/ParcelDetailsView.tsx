import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { Parcel } from '../types';
import { 
  FileText, 
  ShieldCheck, 
  User, 
  Landmark, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Layers, 
  Compass, 
  Zap, 
  Droplet, 
  ArrowLeft,
  DollarSign,
  AlertCircle,
  FileCheck,
  Scale
} from 'lucide-react';

export const ParcelDetailsView: React.FC = () => {
  const { selectedUlpin, setActiveView, navigateToParcel } = useRole();
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'ror' | 'registration' | 'encumbrance' | 'tax' | 'zoning' | 'building' | 'utilities'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedUlpin) return;
    setLoading(true);
    setError(null);

    fetch(`/api/parcels/${selectedUlpin}`)
      .then(res => {
        if (!res.ok) throw new Error("Parcel not found with ULPIN: " + selectedUlpin);
        return res.json();
      })
      .then(data => {
        setParcel(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [selectedUlpin]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        Loading ULPIN integrated departmental datasets...
      </div>
    );
  }

  if (error || !parcel) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Parcel Not Found</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">{error || "Requested ULPIN record could not be retrieved."}</p>
        <button
          onClick={() => setActiveView('map')}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold"
        >
          Return to GIS Map
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'ror', label: 'RoR 7/12 & Owner', icon: <User className="w-4 h-4" /> },
    { id: 'registration', label: 'Title Deeds', icon: <FileCheck className="w-4 h-4" /> },
    { id: 'encumbrance', label: 'Encumbrance & Loans', icon: <Scale className="w-4 h-4" /> },
    { id: 'tax', label: 'Property Tax', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'zoning', label: 'Land Use Zoning', icon: <Compass className="w-4 h-4" /> },
    { id: 'building', label: 'Building Approvals', icon: <Building2 className="w-4 h-4" /> },
    { id: 'utilities', label: 'Utilities & Buffer', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <button
              onClick={() => setActiveView('map')}
              className="text-xs text-cyan-400 hover:underline flex items-center space-x-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to GIS Map</span>
            </button>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/20">
                ULPIN: {parcel.ulpin}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold flex items-center space-x-1 ${
                parcel.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                parcel.status === 'Issue Found' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {parcel.status === 'Verified' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {parcel.status === 'Issue Found' && <AlertTriangle className="w-3.5 h-3.5" />}
                {parcel.status === 'Pending Clearance' && <Clock className="w-3.5 h-3.5" />}
                <span>{parcel.status}</span>
              </span>
            </div>

            <h1 className="text-2xl font-display font-extrabold text-white mt-1">
              Survey No. {parcel.surveyNo} — Village {parcel.village}
            </h1>
            <p className="text-xs text-slate-400">
              {parcel.taluka} Taluka, {parcel.district} District, {parcel.state} (PIN: {parcel.pincode})
            </p>
          </div>

          {/* Quick Verification CTA */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateToParcel(parcel.ulpin, 'verify')}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center space-x-2 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Run "Verify Before You Buy" Audit</span>
            </button>
          </div>

        </div>

        {/* Tab Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center space-x-1 overflow-x-auto text-xs scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Cadastral Parcel Metadata</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Unique Parcel ID (ULPIN)</span>
                <p className="text-base font-bold text-cyan-400 font-mono mt-1">{parcel.ulpin}</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Survey / Khasra No</span>
                <p className="text-base font-bold text-white mt-1">{parcel.surveyNo}</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Land Area</span>
                <p className="text-base font-bold text-white mt-1">{parcel.areaSqM} Sq. Meters</p>
                <span className="text-[11px] text-slate-400">({parcel.areaAcres} Acres)</span>
              </div>
            </div>

            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
              <span className="font-bold text-white">Geospatial Center Point & Polygon Geometry</span>
              <p className="text-slate-400 font-mono text-[11px]">
                Center Coordinates: Latitude {parcel.center[0]}, Longitude {parcel.center[1]}
              </p>
              <p className="text-slate-400 font-mono text-[11px]">
                Vertex Count: {parcel.coordinates.length} points (GeoJSON WGS-84 Polygon)
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: RoR 7/12 */}
        {activeTab === 'ror' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Record of Rights (7/12 & 8A Records)</h3>
              <span className="text-xs bg-slate-800 text-cyan-400 px-2.5 py-1 rounded-md font-mono">Khata: {parcel.owner.khataNo}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <span className="font-bold text-cyan-300 uppercase text-[10px]">Primary Khatedar (Owner)</span>
                <div>
                  <p className="text-sm font-bold text-white">{parcel.owner.name}</p>
                  <p className="text-slate-400 text-xs">Father / Husband: {parcel.owner.fatherName}</p>
                </div>
                <p className="text-slate-300 text-xs">Address: {parcel.owner.address}</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <span className="font-bold text-cyan-300 uppercase text-[10px]">Ownership Share & KYC Details</span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ownership Share:</span>
                  <strong className="text-white">{parcel.owner.sharePercentage}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Aadhaar (Masked):</span>
                  <strong className="text-slate-200 font-mono">{parcel.owner.aadhaarMasked}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PAN Card (Masked):</span>
                  <strong className="text-slate-200 font-mono">{parcel.owner.panMasked}</strong>
                </div>
              </div>
            </div>

            {parcel.owner.jointOwners.length > 0 && (
              <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-amber-300">Co-Owners / Joint Khatedars:</span>
                <ul className="list-disc list-inside mt-2 text-slate-300">
                  {parcel.owner.jointOwners.map((jo, i) => (
                    <li key={i}>{jo}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Registration */}
        {activeTab === 'registration' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Sub-Registrar Title Deeds</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Deed Registration No:</span>
                  <strong className="text-cyan-400 font-mono">{parcel.registration.deedNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Deed Type:</span>
                  <strong className="text-white">{parcel.registration.deedType}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Date:</span>
                  <strong className="text-slate-200">{parcel.registration.registrationDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sub-Registrar Office:</span>
                  <strong className="text-slate-200">{parcel.registration.subRegistrarOffice}</strong>
                </div>
              </div>

              <div className="space-y-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Declared Property Consideration:</span>
                  <strong className="text-emerald-400 text-sm">₹{parcel.registration.declaredValueINR.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stamp Duty & Registration Fee Paid:</span>
                  <strong className="text-emerald-400">₹{parcel.registration.stampDutyPaidINR.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration Status:</span>
                  <strong className="text-cyan-300">{parcel.registration.status}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Encumbrance */}
        {activeTab === 'encumbrance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Encumbrance, Bank Lien & Mortgage Status</h3>

            <div className={`p-4 rounded-xl border text-xs space-y-3 ${
              parcel.encumbrance.status === 'Clear'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-sm">
                {parcel.encumbrance.status === 'Clear' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-rose-400" />}
                <span>Encumbrance Status: {parcel.encumbrance.status}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 text-slate-200">
                <div>
                  <span className="text-slate-400">Active Mortgage / Bank Lien:</span>
                  <p className="font-bold text-white">{parcel.encumbrance.mortgageActive ? 'YES (Active Lien Registered)' : 'NO (Unencumbered)'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Mortgage Institution:</span>
                  <p className="font-bold text-white">{parcel.encumbrance.bankName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Mortgage Loan Amount:</span>
                  <p className="font-bold text-white">₹{parcel.encumbrance.mortgageAmountINR.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <span className="text-slate-400">Pending Court Litigation:</span>
                  <p className="font-bold text-white">{parcel.encumbrance.pendingLitigation ? `YES (Case: ${parcel.encumbrance.courtCaseNo})` : 'NO'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Tax */}
        {activeTab === 'tax' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Municipal Property Tax Records</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assessment No:</span>
                  <strong className="text-cyan-400 font-mono">{parcel.tax.assessmentNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Annual Tax Demand:</span>
                  <strong className="text-white">₹{parcel.tax.annualTaxINR.toLocaleString('en-IN')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Outstanding Tax Dues:</span>
                  <strong className={parcel.tax.duesRemainingINR > 0 ? "text-rose-400 text-sm font-bold" : "text-emerald-400"}>
                    ₹{parcel.tax.duesRemainingINR.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <strong className={parcel.tax.status === 'Paid' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {parcel.tax.status}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Payment Date:</span>
                  <strong className="text-slate-200">{parcel.tax.lastPaymentDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Receipt No:</span>
                  <strong className="text-slate-200 font-mono">{parcel.tax.receiptNo}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Zoning */}
        {activeTab === 'zoning' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Master Plan Land Use & Zoning</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Master Plan Zone Classification</span>
                <p className="text-base font-bold text-cyan-300">{parcel.landUse.zone}</p>
                <p className="text-slate-400">Master Plan Framework: {parcel.landUse.masterPlan}</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Floor Space Index (FSI / FAR)</span>
                <p className="text-base font-bold text-emerald-400">{parcel.landUse.permissibleFSI} Max FSI</p>
                <p className="text-slate-400">Category: {parcel.landUse.category}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Building */}
        {activeTab === 'building' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Building Permission & Construction Sanctions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Permission No:</span>
                  <strong className="text-cyan-400 font-mono">{parcel.buildingPermission.permissionNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sanction Status:</span>
                  <strong className={parcel.buildingPermission.status === 'Approved' ? 'text-emerald-400' : 'text-rose-400'}>
                    {parcel.buildingPermission.status}
                  </strong>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Sanctioned Floors:</span>
                  <strong className="text-white">{parcel.buildingPermission.sanctionedFloors}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Completion Certificate Issued:</span>
                  <strong className="text-slate-200">{parcel.buildingPermission.completionCertificateIssued ? 'YES (Occupancy Certificate Active)' : 'NO / In Progress'}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Utilities */}
        {activeTab === 'utilities' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Utilities Infrastructure & Environmental Restrictions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <span className="font-bold text-cyan-400 uppercase text-[10px]">Environmental & Statutory Restrictions</span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coastal Regulation Zone (CRZ):</span>
                  <strong className="text-white">{parcel.restrictions.crzZone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">National Highway Buffer:</span>
                  <strong className="text-white">{parcel.restrictions.highwayBufferMeters} Meters</strong>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-400">Restriction Status:</span>
                  <span className="text-cyan-300">{parcel.restrictions.status}</span>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <span className="font-bold text-cyan-400 uppercase text-[10px]">Utility Grid Connections</span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Water Pipeline ID:</span>
                  <strong className="text-slate-200 font-mono">{parcel.utilities.waterConnectionId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Power Grid Consumer No:</span>
                  <strong className="text-slate-200 font-mono">{parcel.utilities.powerConsumerNo}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Access Road Width:</span>
                  <strong className="text-emerald-400">{parcel.utilities.roadWidthMeters} Meters</strong>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
