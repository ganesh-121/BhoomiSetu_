import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { ServiceRequest } from '../types';
import { 
  User, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Eye,
  Send,
  X
} from 'lucide-react';

export const CitizenDashboard: React.FC = () => {
  const { navigateToParcel } = useRole();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State for New Service Request
  const [formData, setFormData] = useState({
    ulpin: 'IN-MH-411001-P1001',
    applicantName: 'Rajesh Vasantrao Patil',
    applicantPhone: '+91 98230 49102',
    requestType: 'Ownership Mutation Record Request',
    department: 'Land Records Department',
    description: ''
  });

  const fetchRequests = () => {
    fetch('/api/service-requests')
      .then(res => res.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching requests:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/service-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setShowModal(false);
        fetchRequests();
        setFormData({
          ulpin: 'IN-MH-411001-P1001',
          applicantName: 'Rajesh Vasantrao Patil',
          applicantPhone: '+91 98230 49102',
          requestType: 'Ownership Mutation Record Request',
          department: 'Land Records Department',
          description: ''
        });
      });
  };

  const savedParcels = [
    { ulpin: 'IN-MH-411001-P1001', surveyNo: '142/A/1', village: 'Baner', status: 'Verified', area: '1250 m²' },
    { ulpin: 'IN-MH-411001-P1003', surveyNo: '204/1', village: 'Wakad', status: 'Verified', area: '850 m²' },
  ];

  return (
    <div className="space-y-8 pb-20">
      
      {/* Citizen Welcome Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
              CITIZEN PORTAL WORKSPACE
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white mt-2">
            Welcome, Rajesh Vasantrao Patil
          </h1>
          <p className="text-xs text-slate-400">
            Manage your land parcels, track digital service requests, and view property verification reports.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-900/30 flex items-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Service Request</span>
        </button>
      </div>

      {/* Grid: Saved Parcels & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Saved Parcels List */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Saved Land Parcels</span>
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{savedParcels.length} Parcels</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {savedParcels.map(p => (
              <div key={p.ulpin} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 space-y-2 hover:border-cyan-500/40 transition-all">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-cyan-400">{p.ulpin}</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold text-[10px]">
                    {p.status}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Survey No. {p.surveyNo}</p>
                  <p className="text-slate-400">Village {p.village} ({p.area})</p>
                </div>
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => navigateToParcel(p.ulpin, 'parcel-details')}
                    className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold text-[11px] flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                  <button
                    onClick={() => navigateToParcel(p.ulpin, 'verify')}
                    className="flex-1 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded-lg font-semibold text-[11px] border border-emerald-500/30 flex items-center justify-center space-x-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800">
            Citizen Activity Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <span className="text-slate-400">Active Service Requests:</span>
              <strong className="text-cyan-400 text-sm">{requests.filter(r => r.status !== 'Completed').length}</strong>
            </div>
            <div className="flex justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <span className="text-slate-400">Completed Service Certificates:</span>
              <strong className="text-emerald-400 text-sm">{requests.filter(r => r.status === 'Completed').length}</strong>
            </div>
            <div className="flex justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <span className="text-slate-400">Saved Verification Audits:</span>
              <strong className="text-purple-400 text-sm">4</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Service Request Tracking Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Submitted Citizen Service Requests</h3>
            <p className="text-xs text-slate-400">Track application status and officer remarks in real-time.</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded">
            {requests.length} Requests Total
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs">Loading requests...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Request ID</th>
                  <th className="p-3">ULPIN</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Officer Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-mono font-bold text-cyan-400">{req.id}</td>
                    <td className="p-3 font-mono text-slate-300">{req.ulpin}</td>
                    <td className="p-3 font-bold text-white">{req.requestType}</td>
                    <td className="p-3 text-slate-400">{req.department}</td>
                    <td className="p-3 text-slate-400">{req.submittedDate}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center space-x-1 w-fit ${
                        req.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                        req.status === 'Under Review' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-sky-500/20 text-sky-400'
                      }`}>
                        {req.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {req.status === 'Under Review' && <Clock className="w-3 h-3" />}
                        <span>{req.status}</span>
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 max-w-xs truncate">{req.officerRemarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Send className="w-5 h-5 text-cyan-400" />
              <span>Submit Land Service Application</span>
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Parcel ULPIN</label>
                <input
                  type="text"
                  value={formData.ulpin}
                  onChange={(e) => setFormData({ ...formData, ulpin: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Applicant Name</label>
                <input
                  type="text"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Service Request Type</label>
                <select
                  value={formData.requestType}
                  onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  <option>Ownership Mutation Record Request</option>
                  <option>Certified Title Deed Record Copy</option>
                  <option>Property Tax Dues Re-assessment</option>
                  <option>Zoning Buffer & Encroachment Clarification</option>
                  <option>Building Permission Sanction Copy</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                >
                  <option>Land Records Department</option>
                  <option>Sub-Registrar Office</option>
                  <option>Property Tax Department</option>
                  <option>Municipality / Urban Planning</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Detailed Remarks / Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                  placeholder="Provide context or document numbers..."
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
