import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Radio,
  ArrowRight,
  Eye,
  Lock,
  Heart,
  PhoneCall,
  Clock,
  Sparkles,
  Zap,
  Users,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { enterDemoMode } = useApp();
  const navigate = useNavigate();

  const handleStartProtection = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  const handleExploreDemo = () => {
    enterDemoMode();
    navigate('/live-monitor');
  };

  return (
    <div className="space-y-24 py-12 md:py-20 overflow-hidden">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>AI Hackathon Project • Google Antigravity & FastAPI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Stay One Step Ahead of <span className="text-teal-600">Scam Calls.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
              SafeCall AI listens for what callers actually say—not just phone numbers. Real-time conversational analysis detects digital-arrest threats, fake bank KYC fraud, OTP theft, and psychological manipulation before a single dollar is lost.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                id="hero-start-protection-btn"
                onClick={handleStartProtection}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-base sm:text-lg flex items-center justify-center space-x-3 transition-all shadow-lg shadow-teal-600/25 active:scale-[0.98]"
              >
                <ShieldCheck className="w-6 h-6" />
                <span>Start Protection</span>
              </button>

              <button
                id="hero-explore-demo-btn"
                onClick={handleExploreDemo}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base sm:text-lg flex items-center justify-center space-x-3 transition-all active:scale-[0.98]"
              >
                <Radio className="w-5 h-5 text-teal-400" />
                <span>Explore Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Zero Audio Retention</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Senior-Optimized Interface</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Family Alert Network</span>
              </div>
            </div>
          </div>

          {/* Right Hero Graphic: Phone Mockup with Scam Warning */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Decorative aura */}
              <div className="absolute -inset-4 bg-gradient-to-r from-teal-500/20 to-blue-600/20 rounded-3xl blur-2xl -z-10" />

              {/* Smartphone Frame Container */}
              <div className="bg-slate-900 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800 text-white space-y-4">
                {/* Phone Speaker Notch */}
                <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto" />

                {/* Simulated Screen */}
                <div className="bg-slate-950 rounded-[28px] p-5 space-y-4 border border-slate-800">
                  {/* Incoming Caller bar */}
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Active Voice Call (01:24)</span>
                    </span>
                    <span className="font-mono text-slate-400">+1 (800) 419-8921</span>
                  </div>

                  {/* Caller Title */}
                  <div className="text-center py-1">
                    <div className="text-xs uppercase tracking-wider text-slate-400">Purported Caller</div>
                    <div className="text-lg font-bold text-white">"Central Cyber Inspector"</div>
                  </div>

                  {/* Live Threat Detection Notification Card */}
                  <div className="bg-red-950/80 border-2 border-red-500/90 rounded-2xl p-4 space-y-2.5 shadow-lg shadow-red-950/50 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase bg-red-600 text-white px-2 py-0.5 rounded-full">
                        Critical Threat: 95/100
                      </span>
                      <span className="text-xs font-mono text-red-300">SafeCall AI</span>
                    </div>

                    <div className="text-sm font-black text-red-100 flex items-start space-x-2">
                      <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <span>DO NOT SEND MONEY OR REMAIN ON THIS CALL</span>
                    </div>

                    <p className="text-xs text-red-200 leading-snug">
                      Detected: <strong>Digital Arrest Extortion</strong>. Scammers are impersonating police to isolate you from your family.
                    </p>

                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={handleExploreDemo}
                        className="w-full py-2 bg-red-600 hover:bg-red-500 rounded-lg text-white font-bold text-xs"
                      >
                        Hang Up & Alert Rohan (Son)
                      </button>
                    </div>
                  </div>

                  {/* Live Audio Transcript Preview */}
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                    <div className="text-[10px] text-teal-400 flex items-center space-x-1">
                      <Radio className="w-3 h-3 animate-pulse" />
                      <span>STREAMING TRANSCRIPTION</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-tight italic">
                      "...you are placed under digital arrest right now. Liquidate $4,500 into the Reserve escrow account..."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              The Escalating Crisis
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Modern Scammers Don’t Hack Passwords. They Manipulate People.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Caller ID screening and number-blocking lists fail because scammers spoof local phone numbers and rotate virtual SIMs in seconds. They target seniors with psychological weapons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: 'Manufactured Urgency',
                desc: 'Pretending bank accounts, electricity, or pensions will be terminated in 15 minutes unless rapid action is taken.',
                icon: Clock,
                color: 'text-amber-600 bg-amber-50 border-amber-200',
              },
              {
                title: 'Fabricated Arrest Warrants',
                desc: 'Falsely claiming custom border packages or drugs were linked to their Aadhaar/SSN to induce overwhelming panic.',
                icon: AlertTriangle,
                color: 'text-red-600 bg-red-50 border-red-200',
              },
              {
                title: 'Mandatory Isolation',
                desc: 'Strictly forbidding seniors from speaking with their sons, daughters, or doctors to prevent independent verification.',
                icon: Lock,
                color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
              },
              {
                title: 'OTP & Escrow Theft',
                desc: 'Pressuring elderly victims to read SMS 2FA codes or wire lifetime savings into so-called "protective government accounts".',
                icon: ShieldAlert,
                color: 'text-rose-600 bg-rose-50 border-rose-200',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-slate-300 transition-all space-y-3"
                >
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW SAFECALL AI WORKS PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Intelligent Protection Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How SafeCall AI Protects the Moment
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Our multi-stage architecture continuously evaluates conversational context, isolating manipulative patterns without falsely flagging legitimate urgent family calls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Listen',
              subtitle: 'Audio Capture',
              desc: 'Streaming audio frames are captured on supported devices and transcribed in real-time.',
              icon: PhoneCall,
            },
            {
              step: '02',
              title: 'Analyze',
              subtitle: 'Conversational AI',
              desc: 'Antigravity natural language models evaluate conversational intent, psychological pressure, and deceptive scripts.',
              icon: Sparkles,
            },
            {
              step: '03',
              title: 'Detect',
              subtitle: 'Multi-Signal Fusion',
              desc: 'Calculates dynamic risk (0–100) by combining urgency cues, OTP requests, and impersonation flags.',
              icon: Zap,
            },
            {
              step: '04',
              title: 'Alert',
              subtitle: 'Protective Intervention',
              desc: 'Displays unmistakable visual warnings, sounds a loud safety chime, and alerts trusted family contacts via SMS.',
              icon: ShieldCheck,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow relative space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200">{item.step}</span>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-bold text-teal-600">{item.subtitle}</div>
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* BENCHMARK / SAMPLE THREAT CARD SHOWCASE */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 px-3 py-1 rounded-full border border-teal-800">
                Sample Live Threat Evaluation
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Context-Aware Detection in Action
              </h2>
              <p className="text-slate-400 text-sm">
                SafeCall AI correctly distinguishes a legitimate hospital emergency from a predatory scam call.
              </p>
            </div>
            <button
              onClick={handleExploreDemo}
              className="py-3 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center space-x-2 shrink-0 transition-colors"
            >
              <span>Test All 5 Demo Scenarios</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Scam Call Flagged */}
            <div className="bg-slate-950 rounded-2xl p-6 border-2 border-red-500/80 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-bold text-sm text-red-400">Scam Scenario: Digital Arrest</span>
                </div>
                <span className="text-xs font-black bg-red-600 text-white px-2.5 py-0.5 rounded-full">
                  Risk Score: 98/100 (Critical)
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-2 font-mono bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <p className="text-red-300">
                  <strong>Caller:</strong> "Under Section 144, you are under digital arrest. Do not tell your daughter. Transfer $8,000 to the court escrow."
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase text-slate-400">Signals Detected:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-red-950 text-red-300 border border-red-800 px-2.5 py-1 rounded-md">
                    • Police Impersonation
                  </span>
                  <span className="bg-red-950 text-red-300 border border-red-800 px-2.5 py-1 rounded-md">
                    • Secrecy & Family Isolation
                  </span>
                  <span className="bg-red-950 text-red-300 border border-red-800 px-2.5 py-1 rounded-md">
                    • Irrevocable Wire Transfer Demand
                  </span>
                </div>
              </div>

              <div className="p-3 bg-red-900/20 rounded-xl border border-red-800/40 text-xs text-red-200">
                ✓ <strong>Protective Action:</strong> Warning chime fired, screen turned red, emergency SMS dispatched to son Rohan.
              </div>
            </div>

            {/* Card 2: Hospital Emergency Allowed */}
            <div className="bg-slate-950 rounded-2xl p-6 border-2 border-emerald-500/80 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-sm text-emerald-400">Legitimate Scenario: Hospital Emergency</span>
                </div>
                <span className="text-xs font-black bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                  Risk Score: 12/100 (Safe)
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-2 font-mono bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
                <p className="text-emerald-300">
                  <strong>Caller:</strong> "This is Nurse Brenda from City Hospital. Your husband had a mild wrist sprain. Bring his ID card at 4:30 PM. No payment over the phone."
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase text-slate-400">Context Evaluation:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-md">
                    ✓ Verified Hospital Context
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-md">
                    ✓ Explicitly No Phone Payment
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-md">
                    ✓ Family Presence Encouraged
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-900/20 rounded-xl border border-emerald-800/40 text-xs text-emerald-200">
                ✓ <strong>Result:</strong> Zero false alarms. Call classified as completely safe and reassuring.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIVACY & ETHICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-50/70 border border-teal-200 rounded-3xl p-8 md:p-12 space-y-6">
          <div className="flex items-center space-x-3 text-teal-800">
            <Lock className="w-8 h-8 text-teal-600 shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-extrabold">Privacy-First Architecture by Design</h2>
          </div>
          <p className="text-slate-700 text-base sm:text-lg leading-relaxed max-w-4xl">
            We recognize that phone conversations are deeply personal. SafeCall AI is engineered with rigorous data boundaries:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="bg-white p-5 rounded-2xl border border-teal-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-base">Ephemeral Processing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Audio is processed in short rolling buffers and immediately discarded after risk signal evaluation.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-teal-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-base">Local Data Ownership</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Call transcripts and contact lists remain on the device under the user's explicit control.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-teal-200/80 space-y-2">
              <h4 className="font-bold text-slate-900 text-base">Transparent Capabilities</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                We clearly disclose web browser limitations vs native companion app integrations for cellular audio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-sm">
          <Heart className="w-8 h-8 fill-teal-600 text-teal-600" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Protecting Your Loved Ones Has Never Been More Essential.
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Join Alekya and thousands of families using SafeCall AI to neutralize conversational manipulation before financial damage occurs.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleStartProtection}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg shadow-lg shadow-teal-600/20 transition-all active:scale-[0.98]"
          >
            Launch Protection Dashboard
          </button>
          <button
            onClick={handleExploreDemo}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg transition-all active:scale-[0.98]"
          >
            Experience Live Scam Simulation
          </button>
        </div>
      </section>
    </div>
  );
};
