import React from 'react';
import { LogOut, AlertTriangle } from 'lucide-react';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  userName?: string;
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  userName,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="logout-confirmation-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      <div
        id="logout-confirmation-dialog"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 animate-in zoom-in-95 duration-150"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 id="logout-dialog-title" className="text-xl font-black text-slate-900 tracking-tight">
                Log Out of SafeCall AI?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active scam protection session confirmation
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed space-y-2">
            <p>
              Are you sure you want to log out{userName ? `, ${userName}` : ''}?
            </p>
            <p className="text-slate-500 flex items-start space-x-1.5 pt-1">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Logging out will stop any ongoing live call monitors, silence active alarms, and close your secure session.
              </span>
            </p>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              id="cancel-logout-btn"
              type="button"
              onClick={onCancel}
              className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-logout-btn"
              type="button"
              onClick={onConfirm}
              className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 active:scale-[0.98] flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Yes, Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
