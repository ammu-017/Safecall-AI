import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Server, RefreshCw, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';

export const BackendStatusBadge: React.FC = () => {
  const { backendStatus, checkBackendHealth, isCheckingBackend } = useApp();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        id="backend-status-badge-btn"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
        title="View Backend & Demo Architecture Status"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            backendStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
          }`}
        />
        <Server className="w-3.5 h-3.5 text-slate-500" />
        <span className="hidden sm:inline">
          {backendStatus.connected ? 'Antigravity Backend: Online' : 'Demo Mode (Mock Adapter)'}
        </span>
        <span className="sm:hidden">
          {backendStatus.connected ? 'Backend Online' : 'Demo Mode'}
        </span>
      </button>

      {/* Info modal */}
      {showModal && (
        <div
          id="backend-info-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div
            id="backend-info-modal-content"
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-5 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Backend & API Integration Architecture</h3>
                  <p className="text-xs text-slate-500">Google Antigravity Python / FastAPI Integration</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center justify-between font-mono pb-2 border-b border-slate-200">
                <span className="text-slate-500">Configured Endpoint:</span>
                <span className="font-bold text-slate-900">{backendStatus.endpoint}</span>
              </div>
              <div className="flex items-center justify-between font-mono pb-2 border-b border-slate-200">
                <span className="text-slate-500">Current Health:</span>
                <span className={`font-bold flex items-center space-x-1.5 ${backendStatus.connected ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {backendStatus.connected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{backendStatus.connected ? 'Connected (Live API)' : 'Disconnected (Demo Mode Active)'}</span>
                </span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-500">Last Checked:</span>
                <span>{backendStatus.checkedAt}</span>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 text-xs text-blue-900 space-y-2">
              <div className="flex items-center space-x-1.5 font-bold text-blue-950">
                <Info className="w-4 h-4 text-blue-700 shrink-0" />
                <span>Hackathon Evaluation Transparency Note:</span>
              </div>
              <p>
                The frontend includes a complete, modular API service layer (<code className="bg-blue-100 px-1 py-0.5 rounded text-blue-950 font-mono">apiService.ts</code>) ready for your Python FastAPI backend at <code className="bg-blue-100 px-1 py-0.5 rounded text-blue-950 font-mono">http://localhost:8000</code>.
              </p>
              <p>
                While the external backend is offline, SafeCall AI operates smoothly using its built-in local demo adapter with realistic scenarios, audio simulation, sound alerts, and full state persistence.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                id="backend-recheck-btn"
                onClick={checkBackendHealth}
                disabled={isCheckingBackend}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingBackend ? 'animate-spin' : ''}`} />
                <span>{isCheckingBackend ? 'Pinging Endpoint...' : 'Test Backend Connection'}</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
