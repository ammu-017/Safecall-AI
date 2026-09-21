import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  Radio,
  PhoneCall,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Info,
  CheckCircle,
  FileText,
  Activity,
  PhoneOff,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, currentGuardians, calls, contacts, settings, updateSettings, enterDemoMode } = useApp();
  const navigate = useNavigate();
  const [isTogglingShield, setIsTogglingShield] = useState(false);

  const safeCount = calls.filter((c) => c.riskLevel === 'safe').length;
  const suspiciousCount = calls.filter((c) => c.riskLevel === 'moderate' || c.riskLevel === 'high' || c.riskLevel === 'critical').length;
  const criticalThreats = calls.filter((c) => c.riskLevel === 'critical');

  const riskData = [
    { name: 'Safe Calls', value: safeCount || 1, color: '#10B981' },
    { name: 'Suspicious / Threats', value: suspiciousCount || 0, color: '#EF4444' },
  ];

  const primaryGuardian = currentGuardians?.[0] || (contacts[0] ? {
    name: contacts[0].name,
    relationship: contacts[0].relationship,
    phoneNumber: contacts[0].phoneNumber,
    alertStatus: 'Active Standing Guard' as const,
  } : null);

  const handleToggleShield = async () => {
    setIsTogglingShield(true);
    await updateSettings({ monitoringEnabled: !settings.monitoringEnabled });
    setIsTogglingShield(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* USER & GUARDIAN STATUS BANNER */}
      <div
        id="dashboard-user-guardian-banner"
        className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-black text-base flex items-center justify-center shadow-xs">
            {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2) : 'SC'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Welcome, {user?.name || 'Alekya Chintapalli'}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active Protected
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center space-x-2 mt-0.5">
              <span>{user?.email || 'chintapallialekya77@gmail.com'}</span>
              <span>•</span>
              <span className="font-mono">{user?.phone || '+1 (555) 749-3011'}</span>
            </div>
          </div>
        </div>

        {/* Guardian Status Pill */}
        {primaryGuardian && (
          <div className="flex items-center space-x-3 bg-blue-50/70 border border-blue-200/80 rounded-xl px-4 py-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-blue-900 flex items-center space-x-1.5">
                <span>Guardian: {primaryGuardian.name}</span>
                <span className="text-[10px] text-blue-700 font-normal">({primaryGuardian.relationship})</span>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center space-x-2">
                <span className="font-mono">{primaryGuardian.phoneNumber}</span>
                <span className="text-emerald-700 font-semibold">• Standing Guard</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DEMO / SAMPLE DATA DISCLAIMER BANNER */}

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center space-x-2.5">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Evaluation Workspace:</strong> Currently displaying realistic sample calls and live simulation scenarios. Browser-based testing does not access cellular calls.
          </span>
        </div>
        <button
          onClick={() => navigate('/how-it-works')}
          className="font-bold text-amber-800 hover:text-amber-950 underline shrink-0"
        >
          View System Architecture →
        </button>
      </div>

      {/* HERO CALL MONITORING BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background graphic */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Real-Time Voice Surveillance Ready</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Start Live Call Protection & Scam Analysis
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Launch live stream monitoring to test scam scenarios—including fake bank KYC, digital-arrest threats, and OTP interception—or evaluate legitimate hospital verification calls.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="dash-start-monitoring-cta"
                onClick={() => navigate('/live-monitor')}
                className="py-3.5 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center space-x-2.5 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
              >
                <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
                <span>Open Live Call Monitor</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/call-history')}
                className="py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors"
              >
                View Forensic Call Logs ({calls.length})
              </button>
            </div>
          </div>

          {/* Quick status card on the right */}
          <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Defense Shield Status
              </span>
              <button
                onClick={handleToggleShield}
                disabled={isTogglingShield}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  settings.monitoringEnabled
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {settings.monitoringEnabled ? 'ENABLED' : 'PAUSED'}
              </button>
            </div>

            <div className="text-lg font-bold flex items-center space-x-2">
              {settings.monitoringEnabled ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="text-emerald-300">Active Protection</span>
                </>
              ) : (
                <>
                  <PhoneOff className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-300">Monitoring Paused</span>
                </>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Family members will be alerted automatically when a caller triggers high-risk conversational anomalies.
            </p>
          </div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Protection Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Protection Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {settings.monitoringEnabled ? 'Active (24/7)' : 'Paused'}
          </div>
          <p className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Anti-Social Engineering Guard</span>
          </p>
        </div>

        {/* Card 2: Calls Analyzed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Calls Analyzed</span>
            <PhoneCall className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {calls.length} <span className="text-xs text-slate-400 font-normal">Records</span>
          </div>
          <p className="text-xs text-slate-500">
            {safeCount} classified safe • {suspiciousCount} flagged
          </p>
        </div>

        {/* Card 3: Suspicious Calls Detected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Scams Intercepted</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">
            {suspiciousCount}
          </div>
          <p className="text-xs text-red-700 font-medium">
            100% neutralized without loss
          </p>
        </div>

        {/* Card 4: Trusted Family Contacts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Family Network</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {contacts.length} <span className="text-xs text-slate-400 font-normal">Active</span>
          </div>
          <p className="text-xs text-teal-700 font-medium">
            Rohan & Dr. Desai standing by
          </p>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Call Activity List & Quick Actions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Actions Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick Safety Operations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => navigate('/live-monitor')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center space-x-3"
              >
                <Radio className="w-5 h-5 text-teal-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Analyze Test Call</div>
                  <div className="text-[11px] text-slate-500">Run 5 preset scams</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/trusted-contacts')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center space-x-3"
              >
                <Users className="w-5 h-5 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Trusted Contacts</div>
                  <div className="text-[11px] text-slate-500">Manage family alerts</div>
                </div>
              </button>

              <button
                onClick={() => navigate('/call-history')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors flex items-center space-x-3"
              >
                <FileText className="w-5 h-5 text-purple-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Forensic Reports</div>
                  <div className="text-[11px] text-slate-500">Inspect transcripts</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Call Activity Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Call Activity</h3>
                <p className="text-xs text-slate-500">Analyzed conversations with risk scores</p>
              </div>
              <button
                onClick={() => navigate('/call-history')}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {calls.slice(0, 4).map((call) => {
                const isHighRisk = call.riskLevel === 'high' || call.riskLevel === 'critical';
                return (
                  <div
                    key={call.id}
                    onClick={() => navigate(`/call-details/${call.id}`)}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isHighRisk
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        }`}
                      >
                        {isHighRisk ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                          <span>{call.callerName || call.callerNumber}</span>
                          {call.isDemo && (
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                              Demo
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-3">
                          <span>{call.date}</span>
                          <span>•</span>
                          <span>{call.duration}</span>
                          <span>•</span>
                          <span className="font-mono">{call.callerNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 sm:self-center">
                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isHighRisk
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {call.riskLevel} • {call.riskScore}/100
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Risk Distribution Chart & Live Threat Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Breakdown Chart */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Threat Distribution</span>
              <span className="text-xs font-normal text-slate-400">Past 30 Days</span>
            </h3>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span>Legitimate Calls</span>
                </span>
                <span className="font-bold text-slate-900">{safeCount} calls</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <span>Neutralized Scam Calls</span>
                </span>
                <span className="font-bold text-red-600">{suspiciousCount} threats</span>
              </div>
            </div>
          </div>

          {/* Recent Security Alerts list */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Recent Threats Intercepted</h3>
              <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                Protected
              </span>
            </div>

            <div className="space-y-3">
              {criticalThreats.length > 0 ? (
                criticalThreats.slice(0, 2).map((threat) => (
                  <div
                    key={threat.id}
                    onClick={() => navigate(`/call-details/${threat.id}`)}
                    className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 cursor-pointer hover:bg-red-50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-900">{threat.callerName}</span>
                      <span className="text-[10px] font-mono text-red-700 bg-red-200/60 px-1.5 py-0.5 rounded">
                        Score: {threat.riskScore}
                      </span>
                    </div>
                    <p className="text-[11px] text-red-800 leading-tight">
                      {threat.summary.slice(0, 85)}...
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No critical threats active.
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/analytics')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Open Full Security Analytics →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
