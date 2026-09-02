import React, { useEffect, useState } from 'react';
import { DepartmentIntegration, AuditLog } from '../types';
import { 
  Sliders, 
  Activity, 
  RefreshCw, 
  ShieldCheck, 
  Database, 
  Lock, 
  Server, 
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [integrations, setIntegrations] = useState<DepartmentIntegration[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = () => {
    Promise.all([
      fetch('/api/admin/integrations').then(res => res.json()),
      fetch('/api/admin/audit-logs').then(res => res.json())
    ])
      .then(([intData, logData]) => {
        setIntegrations(intData.activeIntegrations || []);
        setAuditLogs(logData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load admin telemetry:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const triggerForceSync = () => {
    setSyncing(true);
    fetch('/api/admin/datasets/sync', { method: 'POST' })
      .then(res => res.json())
      .then(() => {
        setSyncing(false);
        fetchAdminData();
      });
  };

  const filteredLogs = roleFilter === 'All' 
    ? auditLogs 
    : auditLogs.filter(l => l.userRole === roleFilter);

  return (
    <div className="space-y-8 pb-20">
      
      {/* Admin Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
              SYSTEM ADMINISTRATOR CONTROL CENTER
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white mt-2">
            ULPIN API Gateway & Telemetry Manager
          </h1>
          <p className="text-xs text-slate-400">
            Monitor state departmental API integrations, trigger dataset synchronization, and inspect immutable audit logs.
          </p>
        </div>

        <button
          onClick={triggerForceSync}
          disabled={syncing}
          className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-rose-900/30 flex items-center space-x-2 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Synchronizing APIs...' : 'Force Inter-Departmental Re-Sync'}</span>
        </button>
      </div>

      {/* 6 Department API Integration Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <span>State Department API Gateways (6 Active Nodes)</span>
          </h3>
          <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded">
            Overall Gateway Health: 99.4%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrations.map((dept, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3 hover:border-cyan-500/40 transition-all">
              <div className="flex justify-between items-start">
                <span className="font-bold text-white text-xs">{dept.name}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{dept.status}</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-300">
                <div className="bg-slate-800/50 p-2 rounded-lg">
                  <span className="text-slate-400 text-[9px] block uppercase">Avg Latency</span>
                  <strong className="text-cyan-400 font-mono">{dept.latency}</strong>
                </div>
                <div className="bg-slate-800/50 p-2 rounded-lg">
                  <span className="text-slate-400 text-[9px] block uppercase">Success Rate</span>
                  <strong className="text-emerald-400 font-mono">{dept.syncSuccessRate}</strong>
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Protocol: <strong className="text-slate-300 font-mono">{dept.protocol}</strong></span>
                <span>Last Sync: <strong className="text-slate-300">{dept.lastSync}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log System Module */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              <span>Immutable System Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-400">Timestamped log entries recording all system interactions and access events.</p>
          </div>

          {/* Role Filter Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Filter by Role:</span>
            {['All', 'Citizen', 'Government Officer', 'Administrator'].map(roleOption => (
              <button
                key={roleOption}
                onClick={() => setRoleFilter(roleOption)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  roleFilter === roleOption
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {roleOption}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Actor Role</th>
                <th className="p-3">Action Description</th>
                <th className="p-3">Target Resource</th>
                <th className="p-3">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-bold text-slate-400">{log.id}</td>
                  <td className="p-3 text-slate-400">{log.timestamp}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-sans font-bold text-[10px] ${
                      log.userRole === 'Administrator' ? 'bg-rose-500/20 text-rose-400' :
                      log.userRole === 'Government Officer' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-3 font-sans font-bold text-white">{log.action}</td>
                  <td className="p-3 text-slate-300">{log.resource}</td>
                  <td className="p-3 font-sans">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
