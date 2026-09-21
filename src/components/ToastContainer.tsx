import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        let bgStyle = 'bg-white border-slate-200 text-slate-800';
        let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;

        if (toast.type === 'success') {
          bgStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-amber-50 border-amber-300 text-amber-950';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
        } else if (toast.type === 'critical') {
          bgStyle = 'bg-red-50 border-red-400 text-red-950 border-2';
          icon = <AlertOctagon className="w-6 h-6 text-red-600 shrink-0 animate-pulse" />;
        }

        return (
          <div
            key={toast.id}
            id={`toast-${toast.id}`}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start space-x-3 transition-all duration-200 ${bgStyle}`}
            role="status"
          >
            <div className="mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm leading-snug">{toast.title}</div>
              <div className="text-xs mt-0.5 opacity-90 leading-relaxed break-words">{toast.message}</div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
