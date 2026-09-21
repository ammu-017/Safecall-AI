import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SafeCallLogo } from '../components/SafeCallLogo';
import { BackendStatusBadge } from '../components/BackendStatusBadge';
import { ThreatAlertModal } from '../components/ThreatAlertModal';
import { ToastContainer } from '../components/ToastContainer';
import { LogoutConfirmationModal } from '../components/LogoutConfirmationModal';
import {
  ShieldCheck,
  Radio,
  History,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
  Bell,
  LogOut,
  Type,
  SunMedium,
  RotateCcw,
  ChevronDown,
  User,
  ShieldAlert,
} from 'lucide-react';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout, settings, updateSettings, resetAllDemoData, calls } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleTriggerLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutConfirmOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const flaggedCalls = calls.filter((c) => c.riskLevel === 'high' || c.riskLevel === 'critical');

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: ShieldCheck },
    { label: 'Live Monitor', path: '/live-monitor', icon: Radio, badge: 'Live AI' },
    { label: 'Call History', path: '/call-history', icon: History, count: calls.length },
    { label: 'Family & Contacts', path: '/trusted-contacts', icon: Users },
    { label: 'Security Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'How It Works', path: '/how-it-works', icon: HelpCircle },
  ];

  const handleLargeTextToggle = () => {
    updateSettings({ largeTextMode: !settings.largeTextMode });
  };

  const handleHighContrastToggle = () => {
    updateSettings({ highContrastMode: !settings.highContrastMode });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] text-[#0F172A]">
      {/* SIDEBAR (Desktop) */}
      <aside
        id="app-sidebar"
        className="hidden md:flex flex-col w-72 bg-[#0B1528] text-slate-200 border-r border-slate-800 shrink-0 select-none z-30"
      >
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center space-x-3">
            <SafeCallLogo size="md" linkTo="/dashboard" />
          </div>
          <div className="mt-3 text-[11px] font-medium text-slate-400 tracking-wide uppercase flex items-center justify-between">
            <span>Elderly Defense Engine</span>
            <span className="text-teal-400 font-bold bg-teal-950/70 border border-teal-800/60 px-2 py-0.5 rounded text-[10px]">
              v1.2 Active
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                id={`sidebar-nav-${item.path.replace('/', '') || 'dash'}`}
                className={({ isActive: navActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                    navActive || isActive
                      ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-teal-300 font-semibold border-l-4 border-teal-400 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                    {item.count}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Dedicated Sidebar Logout Action Item */}
          <div className="pt-2 mt-2 border-t border-slate-800/80">
            <button
              id="sidebar-logout-btn"
              type="button"
              onClick={handleTriggerLogout}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-150 group text-left"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
                <span className="font-semibold">Log Out</span>
              </div>
              <span className="text-[10px] text-slate-500 group-hover:text-red-300 transition-colors uppercase font-mono">
                Exit
              </span>
            </button>
          </div>
        </nav>

        {/* Live Protection Status Indicator Card */}
        <div className="p-4 mx-4 mb-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Protection Shield</span>
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>Standby Guard</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            SafeCall AI is analyzing conversational cues for OTP theft, digital arrest, and extortion.
          </p>
          <button
            onClick={() => navigate('/live-monitor')}
            className="w-full py-2 px-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Launch Live Monitor</span>
          </button>
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-inner shrink-0">
              AC
            </div>
            <div className="min-w-0">
              <div className="text-white font-semibold truncate">{user?.name || 'Alekya Chintapalli'}</div>
              <div className="text-[11px] text-slate-400 truncate">Protected Senior</div>
            </div>
          </div>
          <button
            id="sidebar-profile-logout-btn"
            onClick={handleTriggerLogout}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-300 transition-colors"
            title="Log Out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden bg-[#0B1528] text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <SafeCallLogo size="sm" linkTo="/dashboard" />
        <div className="flex items-center space-x-2">
          <BackendStatusBadge />
          {/* Mobile Header Direct Logout Button */}
          <button
            id="mobile-header-logout-btn"
            type="button"
            onClick={handleTriggerLogout}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-red-950/60 border border-red-800/80 text-red-300 hover:bg-red-900/60 text-xs font-bold transition-colors"
            title="Log Out"
            aria-label="Log out"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Logout</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden fixed inset-0 top-[61px] z-40 bg-[#0B1528] p-6 space-y-4 flex flex-col text-slate-200 overflow-y-auto"
        >
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 text-sm font-medium"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-teal-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Mobile Drawer Logout Nav Item */}
            <button
              id="mobile-drawer-logout-item-btn"
              type="button"
              onClick={handleTriggerLogout}
              className="w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors mt-2 text-left"
            >
              <div className="flex items-center space-x-3">
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="font-semibold">Log Out</span>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">Exit</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">{user?.name}</span>
            <button
              id="mobile-drawer-bottom-logout-btn"
              onClick={handleTriggerLogout}
              className="text-xs text-red-400 font-semibold flex items-center space-x-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER BAR */}
        <header
          id="top-dashboard-header"
          className="bg-white border-b border-slate-200/90 px-6 py-4 flex items-center justify-between sticky top-0 md:static z-20 shadow-xs"
        >
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">
                Good morning, {user?.name?.split(' ')[0] || 'Alekya'}
              </h1>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Call Protection Active</span>
                </span>
                <span className="hidden lg:inline text-xs text-slate-400">•</span>
                <span className="hidden lg:inline text-xs text-slate-500">
                  Anti-manipulation analysis standing by
                </span>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Backend / Demo mode badge */}
            <BackendStatusBadge />

            {/* Accessibility Quick Toggles */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={handleLargeTextToggle}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  settings.largeTextMode
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Toggle Elderly Large Text Mode"
                aria-label="Toggle large text"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={handleHighContrastToggle}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  settings.highContrastMode
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Toggle High Contrast Mode"
                aria-label="Toggle high contrast"
              >
                <SunMedium className="w-4 h-4" />
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="header-notifications-btn"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {flaggedCalls.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600" />
                )}
              </button>

              {notifDropdownOpen && (
                <div
                  id="notifications-dropdown"
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-slate-800"
                >
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-sm">Security Alerts</span>
                    <span className="text-xs text-slate-500">{flaggedCalls.length} Threats Logged</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-2 divide-y divide-slate-100 text-xs">
                    {flaggedCalls.length === 0 ? (
                      <div className="p-4 text-center text-slate-400">
                        No active security alerts.
                      </div>
                    ) : (
                      flaggedCalls.slice(0, 3).map((call) => (
                        <div
                          key={call.id}
                          onClick={() => {
                            setNotifDropdownOpen(false);
                            navigate(`/call-details/${call.id}`);
                          }}
                          className="p-3 hover:bg-slate-50 cursor-pointer flex items-start space-x-2.5"
                        >
                          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-slate-900 leading-snug">{call.callerName}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{call.summary.slice(0, 75)}...</p>
                            <span className="inline-block mt-1 text-[10px] text-red-600 font-semibold uppercase">
                              Risk Score: {call.riskScore}/100
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setNotifDropdownOpen(false);
                        navigate('/call-history');
                      }}
                      className="text-xs text-teal-600 font-bold hover:underline"
                    >
                      View All Call Records →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Visible Header Logout Button */}
            <button
              id="header-logout-btn"
              type="button"
              onClick={handleTriggerLogout}
              className="flex items-center space-x-1.5 py-1.5 px-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-xs font-bold transition-all shadow-xs active:scale-[0.98]"
              title="Log out of SafeCall AI"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">Log Out</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                id="header-profile-btn"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                aria-label="User profile"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 text-teal-300 font-bold text-xs flex items-center justify-center">
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                    : 'SC'}
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {profileDropdownOpen && (
                <div
                  id="profile-dropdown-menu"
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-slate-800 text-xs"
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
                    <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Protection Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      resetAllDemoData();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center space-x-2 text-amber-700 font-medium"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <span>Reset Demo Data</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    id="profile-dropdown-logout-btn"
                    onClick={handleTriggerLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center space-x-2 text-red-600 font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE OUTLET */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>

      {/* Global alert dialog & toast container */}
      <ThreatAlertModal />
      <ToastContainer />
      <LogoutConfirmationModal
        isOpen={logoutConfirmOpen}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutConfirmOpen(false)}
        userName={user?.name}
      />
    </div>
  );
};
