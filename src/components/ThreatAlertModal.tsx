import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { audioAlertService } from '../services/audioAlertService';
import { AlertOctagon, Volume2, VolumeX, ShieldAlert, X, PhoneOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ThreatAlertModal: React.FC = () => {
  const { activeThreatModal, dismissThreatAlert } = useApp();
  const [isMuted, setIsMuted] = useState(audioAlertService.isMuted());
  const navigate = useNavigate();

  if (!activeThreatModal) return null;

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    audioAlertService.setMuted(nextState);
  };

  const handleViewDetails = () => {
    dismissThreatAlert();
    if (activeThreatModal.callId) {
      navigate(`/call-details/${activeThreatModal.callId}`);
    } else {
      navigate('/live-monitor');
    }
  };

  return (
    <div
      id="threat-alert-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="threat-alert-title"
    >
      <div
        id="threat-alert-card"
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-4 border-red-600 overflow-hidden text-slate-900"
      >
        {/* Banner header */}
        <div className="bg-red-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <AlertOctagon className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold bg-red-800/80 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Critical Scam Warning
              </span>
              <h2 id="threat-alert-title" className="text-2xl font-black tracking-tight leading-tight">
                {activeThreatModal.title || 'Potential Scam Call Detected!'}
              </h2>
            </div>
          </div>

          {/* Sound Mute Toggle */}
          <button
            id="threat-alert-mute-btn"
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors focus:ring-2 focus:ring-white"
            title={isMuted ? 'Unmute Siren' : 'Mute Warning Buzzer'}
            aria-label={isMuted ? 'Unmute siren' : 'Mute siren'}
          >
            {isMuted ? <VolumeX className="w-6 h-6 text-red-200" /> : <Volume2 className="w-6 h-6 text-white animate-bounce" />}
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Main instruction box for elderly users */}
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 text-red-950 space-y-2">
            <div className="flex items-center space-x-2 text-red-700 font-bold text-lg">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <span>Protective Instruction For Your Safety:</span>
            </div>
            <p className="text-base font-semibold leading-relaxed">
              {activeThreatModal.message ||
                'Do not share your OTP, PIN, passwords, or send money to anyone. Legitimate officials or banks will never threaten you or demand secrecy.'}
            </p>
          </div>

          {/* Detected signals */}
          {activeThreatModal.signals && activeThreatModal.signals.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Detected Manipulation Patterns:
              </h3>
              <div className="space-y-2.5">
                {activeThreatModal.signals.map((sig) => (
                  <div
                    key={sig.id || sig.label}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-3"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{sig.label}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{sig.description}</div>
                      {sig.evidenceSnippet && (
                        <div className="text-xs font-mono bg-red-100/60 text-red-800 px-2 py-1 rounded mt-1.5 inline-block">
                          Evidence: {sig.evidenceSnippet}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Caller info if present */}
          {(activeThreatModal.callerName || activeThreatModal.callerNumber) && (
            <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded-lg flex items-center justify-between">
              <span>Caller: <strong>{activeThreatModal.callerName || 'Unknown Caller'}</strong></span>
              <span>Number: <strong>{activeThreatModal.callerNumber || 'Blocked/Private'}</strong></span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              id="threat-alert-hangup-btn"
              onClick={dismissThreatAlert}
              className="flex-1 py-4 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-lg shadow-red-600/20 flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
            >
              <PhoneOff className="w-5 h-5" />
              <span>Acknowledge & Hang Up</span>
            </button>

            <button
              id="threat-alert-details-btn"
              onClick={handleViewDetails}
              className="py-4 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-colors"
            >
              <span>View Threat Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            SafeCall AI Demo Simulation • Your family trusted contacts are configured for instant notification.
          </p>
        </div>
      </div>
    </div>
  );
};
