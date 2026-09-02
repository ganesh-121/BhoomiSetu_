import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { ServiceRequest } from '../types';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Search, 
  Filter, 
  Edit3, 
  ShieldAlert, 
  UserCheck, 
  RefreshCw,
  X
} from 'lucide-react';

export const OfficerDashboard: React.FC = () => {
  const { navigateToParcel } = useRole();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [newStatus, setNewStatus] = useState<string>('Approved');
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    fetch('/api/service-requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading officer queue:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    fetch(`/api/service-requests/${selectedRequest.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        officerRemarks
      })
    })
      .then(res => res.json())
      .then(() => {
        setSelectedRequest(null);
        fetchRequests();
      });
  };

  const conflicts = [
    {
      ulpin: 'IN-MH-411001-P1002',
      surveyNo: '88/2/B (Aundh)',
      conflictType: 'RoR Khatedar vs Sub-Registrar Deed Mismatch',
      details: 'Sub-Registrar recorded Gift Deed to Sunita Deshmukh, but RoR 7/12 retains 40% joint share of Milind Deshmukh without court NOC.',
      severity: 'High'
    },
    {
      ulpin: 'IN-MH-411001-P1007',
      surveyNo: '77/1 (Hadapsar)',
      conflictType: 'Unresolved Partition Dispute & Court Stay',
      details: 'Pending Civil Suit (PUN-DIST-COURT-2022-0941). Court injunction prohibits mutation.',
      severity: 'Critical'
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      
      {/* Officer Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
              GOVERNMENT OFFICER DESK WORKSPACE
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white mt-2">
            Land Revenue & Mutation Officer Portal
          </h1>
          <p className="text-xs text-slate-400">
            Jurisdiction: Haveli & Mulshi Circles, District Pune, Maharashtra.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-2 border border-slate-700"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Total Jurisdiction Parcels</span>
          <p className="text-2xl font-bold text-white mt-1">25</p>
          <span className="text-[10px] text-emerald-400">Haveli / Mulshi Clusters</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Pending Applications</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {requests.filter(r => r.status === 'Submitted' || r.status === 'Under Review').length}
          </p>
          <span className="text-[10px] text-amber-300">Requires Officer Action</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Data Conflicts Flagged</span>
          <p className="text-2xl font-bold text-rose-400 mt-1">{conflicts.length}</p>
          <span className="text-[10px] text-rose-300">Sub-Registrar vs RoR</span>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl">
          <span className="text-slate-400 font-semibold uppercase text-[10px]">Completed Cases Today</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {requests.filter(r => r.status === 'Completed').length}
          </p>
          <span className="text-[10px] text-slate-400">Certificates Issued</span>
        </div>
      </div>

      {/* Data Conflict Resolution Panel */}
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-rose-500/10 rounded-xl text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Inter-Departmental Data Conflict Panel</h3>
            <p className="text-xs text-rose-300">ULPIN cross-checks detecting discrepancies between Sub-Registrar deeds and RoR 7/12 records.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {conflicts.map(c => (
            <div key={c.ulpin} className="bg-slate-800/60 p-4 rounded-xl border border-rose-500/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-cyan-400">{c.ulpin}</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px]">
                  {c.severity} Severity
                </span>
              </div>
              <p className="font-bold text-white">{c.surveyNo}</p>
              <p className="text-amber-300 font-semibold">{c.conflictType}</p>
              <p className="text-slate-400 leading-relaxed text-[11px]">{c.details}</p>
              
              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={() => navigateToParcel(c.ulpin, 'parcel-details')}
                  className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold"
                >
                  Inspect Parcel
                </button>
                <button
                  onClick={() => alert(`Field notice issued to Sub-Registrar & Owner for ULPIN ${c.ulpin}`)}
                  className="flex-1 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-lg font-semibold"
                >
                  Issue Notice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Request Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Officer Work Queue (Citizen Service Requests)</h3>
            <p className="text-xs text-slate-400">Review applications, perform field verification, and approve digital records.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Req ID</th>
                <th className="p-3">ULPIN</th>
                <th className="p-3">Applicant Name</th>
                <th className="p-3">Request Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Officer Remarks</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {requests.map(req => (
                <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-mono font-bold text-cyan-400">{req.id}</td>
                  <td className="p-3 font-mono text-slate-300">{req.ulpin}</td>
                  <td className="p-3 font-semibold text-white">{req.applicantName}</td>
                  <td className="p-3 text-slate-300">{req.requestType}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      req.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      req.status === 'Under Review' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-sky-500/20 text-sky-400'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 max-w-xs truncate">{req.officerRemarks}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        setNewStatus(req.status);
                        setOfficerRemarks(req.officerRemarks);
                      }}
                      className="px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-lg font-semibold flex items-center space-x-1 ml-auto"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Process</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Processing Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Process Request: {selectedRequest.id}</span>
            </h3>

            <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <p><strong className="text-slate-400">Target ULPIN:</strong> <span className="font-mono text-cyan-400">{selectedRequest.ulpin}</span></p>
              <p><strong className="text-slate-400">Applicant:</strong> {selectedRequest.applicantName} ({selectedRequest.applicantPhone})</p>
              <p><strong className="text-slate-400">Type:</strong> {selectedRequest.requestType}</p>
              <p><strong className="text-slate-400">Details:</strong> {selectedRequest.description}</p>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Update Status Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-semibold"
                >
                  <option value="Submitted">Submitted (Queued)</option>
                  <option value="Under Review">Under Review (Field Inspection)</option>
                  <option value="Approved">Approved</option>
                  <option value="Completed">Completed (Digital Certificate Issued)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Official Officer Remarks</label>
                <textarea
                  rows={3}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                  placeholder="Enter verification notes or approval conditions..."
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Save & Update Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
