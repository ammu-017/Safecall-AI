import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SafeCallLogo } from '../components/SafeCallLogo';
import {
  getLastActiveAccount,
  getRegisteredAccounts,
  maskPhoneNumber,
  maskEmail,
  clearLastActiveAccount,
  RegisteredAccount,
} from '../services/accountService';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Info,
  UserCheck,
  Users,
  Shield,
  HeartHandshake,
  UserX,
  RefreshCw,
  BellRing,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, enterDemoMode, addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  // Saved / Identified Previous Account state
  const [savedAccount, setSavedAccount] = useState<RegisteredAccount | null>(() => {
    return getLastActiveAccount();
  });

  // Mode: if savedAccount is present and user hasn't switched, personalizedMode = true
  const [personalizedMode, setPersonalizedMode] = useState<boolean>(() => {
    return !!getLastActiveAccount();
  });

  // Login form inputs
  const [credential, setCredential] = useState<string>(() => {
    const acc = getLastActiveAccount();
    return acc ? acc.user.email : '';
  });
  const [password, setPassword] = useState<string>('ProtectionPass123!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [forgotModalOpen, setForgotModalOpen] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>('');

  // Update credential whenever savedAccount changes
  useEffect(() => {
    if (personalizedMode && savedAccount) {
      setCredential(savedAccount.user.email);
    }
  }, [personalizedMode, savedAccount]);

  const handleSwitchAccount = () => {
    clearLastActiveAccount();
    setSavedAccount(null);
    setPersonalizedMode(false);
    setCredential('');
    setPassword('');
    setErrorMessage('');
    addToast('Account Switched', 'Displaying standard sign-in form for another account.', 'info');
  };

  const handleSelectPresetAccount = (acc: RegisteredAccount) => {
    setSavedAccount(acc);
    setPersonalizedMode(true);
    setCredential(acc.user.email);
    setPassword('ProtectionPass123!');
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cred = credential.trim();
    if (!cred) {
      setErrorMessage('Please enter your registered email address or mobile number.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const success = login(cred, password);
      if (success) {
        navigate(from, { replace: true });
      } else {
        // Privacy rule: Clear error message without exposing whether account exists or revealing private details
        setErrorMessage('Invalid credentials. Please verify your email/mobile and password.');
      }
    }, 600);
  };

  const handleDemoLogin = (accountId?: string) => {
    enterDemoMode(accountId);
    navigate(from, { replace: true });
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !resetEmail.includes('@')) {
      addToast('Invalid Email', 'Please provide a valid email address.', 'warning');
      return;
    }
    setForgotModalOpen(false);
    addToast(
      'Password Reset Dispatched',
      `Verification link and SMS notification sent to registered guardian for security.`,
      'success'
    );
  };

  const allAccounts = getRegisteredAccounts();
  const primaryGuardian = savedAccount?.guardians?.[0];
  const secondaryGuardian = savedAccount?.guardians?.[1];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* LOGOUT SUCCESS NOTIFICATION BANNER */}
        <div
          id="logout-success-banner"
          className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between shadow-xs animate-in fade-in duration-300"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-950">
                You have been logged out successfully.
              </div>
              <div className="text-xs text-emerald-700">
                Active call monitoring session stopped. Your registered senior and guardian profiles are safely preserved.
              </div>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-full">
            Session Terminated
          </span>
        </div>

        {/* Redirect from protected page alert */}
        {location.state?.from && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center space-x-2 animate-in fade-in duration-200">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Please authenticate again to access protected SafeCall AI monitoring features.</span>
          </div>
        )}

        {/* MAIN CONTAINER */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* LEFT COLUMN: PERSONALIZED USER & GUARDIAN DETAILS (OR WELCOME OVERVIEW) */}
            <div className="lg:col-span-6 bg-slate-50/80 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <SafeCallLogo size="md" linkTo="/" />
                    <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-teal-100 text-teal-800">
                      SafeCall Sentinel
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {personalizedMode && savedAccount
                      ? 'Saved Account & Guardian'
                      : 'SafeCall AI Scam Defense'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {personalizedMode && savedAccount
                      ? 'Re-authenticate with your password to resume real-time conversational scam detection.'
                      : 'Sign in to access real-time voice call monitoring, AI transcript analysis, and family alerts.'}
                  </p>
                </div>

                {/* 1. USER PROFILE CARD (When previous account identified) */}
                {personalizedMode && savedAccount ? (
                  <div className="space-y-4">
                    {/* User Profile Card */}
                    <div
                      id="user-profile-card"
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                          <span>Registered Senior Profile</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{savedAccount.user.accountStatus || 'Active Protected'}</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        {savedAccount.user.avatarUrl ? (
                          <img
                            src={savedAccount.user.avatarUrl}
                            alt={savedAccount.user.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/30 shadow-xs"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                            {savedAccount.user.name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')
                              .slice(0, 2)}

                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-slate-900 text-base truncate">
                            {savedAccount.user.name}
                          </h3>
                          <div className="text-xs text-slate-600 flex items-center space-x-1.5 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{maskEmail(savedAccount.user.email)}</span>
                          </div>
                          <div className="text-xs text-slate-600 flex items-center space-x-1.5 mt-0.5 font-mono">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{maskPhoneNumber(savedAccount.user.phone)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Protected since {savedAccount.user.protectedSince}</span>
                        <span className="font-semibold text-slate-700">Account verified</span>
                      </div>
                    </div>

                    {/* 2. GUARDIAN INFORMATION CARD */}
                    <div
                      id="guardian-information-card"
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <span>Emergency Guardian Network</span>
                        </span>
                        <span className="inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          <BellRing className="w-3 h-3 text-blue-600" />
                          <span>Alerts Ready</span>
                        </span>
                      </div>

                      {/* Primary Guardian */}
                      {primaryGuardian && (
                        <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {primaryGuardian.name}
                            </span>
                            <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                              {primaryGuardian.relationship}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                            <span className="flex items-center space-x-1 text-slate-500">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>Mobile:</span>
                            </span>
                            <span>{maskPhoneNumber(primaryGuardian.phoneNumber)}</span>
                          </div>
                          <div className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1 pt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Alert Status: {primaryGuardian.alertStatus}</span>
                          </div>
                        </div>
                      )}

                      {/* Secondary Guardian (if available) */}
                      {secondaryGuardian && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800 text-xs">
                              {secondaryGuardian.name}
                            </span>
                            <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                              {secondaryGuardian.relationship}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                            <span className="text-slate-500 text-[11px]">Secondary Contact:</span>
                            <span>{maskPhoneNumber(secondaryGuardian.phoneNumber)}</span>
                          </div>
                        </div>
                      )}

                      <div className="text-[11px] text-slate-500 flex items-center space-x-1.5 pt-1">
                        <Shield className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>High-risk scam attempts immediately dispatch SMS alerts to guardians.</span>
                      </div>
                    </div>

                    {/* Switch Account Control */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        id="switch-account-btn"
                        type="button"
                        onClick={handleSwitchAccount}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1.5 py-1.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors"
                      >
                        <UserX className="w-3.5 h-3.5 text-slate-500" />
                        <span>Not you? Switch account</span>
                      </button>

                      <span className="text-[11px] text-slate-400">
                        Privacy protected
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Standard Mode (When no previous account or user switched) */
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                        <ShieldCheck className="w-4 h-4 text-teal-600" />
                        <span>Autonomous Senior Safety</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        SafeCall AI monitors voice calls in real-time, detecting intimidation, OTP extraction, digital arrest threats, and urgency manipulation before money is lost.
                      </p>
                    </div>

                    {/* Preset Demo Profiles Quick Switcher */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                        Or select a registered test account:
                      </span>
                      <div className="space-y-2">
                        {allAccounts.map((acc) => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => handleSelectPresetAccount(acc)}
                            className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-left transition-colors flex items-center justify-between group"
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                                {acc.user.name[0]}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-slate-900 group-hover:text-teal-900">
                                  {acc.user.name}
                                </div>
                                <div className="text-[10px] text-slate-500 font-mono">
                                  {maskEmail(acc.user.email)}
                                </div>
                              </div>
                            </div>
                            <span className="text-[11px] text-teal-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              Select →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hackathon Quick Access / Demo Login Button */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  id="login-instant-demo-btn"
                  type="button"
                  onClick={() => handleDemoLogin(savedAccount?.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-900 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  <span>One-Click Hackathon Demo Mode ({savedAccount ? savedAccount.user.name : 'Alekya'})</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: SECURE LOGIN FORM */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {personalizedMode && savedAccount
                    ? `Sign In as ${savedAccount.user.name.split(' ')[0]}`
                    : 'Sign In to Your Account'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your credentials to verify identity and unlock your protected dashboard.
                </p>
              </div>

              {errorMessage && (
                <div
                  id="login-error-message"
                  className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-in fade-in duration-150"
                >
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email / Mobile Field */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Registered Email or Mobile
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="login-credential-input"
                      type="text"
                      required
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                      placeholder="email@domain.com or phone number"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                    <button
                      id="login-forgot-password-link"
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-xs text-teal-600 font-semibold hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium text-slate-900"
                    />
                    <button
                      id="toggle-password-visibility-btn"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      id="login-remember-me-checkbox"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <span className="font-medium">Remember me on this device</span>
                  </label>
                  <span className="text-[11px] text-slate-400">Safe TLS 1.3</span>
                </div>

                {/* Submit Button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-slate-900/10 active:scale-[0.99] disabled:opacity-50"
                >
                  <span>{isLoading ? 'Authenticating...' : 'Sign In to SafeCall AI'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Signup Link */}
              <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                Don't have an account or adding a new senior?{' '}
                <Link
                  id="login-to-signup-link"
                  to="/signup"
                  className="text-teal-600 font-bold hover:underline"
                >
                  Register new account
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div
          id="forgot-password-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900">Reset Account Access</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered email address. For senior security, password reset requests automatically dispatch a notification to the registered guardian.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <input
                id="forgot-email-input"
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full p-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  id="send-reset-link-btn"
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white rounded-xl"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
