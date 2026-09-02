import React, { useEffect, useState } from 'react';
import { useRole } from '../context/RoleContext';
import { VerificationReport } from '../types';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Printer, 
  QrCode, 
  FileText, 
  Info,
  ArrowRight,
  Sparkles,
  Download,
  AlertCircle
} from 'lucide-react';

export const PropertyVerification: React.FC = () => {
  const { selectedUlpin, navigateToParcel } = useRole();
  const [inputUlpin, setInputUlpin] = useState(selectedUlpin || 'IN-MH-411001-P1001');
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runVerification = (ulpinToVerify: string) => {
    if (!ulpinToVerify.trim()) return;
    setLoading(true);
    setError(null);

    fetch('/api/verification/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ulpin: ulpinToVerify.trim() }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Could not perform verification for ULPIN: " + ulpinToVerify);
        return res.json();
      })
      .then(data => {
        setReport(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedUlpin) {
      setInputUlpin(selectedUlpin);
      runVerification(selectedUlpin);
    }
  }, [selectedUlpin]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runVerification(inputUlpin);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Search Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-extrabold text-white">
              "Verify Before You Buy" Due Diligence Engine
            </h2>
            <p className="text-xs text-slate-400">
              Automated 7-point audit check retrieving live records across Land Records, Sub-Registrar, Municipal Tax, and Zoning APIs.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl pt-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter ULPIN (e.g. IN-MH-411001-P1001)..."
              value={inputUlpin}
              onChange={(e) => setInputUlpin(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center space-x-2 transition-all"
          >
            {loading ? <span>Analyzing...</span> : <><span>Verify Now</span> <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Quick Sample Selector */}
        <div className="flex items-center space-x-2 text-xs pt-1">
          <span className="text-slate-400">Test Scenarios:</span>
          <button
            onClick={() => { setInputUlpin('IN-MH-411001-P1001'); runVerification('IN-MH-411001-P1001'); }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-mono border border-slate-700"
          >
            P1001 (Clear Title)
          </button>
          <button
            onClick={() => { setInputUlpin('IN-MH-411001-P1002'); runVerification('IN-MH-411001-P1002'); }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg font-mono border border-slate-700"
          >
            P1002 (Dispute & Lien)
          </button>
          <button
            onClick={() => { setInputUlpin('IN-MH-411001-P1004'); runVerification('IN-MH-411001-P1004'); }}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg font-mono border border-slate-700"
          >
            P1004 (Pending MIDC)
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Verification Report Card */}
      {report && (
        <div className="space-y-6">
          
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Verification Audit Results</span>
            </h3>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center space-x-2 transition-all"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Print Official Certificate</span>
            </button>
          </div>

          {/* Printable Container Target */}
          <div id="printable-certificate" className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
            
            {/* Certificate Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800 gap-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  REPORT ID: {report.reportId}
                </span>
                <h2 className="text-2xl font-display font-extrabold text-white mt-2">
                  Official Land Parcel Verification Certificate
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Generated on {new Date(report.generatedAt).toLocaleString('en-IN')} via BhoomiSetu ULPIN Gateway
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold border ${
                  report.overallStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                  report.overallStatus === 'Issue Found' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                  'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  {report.overallStatus === 'Verified' && <CheckCircle2 className="w-5 h-5" />}
                  {report.overallStatus === 'Issue Found' && <AlertTriangle className="w-5 h-5" />}
                  {report.overallStatus === 'Pending Clearance' && <Clock className="w-5 h-5" />}
                  <span>{report.overallStatus}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-semibold mt-1">Risk Grade: {report.riskScore}</p>
              </div>
            </div>

            {/* Target Parcel Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">ULPIN</span>
                <p className="font-mono font-bold text-cyan-400 text-sm mt-0.5">{report.ulpin}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Survey No.</span>
                <p className="font-bold text-white text-sm mt-0.5">{report.surveyNo}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Location</span>
                <p className="font-bold text-white text-sm mt-0.5">{report.village}, {report.district}</p>
              </div>
              <div>
                <span className="text-slate-400 font-semibold text-[10px] uppercase">Registered Owner</span>
                <p className="font-bold text-slate-200 text-sm mt-0.5">{report.ownerName}</p>
              </div>
            </div>

            {/* 7-Point Audit Checklist */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                7-Domain Due Diligence Audit Checks
              </h4>

              <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden text-xs">
                {report.checks.map((check, idx) => (
                  <div key={check.id} className="p-4 bg-slate-800/20 hover:bg-slate-800/40 flex items-start justify-between gap-4 transition-colors">
                    <div className="flex items-start space-x-3">
                      <span className="font-bold text-slate-500 text-xs mt-0.5">#{idx + 1}</span>
                      <div>
                        <p className="font-bold text-white text-sm">{check.name}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{check.details}</p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-1 ${
                      check.status === 'Verified' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                      check.status === 'Issue Found' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                      'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {check.status === 'Verified' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {check.status === 'Issue Found' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {check.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      <span>{check.status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Verification & Legal Disclaimer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              
              <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 max-w-xs">
                <QrCode className="w-10 h-10 text-cyan-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-slate-200 text-[11px]">Digital Seal Verification</p>
                  <p className="text-[10px] text-slate-400">Scan QR to verify certificate authenticity against state land stack node.</p>
                </div>
              </div>

              <div className="flex-1 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-amber-200 text-[11px] leading-relaxed">
                <strong className="block font-bold mb-0.5 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-amber-400" />
                  <span>Statutory Legal Disclaimer:</span>
                </strong>
                {report.legalDisclaimer}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
