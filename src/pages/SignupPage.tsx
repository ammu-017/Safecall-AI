import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SafeCallLogo } from '../components/SafeCallLogo';
import { ShieldCheck, User, Mail, Lock, Eye, EyeOff, ArrowRight, HeartHandshake, Phone, Users } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup, enterDemoMode } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('Alekya Chintapalli');
  const [email, setEmail] = useState('chintapallialekya77@gmail.com');
  const [phone, setPhone] = useState('+1 (555) 749-3011');
  const [password, setPassword] = useState('SeniorGuard2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [guardianName, setGuardianName] = useState('Rohan Sharma');
  const [guardianRelation, setGuardianRelation] = useState('Son (Primary Guardian)');
  const [guardianPhone, setGuardianPhone] = useState('+1 (555) 382-9104');
  const [seniorRelationship, setSeniorRelationship] = useState('senior');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || '+1 (555) 749-3011',
        guardianName: guardianName.trim() || undefined,
        guardianRelation: guardianRelation.trim() || undefined,
        guardianPhone: guardianPhone.trim() || undefined,
        password,
      });
      navigate('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <SafeCallLogo size="lg" linkTo="/" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight pt-2">
            Create Protected Senior Account
          </h2>
          <p className="text-sm text-slate-500">
            Register user and primary guardian to activate scam monitoring
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-teal-900 block">Evaluating for Hackathon?</span>
            Skip registration and enter the preloaded demo workspace.
          </div>
          <button
            id="signup-demo-mode-btn"
            type="button"
            onClick={() => {
              enterDemoMode();
              navigate('/dashboard');
            }}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shrink-0 transition-colors"
          >
            Demo Mode
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Account Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSeniorRelationship('senior')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                  seniorRelationship === 'senior'
                    ? 'bg-teal-50 border-teal-500 text-teal-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Senior User</span>
              </button>
              <button
                type="button"
                onClick={() => setSeniorRelationship('family')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors ${
                  seniorRelationship === 'family'
                    ? 'bg-teal-50 border-teal-500 text-teal-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Family Caregiver</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="signup-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Senior's full name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Senior Phone Number
              </label>
              <div className="relative">
                <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="signup-phone-input"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 749-3011"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="signup-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
            </div>
          </div>

          {/* Guardian Information Fields */}
          <div className="pt-2 border-t border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Users className="w-4 h-4 text-teal-600" />
              <span>Primary Guardian / Emergency Contact Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Guardian Name
                </label>
                <input
                  id="signup-guardian-name-input"
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="Guardian's name"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Relationship
                </label>
                <input
                  id="signup-guardian-rel-input"
                  type="text"
                  required
                  value={guardianRelation}
                  onChange={(e) => setGuardianRelation(e.target.value)}
                  placeholder="e.g. Son, Daughter, Caregiver"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Guardian Phone
                </label>
                <input
                  id="signup-guardian-phone-input"
                  type="text"
                  required
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+1 (555) 382-9104"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                id="signup-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-normal">
            By registering, you confirm that you agree to SafeCall AI's privacy principles. Personal and guardian details are preserved securely on device.
          </p>

          <button
            id="signup-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md shadow-teal-600/20 disabled:opacity-50"
          >
            <span>{isLoading ? 'Setting Up Shield...' : 'Create Account & Start Protection'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-teal-600 font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

