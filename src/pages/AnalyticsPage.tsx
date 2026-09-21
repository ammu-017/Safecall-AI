import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  PieChart as PieIcon,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { calls } = useApp();

  // 1. Weekly activity data
  const weeklyData = [
    { day: 'Mon', safe: 3, suspicious: 1 },
    { day: 'Tue', safe: 4, suspicious: 0 },
    { day: 'Wed', safe: 2, suspicious: 2 },
    { day: 'Thu', safe: 5, suspicious: 1 },
    { day: 'Fri', safe: 6, suspicious: 0 },
    { day: 'Sat', safe: 4, suspicious: 1 },
    { day: 'Sun', safe: 3, suspicious: 0 },
  ];

  // 2. Scam Pattern Breakdown
  const scamPatternsData = [
    { name: 'Fake Bank KYC Fraud', count: 18, color: '#DC2626' },
    { name: 'Digital Arrest Threat', count: 14, color: '#EA580C' },
    { name: 'OTP & Password Theft', count: 11, color: '#E11D48' },
    { name: 'Tech Support Scam', count: 7, color: '#D97706' },
    { name: 'Lottery / Prize Scam', count: 4, color: '#8B5CF6' },
  ];

  // 3. Risk Distribution
  const riskCounts = {
    safe: calls.filter((c) => c.riskLevel === 'safe' || c.riskLevel === 'low').length,
    moderate: calls.filter((c) => c.riskLevel === 'moderate').length,
    high: calls.filter((c) => c.riskLevel === 'high').length,
    critical: calls.filter((c) => c.riskLevel === 'critical').length,
  };

  const riskPieData = [
    { name: 'Safe & Verified', value: Math.max(1, riskCounts.safe), color: '#10B981' },
    { name: 'Moderate Caution', value: Math.max(1, riskCounts.moderate), color: '#F59E0B' },
    { name: 'High Threat', value: Math.max(1, riskCounts.high), color: '#F97316' },
    { name: 'Critical Extortion', value: Math.max(1, riskCounts.critical), color: '#EF4444' },
  ];

  // 4. Time of Day Attack Distribution
  const hourlyData = [
    { hour: '9 AM', attacks: 1 },
    { hour: '11 AM', attacks: 4 },
    { hour: '1 PM', attacks: 7 },
    { hour: '3 PM', attacks: 8 },
    { hour: '5 PM', attacks: 5 },
    { hour: '7 PM', attacks: 2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Security & Threat Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated patterns, psychological manipulation trends, and protective defense metrics
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Last 30 Days Reporting Window</span>
        </div>
      </div>

      {/* METRIC OVERVIEW TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Analyzed</span>
          <div className="text-2xl font-black text-slate-900">42 Calls</div>
          <span className="text-xs text-emerald-600 font-semibold">100% evaluated</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Neutralized Attacks</span>
          <div className="text-2xl font-black text-red-600">14 Attempts</div>
          <span className="text-xs text-red-700 font-semibold">$0 financial loss</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Primary Modus Operandi</span>
          <div className="text-xl font-black text-slate-900 truncate">Fake Bank KYC</div>
          <span className="text-xs text-slate-500">33% of all threats</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Peak Threat Window</span>
          <div className="text-xl font-black text-slate-900">1:00 PM – 4:00 PM</div>
          <span className="text-xs text-slate-500">Afternoon pension hours</span>
        </div>
      </div>

      {/* ROW 1: WEEKLY CALLS & RISK PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Call Activity (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">Weekly Activity Volume</h3>
              <p className="text-xs text-slate-500">Safe calls vs intercepted suspicious calls</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
                <span className="text-slate-600">Safe</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span className="text-slate-600">Scam</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="safe" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="suspicious" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Risk Distribution</h3>
            <p className="text-xs text-slate-500">Classification of monitored conversations</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {riskPieData.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 2: SCAM PATTERNS BREAKDOWN & ATTACK TIME OF DAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Common Scam Patterns (7 cols) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Top Social Engineering Techniques Detected</h3>
            <p className="text-xs text-slate-500">Breakdown of predatory tactics deployed against elderly users</p>
          </div>

          <div className="space-y-3 pt-2">
            {scamPatternsData.map((pat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{pat.name}</span>
                  <span className="text-slate-500">{pat.count} incidents</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(pat.count / 20) * 100}%`,
                      backgroundColor: pat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time of Day Analysis (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Attack Timing Trend</h3>
            <p className="text-xs text-slate-500">Hourly vulnerability window</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="attacks"
                  stroke="#EA580C"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            Scammers overwhelmingly dial between 1:00 PM and 4:00 PM when seniors are often home alone and family caregivers are at work.
          </p>
        </div>
      </div>
    </div>
  );
};
