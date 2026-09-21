import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { SafeCallLogo } from '../components/SafeCallLogo';
import { BackendStatusBadge } from '../components/BackendStatusBadge';
import { ToastContainer } from '../components/ToastContainer';
import { ShieldCheck, ArrowRight, HeartHandshake, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { isAuthenticated, enterDemoMode } = useApp();
  const navigate = useNavigate();

  const handleLaunchDemo = () => {
    enterDemoMode();
    navigate('/live-monitor');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* PUBLIC NAVBAR */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <SafeCallLogo size="md" showTagline={false} linkTo="/" />

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
            <Link to="/how-it-works" className="hover:text-teal-600 transition-colors">
              How It Works
            </Link>
            <button
              onClick={handleLaunchDemo}
              className="hover:text-teal-600 transition-colors font-semibold"
            >
              Interactive Demo
            </button>
            <Link to="/dashboard" className="hover:text-teal-600 transition-colors">
              Features
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <BackendStatusBadge />

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all shadow-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  Log In
                </Link>
                <button
                  onClick={handleLaunchDemo}
                  className="py-2.5 px-4 sm:px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all shadow-sm shadow-teal-600/20 active:scale-[0.98]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Start Protection</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* OUTLET */}
      <main className="flex-1">
        {children || <Outlet />}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0B1528] text-slate-400 border-t border-slate-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-4">
              <SafeCallLogo size="md" />
              <p className="text-slate-400 text-sm max-w-md leading-relaxed">
                SafeCall AI provides intelligent, real-time conversational analysis to protect elderly citizens from digital arrest, fake bank KYC, and psychological social-engineering phone scams.
              </p>
              <div className="flex items-center space-x-2 text-xs text-teal-400">
                <HeartHandshake className="w-4 h-4" />
                <span>Engineered specifically with high-contrast, simple interfaces for seniors.</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform Pages</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/dashboard" className="hover:text-teal-400 transition-colors">Protection Dashboard</Link></li>
                <li><Link to="/live-monitor" className="hover:text-teal-400 transition-colors">Live Call Monitor</Link></li>
                <li><Link to="/call-history" className="hover:text-teal-400 transition-colors">Forensic Call Reports</Link></li>
                <li><Link to="/trusted-contacts" className="hover:text-teal-400 transition-colors">Family Trusted Contacts</Link></li>
                <li><Link to="/how-it-works" className="hover:text-teal-400 transition-colors">Architecture & Pipeline</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Ethical AI & Privacy</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                SafeCall AI is built on content-based semantic analysis rather than caller-ID spoof databases. Raw audio is never monetized or stored without explicit consent.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
                AI Hackathon Project powered by Google Antigravity & FastAPI.
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
            <div>
              © 2026 SafeCall AI. "Detect the manipulation. Protect the moment."
            </div>
            <div className="text-slate-400">
              Simulated Demo Mode • No direct cellular carrier tapping without native app permissions.
            </div>
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  );
};
