import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Trash2,
  Calendar,
  Clock,
  Radio,
  FileText,
  RotateCcw,
  Download,
} from 'lucide-react';
import { RiskLevel } from '../types';

export const CallHistoryPage: React.FC = () => {
  const { calls, deleteCall, resetAllDemoData, addToast } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'risk_desc' | 'risk_asc'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleExportAllCsv = () => {
    if (calls.length === 0) {
      addToast('No Calls to Export', 'There are no call records to export.', 'warning');
      return;
    }

    const headers = ['Call ID', 'Date', 'Caller Name', 'Caller Number', 'Duration', 'Risk Score', 'Risk Level', 'Summary', 'Signals Detected'];
    const rows = calls.map((c) => [
      `"${c.id}"`,
      `"${c.date}"`,
      `"${c.callerName || 'Unknown'}"`,
      `"${c.callerNumber}"`,
      `"${c.duration}"`,
      c.riskScore,
      `"${c.riskLevel.toUpperCase()}"`,
      `"${c.summary.replace(/"/g, '""')}"`,
      `"${c.manipulationSignals.map((s) => s.label).join('; ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SafeCall_Archive_Export_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    addToast('Call Archive Exported', `Exported ${calls.length} call records to CSV.`, 'success');
  };

  // Filtered and sorted calls
  const filteredCalls = useMemo(() => {
    let result = [...calls];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.callerName?.toLowerCase().includes(q) ||
          c.callerNumber.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q)
      );
    }

    // Risk category filter
    if (filterRisk === 'safe') {
      result = result.filter((c) => c.riskLevel === 'safe' || c.riskLevel === 'low');
    } else if (filterRisk === 'suspicious') {
      result = result.filter((c) => c.riskLevel === 'moderate');
    } else if (filterRisk === 'high_risk') {
      result = result.filter((c) => c.riskLevel === 'high' || c.riskLevel === 'critical');
    }

    // Sorting
    if (sortBy === 'risk_desc') {
      result.sort((a, b) => b.riskScore - a.riskScore);
    } else if (sortBy === 'risk_asc') {
      result.sort((a, b) => a.riskScore - b.riskScore);
    }

    return result;
  }, [calls, searchQuery, filterRisk, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCalls.length / itemsPerPage) || 1;
  const paginatedCalls = filteredCalls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Call Analysis History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete archive of conversations evaluated for manipulation & extortion
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="export-all-calls-btn"
            onClick={handleExportAllCsv}
            className="py-2.5 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
            title="Export full log as CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => navigate('/live-monitor')}
            className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-xs"
          >
            <Radio className="w-4 h-4" />
            <span>Launch Live Test</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            id="call-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by caller, number, keywords..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'high_risk', label: 'High Risk / Threats' },
            { id: 'suspicious', label: 'Suspicious' },
            { id: 'safe', label: 'Safe Verified' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterRisk(tab.id);
                setCurrentPage(1);
              }}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors ${
                filterRisk === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center space-x-2 self-end md:self-auto shrink-0">
          <span className="text-xs text-slate-400">Sort:</span>
          <select
            id="call-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as unknown as typeof sortBy)}
            className="py-1.5 px-3 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="date">Most Recent</option>
            <option value="risk_desc">Highest Risk First</option>
            <option value="risk_asc">Lowest Risk First</option>
          </select>
        </div>
      </div>

      {/* TABLE (Desktop) & CARDS (Mobile) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {paginatedCalls.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <div>
              <h3 className="font-bold text-slate-800 text-base">No Matching Call Records</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                No calls match your active filter criteria. Try clearing your search term or running a demo call simulation.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterRisk('all');
              }}
              className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-5">Caller Details</th>
                    <th className="py-3.5 px-4">Date & Duration</th>
                    <th className="py-3.5 px-4">Risk Evaluation</th>
                    <th className="py-3.5 px-4">Signals Flagged</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {paginatedCalls.map((call) => {
                    const isHigh = call.riskLevel === 'high' || call.riskLevel === 'critical';
                    return (
                      <tr
                        key={call.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        onClick={() => navigate(`/call-details/${call.id}`)}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                isHigh
                                  ? 'bg-red-50 text-red-600 border border-red-200'
                                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                              }`}
                            >
                              {isHigh ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{call.callerName}</div>
                              <div className="text-[11px] font-mono text-slate-400">{call.callerNumber}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-600">
                          <div>{call.date}</div>
                          <div className="text-[11px] text-slate-400">{call.duration}</div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              isHigh
                                ? 'bg-red-100 text-red-800'
                                : call.riskLevel === 'moderate'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {call.riskScore}/100 • {call.riskLevel}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {call.manipulationSignals.length === 0 ? (
                              <span className="text-[11px] text-emerald-600 font-semibold">None (Safe)</span>
                            ) : (
                              call.manipulationSignals.slice(0, 2).map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-red-50 text-red-800 border border-red-200 px-1.5 py-0.5 rounded font-medium truncate max-w-[140px]"
                                >
                                  {s.label}
                                </span>
                              ))
                            )}
                            {call.manipulationSignals.length > 2 && (
                              <span className="text-[10px] text-slate-400 font-bold self-center">
                                +{call.manipulationSignals.length - 2}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-block text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                              call.analysisStatus === 'flagged'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {call.analysisStatus}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/call-details/${call.id}`);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-100 transition-colors inline-block"
                            title="View Forensic Details"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCall(call.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors inline-block"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {paginatedCalls.map((call) => {
                const isHigh = call.riskLevel === 'high' || call.riskLevel === 'critical';
                return (
                  <div
                    key={call.id}
                    onClick={() => navigate(`/call-details/${call.id}`)}
                    className="p-4 space-y-3 hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 text-sm">{call.callerName}</div>
                      <span
                        className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          isHigh ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {call.riskScore}/100 {call.riskLevel}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center justify-between">
                      <span>{call.callerNumber}</span>
                      <span>{call.date} • {call.duration}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-snug">{call.summary.slice(0, 90)}...</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-teal-600 font-bold">Tap for full analysis →</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCall(call.id);
                        }}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredCalls.length)} of {filteredCalls.length} calls
                </span>
                <div className="flex items-center space-x-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 font-semibold"
                  >
                    Previous
                  </button>
                  <span className="px-2 font-mono font-bold text-slate-700">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
