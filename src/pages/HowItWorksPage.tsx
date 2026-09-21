import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Radio,
  Cpu,
  Lock,
  PhoneCall,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Eye,
  Server,
  Sparkles,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why can’t we rely solely on Truecaller or caller-ID databases?',
      a: 'Modern fraud syndicates use VoIP gateway spoofing and churn through thousands of fresh virtual phone numbers hourly. By the time a number is flagged on spam databases, hundreds of seniors have already been extorted. SafeCall AI analyzes the actual conversational semantics in real time, detecting manipulation regardless of which number appears on caller ID.',
    },
    {
      q: 'How does SafeCall AI avoid falsely alarming on real hospital emergencies?',
      a: 'Legitimate medical and police calls ask you to visit an in-person facility, encourage family presence, and explicitly do not demand emergency cryptocurrency transfers, gift cards, or phone OTPs. SafeCall AI’s dual-intent classifier contextualizes urgency, so genuine hospital notices remain safe while extortion attempts trigger intervention.',
    },
    {
      q: 'Does SafeCall AI record or store private phone calls?',
      a: 'No. SafeCall AI is built upon an ephemeral processing architecture. Audio frames are converted to temporary embeddings in volatile memory, evaluated for manipulation signals, and immediately discarded. No raw audio files are stored or sent to remote servers.',
    },
    {
      q: 'How does browser-based testing compare to the native production app?',
      a: 'Because web browsers do not have operating system permissions to intercept cellular telephony, this web application serves as the command center and live test simulator. The production architecture pairs this dashboard with a native Android/iOS companion daemon that streams audio tokens to our Python FastAPI/Google Antigravity engine.',
    },
    {
      q: 'What happens when a high-risk scam call is detected?',
      a: 'The senior’s device immediately turns red with an unmissable warning stating: "DO NOT SHARE OTP OR TRANSFER MONEY". An audible chime sounds, and designated trusted contacts (such as adult children or caregivers) receive an automated SMS alert with caller details.',
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-200">
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Next-Generation Scam Defense</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
          How SafeCall AI Works
        </h1>
        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          Explore the multi-layered conversational intelligence pipeline built with Google Antigravity & FastAPI to protect elderly users from financial manipulation.
        </p>
      </div>

      {/* PIPELINE ARCHITECTURE VISUALIZATION */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Real-Time Processing Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            From Audio Waveform to Protective Intervention
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            How streaming speech is safely transcribed, evaluated, and scored within sub-second latency
          </p>
        </div>

        {/* 5-Stage Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '1',
              title: 'Audio Capture',
              tech: 'PCM Streaming',
              desc: 'Continuous short 3-second rolling audio chunks captured from speaker/mic.',
              icon: PhoneCall,
            },
            {
              step: '2',
              title: 'Live STT',
              tech: 'Streaming ASR',
              desc: 'Converts conversational audio to text transcript with micro-latency.',
              icon: Radio,
            },
            {
              step: '3',
              title: 'Semantic NLP',
              tech: 'Antigravity LLM',
              desc: 'Analyzes conversational intent, psychological pressure, and deceptive scripts.',
              icon: Cpu,
            },
            {
              step: '4',
              title: 'Risk Fusion',
              tech: 'Multi-Signal Engine',
              desc: 'Calculates dynamic threat score (0–100) combining urgency, OTP, & authority.',
              icon: Zap,
            },
            {
              step: '5',
              title: 'Intervention',
              tech: 'Audio & SMS Relay',
              desc: 'Triggers visual red alarm, sound alert, and notifies trusted family members.',
              icon: ShieldAlert,
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-slate-50 p-5 rounded-2xl border border-slate-200 hover:border-teal-500 transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-black text-slate-300 font-mono">0{item.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                  <span className="text-[10px] font-mono text-teal-600 block">{item.tech}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FASTAPI & ANTIGRAVITY BACKEND INTEGRATION ARCHITECTURE */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Backend Integration Ready
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Python FastAPI & Google Antigravity Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered with clean REST and WebSocket interfaces ready for local or cloud deployment
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 text-teal-400 px-3 py-1.5 rounded-xl self-start">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>FastAPI v0.110+ Ready</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-mono font-bold text-teal-700 bg-teal-100/60 px-2 py-1 rounded-md inline-block">
              POST /api/analyze/chunk
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Real-Time Chunk Analysis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accepts streaming PCM audio or Whisper text tokens. Analyzes manipulation signals, returns conversational risk score (0-100), and flags urgency markers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-mono font-bold text-purple-700 bg-purple-100/60 px-2 py-1 rounded-md inline-block">
              WS /ws/monitor/{'{call_id}'}
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Bi-directional Live Stream</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Streams continuous transcript segments, real-time risk trajectory updates, and emits immediate <code className="text-purple-800 font-mono">threat_detected</code> alerts when extortion patterns emerge.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-mono font-bold text-amber-700 bg-amber-100/60 px-2 py-1 rounded-md inline-block">
              POST /api/alerts/notify
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Autonomous Caregiver Alerts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dispatches SMS warnings via Twilio or webhook to configured trusted family contacts with call origin, timestamp, and protective steps.
            </p>
          </div>
        </div>
      </div>

      {/* WHY NUMBER-BASED BLOCKING FAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-red-50/70 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-red-700 font-bold text-lg">
            <ShieldAlert className="w-6 h-6 shrink-0" />
            <h2>The Flaw in Traditional Spam Blockers</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Conventional apps (e.g., Truecaller) match caller IDs against crowd-reported databases. Criminals easily bypass this:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li><strong>VoIP Caller ID Spoofing:</strong> Displays legitimate local bank branches or police station numbers.</li>
            <li><strong>Burner Rotation:</strong> Numbers are discarded every 30 minutes, before community reports accumulate.</li>
            <li><strong>Targeted Isolation:</strong> Once connected, scammers persuade seniors to keep the call secret.</li>
          </ul>
        </div>

        <div className="bg-teal-50/70 border border-teal-200 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-teal-800 font-bold text-lg">
            <ShieldCheck className="w-6 h-6 shrink-0" />
            <h2>The SafeCall AI Content Advantage</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            SafeCall AI doesn't care who the caller claims to be. It evaluates what they actually ask the senior to do:
          </p>
          <ul className="space-y-2 text-xs text-slate-700 list-disc list-inside">
            <li><strong>Language Intent Analysis:</strong> Detects coercive urgency phrases and fake legal sanctions.</li>
            <li><strong>Credential Phishing Traps:</strong> Flags requests for SMS OTPs, UPI PINs, or wire transfers.</li>
            <li><strong>Autonomous Family Safeguard:</strong> Automatically texts loved ones before funds leave the bank.</li>
          </ul>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS ACCORDION */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className="py-4">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base hover:text-teal-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-teal-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed pr-8">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4">
        <h3 className="text-2xl font-black">Experience Real-Time AI Detection</h3>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Test SafeCall AI with 5 preset adversarial attack and legitimate medical scenarios right in your browser.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('/live-monitor')}
            className="py-3 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm inline-flex items-center space-x-2 transition-all shadow-md active:scale-[0.98]"
          >
            <Radio className="w-4 h-4 text-slate-950" />
            <span>Launch Live Call Monitor Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
