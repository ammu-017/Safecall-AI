import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_SCENARIOS } from '../data/mockData';
import {
  DemoScenario,
  TranscriptSegment,
  ManipulationSignal,
  CallRecord,
  RiskLevel,
} from '../types';
import {
  Radio,
  Play,
  Square,
  Upload,
  Mic,
  MicOff,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  FileAudio,
  ArrowRight,
  HelpCircle,
  Save,
  RotateCcw,
} from 'lucide-react';
import { audioAlertService } from '../services/audioAlertService';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

export const LiveMonitorPage: React.FC = () => {
  const { settings, triggerThreatAlert, addCall, addToast } = useApp();
  const navigate = useNavigate();

  // Selected scenario
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DEMO_SCENARIOS[0].id);
  const currentScenario = DEMO_SCENARIOS.find((s) => s.id === selectedScenarioId) || DEMO_SCENARIOS[0];

  // Monitoring session state
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState<'ready' | 'monitoring' | 'threat_detected'>('ready');
  const [audioSource, setAudioSource] = useState<'simulated' | 'microphone' | 'file'>('simulated');
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [micActive, setMicActive] = useState(false);

  // Live progressive data
  const [activeSegments, setActiveSegments] = useState<TranscriptSegment[]>([]);
  const [currentRiskScore, setCurrentRiskScore] = useState<number>(0);
  const [detectedSignals, setDetectedSignals] = useState<ManipulationSignal[]>([]);
  const [riskHistory, setRiskHistory] = useState<Array<{ step: number; score: number }>>([{ step: 0, score: 0 }]);
  const [isProcessingSegment, setIsProcessingSegment] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Mute control
  const [isMuted, setIsMuted] = useState(audioAlertService.isMuted());
  const [savedCallId, setSavedCallId] = useState<string | null>(null);

  // Ref tracking timers
  const timerRef = useRef<number | null>(null);
  const scenarioTimeoutsRef = useRef<number[]>([]);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll transcript to bottom as segments stream in
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSegments, isProcessingSegment]);

  // Handle Elapsed seconds counter
  useEffect(() => {
    if (isMonitoring) {
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isMonitoring]);

  // Clean up all timers and audio when component unmounts or upon logout
  useEffect(() => {
    const handleLogoutEvent = () => {
      clearAllScheduledTimeouts();
      setIsMonitoring(false);
      setIsProcessingSegment(false);
      audioAlertService.stopAlarm();
    };

    window.addEventListener('safecall:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('safecall:logout', handleLogoutEvent);
      clearAllScheduledTimeouts();
      if (timerRef.current) clearInterval(timerRef.current);
      audioAlertService.stopAlarm();
    };
  }, []);

  const clearAllScheduledTimeouts = () => {
    scenarioTimeoutsRef.current.forEach((t) => clearTimeout(t));
    scenarioTimeoutsRef.current = [];
  };

  const getRiskLevelFromScore = (score: number): RiskLevel => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 35) return 'moderate';
    if (score >= 20) return 'low';
    return 'safe';
  };

  // Start Demo Scenario Simulation
  const handleStartDemoCall = (scenarioToRun?: DemoScenario) => {
    const scenario = scenarioToRun || currentScenario;
    clearAllScheduledTimeouts();
    setSavedCallId(null);
    audioAlertService.resetThreatDeduplication();

    // Reset state for new call
    setActiveSegments([]);
    setCurrentRiskScore(0);
    setDetectedSignals([]);
    setRiskHistory([{ step: 0, score: 0 }]);
    setElapsedSeconds(0);
    setIsMonitoring(true);
    setMonitoringStatus('monitoring');
    setIsProcessingSegment(true);

    let accumulatedDelay = 600;
    const accumulatedSignals: ManipulationSignal[] = [];
    const runCallId = `demo-${scenario.id}-${Date.now()}`;

    scenario.segments.forEach((seg, index) => {
      accumulatedDelay += seg.delayMs;

      const tId = window.setTimeout(() => {
        const timestamp = `00:${String(Math.floor((accumulatedDelay / 1000))).padStart(2, '0')}`;
        const newSegment: TranscriptSegment = {
          id: `seg-${Date.now()}-${index}`,
          speaker: seg.speaker,
          text: seg.text,
          timestamp,
          isSuspicious: seg.suspicious,
          detectedSignal: seg.signal,
          riskContribution: seg.incrementalRisk,
        };

        setActiveSegments((prev) => [...prev, newSegment]);
        setCurrentRiskScore(seg.incrementalRisk);
        setRiskHistory((prev) => [...prev, { step: index + 1, score: seg.incrementalRisk }]);

        if (seg.signal) {
          accumulatedSignals.push(seg.signal);
          setDetectedSignals([...accumulatedSignals]);
        }

        // Check if high-risk or critical threshold reached
        if (seg.incrementalRisk >= settings.riskThreshold) {
          setMonitoringStatus('threat_detected');

          // Trigger high risk threat alert with sound buzzer (deduplicated per call/scenario)
          triggerThreatAlert({
            title: `Severe ${seg.signal?.label || 'Scam Pattern'} Intercepted!`,
            message: `SafeCall AI identified conversational manipulation: "${seg.text}". Do NOT share passwords, OTP codes, or send money.`,
            callId: runCallId,
            signals: accumulatedSignals,
            callerName: scenario.callerName,
            callerNumber: scenario.callerNumber,
          });
        }

        // If last segment, conclude processing indicator
        if (index === scenario.segments.length - 1) {
          setIsProcessingSegment(false);
        }
      }, accumulatedDelay);

      scenarioTimeoutsRef.current.push(tId);
    });
  };

  const handleStopMonitoring = () => {
    clearAllScheduledTimeouts();
    setIsMonitoring(false);
    setIsProcessingSegment(false);
    audioAlertService.stopAlarm();
    if (currentRiskScore >= settings.riskThreshold) {
      setMonitoringStatus('threat_detected');
    } else {
      setMonitoringStatus('ready');
    }
  };

  const handleSaveToHistory = async () => {
    if (activeSegments.length === 0) return;

    const callId = `call-sim-${Date.now()}`;
    const level = getRiskLevelFromScore(currentRiskScore);

    const record: CallRecord = {
      id: callId,
      callerName: currentScenario.callerName,
      callerNumber: currentScenario.callerNumber,
      callerLocation: 'Simulation Environment',
      callType: 'simulated',
      date: 'Just now',
      duration: `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`,
      durationSeconds: elapsedSeconds,
      riskScore: currentRiskScore,
      riskLevel: level,
      analysisStatus: level === 'critical' || level === 'high' ? 'flagged' : 'completed',
      manipulationSignals: detectedSignals,
      transcript: activeSegments,
      summary:
        currentScenario.scenarioType === 'scam'
          ? `High-risk scenario: ${currentScenario.title}. Caller exhibited severe urgency, extortion, or OTP phishing patterns.`
          : `Legitimate call verified: ${currentScenario.title}. Conversation contained standard verified protocols with no fraud markers.`,
      recommendedActions:
        currentScenario.scenarioType === 'scam'
          ? [
              'Do not send money or share one-time authentication codes.',
              'Hang up immediately and notify trusted family contacts.',
              'Verify official support lines on the company website.',
            ]
          : [
              'Call is safe and requires no defensive countermeasures.',
              'Standard verified contact logged.',
            ],
      isDemo: true,
    };

    await addCall(record);
    setSavedCallId(callId);
    addToast('Simulation Saved', 'Call analysis logged to Forensic Call History.', 'success');
  };

  // Toggle Mute
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioAlertService.setMuted(next);
  };

  // Handle Mic Permission
  const handleToggleMic = async () => {
    if (micActive) {
      setMicActive(false);
      setAudioSource('simulated');
      addToast('Microphone Deactivated', 'Switched back to simulated scenario generator.', 'info');
      return;
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicPermission(true);
        setMicActive(true);
        setAudioSource('microphone');
        addToast('Microphone Active', 'Listening for speech input. Transcribing spoken test phrases...', 'success');
        // Stop stream track when done
        stream.getTracks().forEach((track) => track.stop());
      } else {
        addToast('Microphone Unavailable', 'Browser media devices not accessible.', 'warning');
      }
    } catch {
      addToast('Microphone Permission Denied', 'Running in simulated scenario mode.', 'warning');
    }
  };

  // Handle Audio File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioSource('file');
    addToast('Uploading Audio', `Sending "${file.name}" to SafeCall analysis engine...`, 'info');

    const result = await apiService.analyzeAudio(file);
    if (result.success) {
      handleStartDemoCall(DEMO_SCENARIOS[0]);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const currentRiskLevel = getRiskLevelFromScore(currentRiskScore);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* TOP HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Live Call Protection
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1.5 ${
                monitoringStatus === 'threat_detected'
                  ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                  : isMonitoring
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  monitoringStatus === 'threat_detected'
                    ? 'bg-red-600'
                    : isMonitoring
                    ? 'bg-emerald-500 animate-ping'
                    : 'bg-slate-400'
                }`}
              />
              <span>
                {monitoringStatus === 'threat_detected'
                  ? 'Threat Detected'
                  : isMonitoring
                  ? 'Actively Monitoring'
                  : 'Ready'}
              </span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time conversational manipulation & psychological pressure detection
          </p>
        </div>

        {/* Audio Mute & Timer Controls */}
        <div className="flex items-center space-x-3">
          <div className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Elapsed: {formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition-colors ${
              isMuted
                ? 'bg-amber-50 text-amber-700 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title={isMuted ? 'Warning Buzzer Muted' : 'Warning Buzzer Enabled'}
            aria-label="Sound alert toggle"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-amber-600" /> : <Volume2 className="w-5 h-5 text-teal-600" />}
          </button>
        </div>
      </div>

      {/* AUDIO SOURCE & SCENARIO CONTROLS */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                Audio Input Source
              </span>
              <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {audioSource === 'simulated'
                  ? 'Demo Scenario Stream'
                  : audioSource === 'microphone'
                  ? 'Live Microphone Input'
                  : 'Uploaded Audio File'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Select an adversarial scam or legitimate scenario to test real-time AI classification.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!isMonitoring ? (
              <button
                id="live-start-demo-btn"
                onClick={() => handleStartDemoCall()}
                className="py-2.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start Demo Scenario</span>
              </button>
            ) : (
              <button
                id="live-stop-monitoring-btn"
                onClick={handleStopMonitoring}
                className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all active:scale-[0.98]"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Monitoring</span>
              </button>
            )}

            <button
              onClick={handleToggleMic}
              className={`py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-colors ${
                micActive
                  ? 'bg-red-600/30 border-red-500 text-red-200'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {micActive ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-teal-400" />}
              <span>{micActive ? 'Mute Mic' : 'Use Mic'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Upload Audio Sample</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Demo Scenario Selector Tabs */}
        <div className="pt-2 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-2.5">
            Preloaded Test Scenarios:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {DEMO_SCENARIOS.map((scen) => {
              const isSelected = scen.id === selectedScenarioId;
              const isScam = scen.scenarioType === 'scam';
              return (
                <button
                  key={scen.id}
                  onClick={() => {
                    setSelectedScenarioId(scen.id);
                    if (isMonitoring) {
                      handleStartDemoCall(scen);
                    }
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-teal-400 shadow-md ring-1 ring-teal-400/40 text-white'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        isScam ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {isScam ? 'Scam Threat' : 'Safe Verification'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {scen.expectedFinalScore}/100
                    </span>
                  </div>
                  <div className="font-bold text-xs truncate">{scen.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Waveform Visualization */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Radio className={`w-5 h-5 ${isMonitoring ? 'text-teal-400 animate-pulse' : 'text-slate-600'}`} />
            <div className="text-xs">
              <span className="font-bold text-slate-200">
                {isMonitoring ? 'Analyzing Audio Spectrum' : 'Spectrogram Standby'}
              </span>
              <span className="text-slate-500 block text-[11px]">
                Caller: {currentScenario.callerName} ({currentScenario.callerNumber})
              </span>
            </div>
          </div>

          {/* Animated equalizer bars */}
          <div className="flex items-center space-x-1.5 h-10 px-4">
            {[40, 65, 30, 85, 55, 95, 45, 75, 60, 35, 80, 50].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isMonitoring
                    ? currentRiskScore > 75
                      ? 'bg-red-500'
                      : 'bg-teal-400'
                    : 'bg-slate-800'
                }`}
                style={{
                  height: isMonitoring ? `${Math.max(8, (h * (currentRiskScore > 50 ? 1.2 : 0.8)) % 38)}px` : '8px',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: TRANSCRIPT & RISK ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Streaming Transcript (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-800">Live Conversational Transcript</span>
              <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-2 py-0.5 rounded">
                {activeSegments.length} Segments
              </span>
            </div>
            {isProcessingSegment && (
              <span className="text-xs text-teal-600 font-semibold flex items-center space-x-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                <span>Evaluating intent...</span>
              </span>
            )}
          </div>

          {/* Transcript Content List */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {activeSegments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                <Radio className="w-10 h-10 text-slate-300" />
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">Transcript Stream Ready</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1">
                    Click <strong>"Start Demo Scenario"</strong> above to observe real-time speech transcription and scam risk categorization.
                  </p>
                </div>
              </div>
            ) : (
              activeSegments.map((seg) => (
                <div
                  key={seg.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    seg.isSuspicious
                      ? 'bg-red-50/70 border-red-200 shadow-xs'
                      : seg.speaker === 'Caller'
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-teal-50/40 border-teal-200 ml-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={`font-bold ${
                        seg.speaker === 'Caller' ? 'text-slate-900' : 'text-teal-900'
                      }`}
                    >
                      {seg.speaker === 'Caller' ? currentScenario.callerName : 'Protected Senior (User)'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">{seg.timestamp}</span>
                  </div>

                  <p
                    className={`text-sm leading-relaxed ${
                      seg.isSuspicious ? 'text-red-950 font-medium' : 'text-slate-700'
                    }`}
                  >
                    {seg.text}
                  </p>

                  {/* Manipulation Signal pill next to segment */}
                  {seg.detectedSignal && (
                    <div className="mt-2.5 pt-2 border-t border-red-200/80 flex items-start space-x-2 text-xs text-red-800">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold uppercase tracking-wider text-[10px] bg-red-200/60 px-1.5 py-0.5 rounded text-red-900 mr-1.5">
                          Signal Flagged
                        </span>
                        <strong className="text-red-950">{seg.detectedSignal.label}:</strong>{' '}
                        <span>{seg.detectedSignal.description}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            <div ref={transcriptBottomRef} />
          </div>

          {/* Bottom Save & Report Bar */}
          {activeSegments.length > 0 && (
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Simulation concluded • {activeSegments.length} exchanges evaluated
              </span>
              <div className="flex items-center space-x-2">
                {savedCallId ? (
                  <button
                    onClick={() => navigate(`/call-details/${savedCallId}`)}
                    className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-500 transition-colors"
                  >
                    Open Forensic Report →
                  </button>
                ) : (
                  <button
                    onClick={handleSaveToHistory}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to History</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Risk Analysis & Manipulation Signals (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Risk Meter Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Dynamic Risk Score Meter</h3>
              <span className="text-xs text-slate-400 font-mono">0 – 100 Index</span>
            </div>

            {/* Visual Risk Gauge */}
            <div className="relative pt-2">
              <div className="flex items-end justify-between mb-1.5">
                <span
                  className={`text-4xl font-black transition-colors ${
                    currentRiskScore >= 80
                      ? 'text-red-600'
                      : currentRiskScore >= 60
                      ? 'text-amber-600'
                      : 'text-teal-600'
                  }`}
                >
                  {currentRiskScore}
                  <span className="text-lg font-normal text-slate-400">/100</span>
                </span>
                <span
                  className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                    currentRiskLevel === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : currentRiskLevel === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentRiskLevel} Risk
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentRiskScore >= 80
                      ? 'bg-red-600'
                      : currentRiskScore >= 60
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(4, currentRiskScore))}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-1">
                <span>0 Safe</span>
                <span>40 Moderate</span>
                <span>70 Threshold</span>
                <span>100 Critical</span>
              </div>
            </div>

            {/* Contextual assessment statement */}
            <div
              className={`p-3 rounded-xl text-xs leading-relaxed border ${
                currentRiskScore >= 70
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {currentRiskScore >= 70 ? (
                <div className="space-y-1">
                  <div className="font-bold flex items-center space-x-1 text-red-700">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Scam Manipulation Detected:</span>
                  </div>
                  <p>
                    Caller is actively using artificial urgency or credentials theft techniques. Advise senior to hang up immediately.
                  </p>
                </div>
              ) : currentScenario.scenarioType === 'legitimate' ? (
                <div className="space-y-1">
                  <div className="font-bold flex items-center space-x-1 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Safe Conversation Context:</span>
                  </div>
                  <p>
                    Urgent medical or verification cues are framed securely without financial extraction or isolation demands.
                  </p>
                </div>
              ) : (
                <p>
                  System is listening for predatory pressure markers, OTP theft, and spoofed government authority.
                </p>
              )}
            </div>
          </div>

          {/* Detected Signals List */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Detected Threat Patterns</h3>
              <span className="text-xs text-slate-500">{detectedSignals.length} Active</span>
            </div>

            {detectedSignals.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
                No scam signals flagged yet in this conversation.
              </div>
            ) : (
              <div className="space-y-2.5">
                {detectedSignals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-red-50/80 border border-red-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-950">{sig.label}</span>
                      <span className="text-[10px] font-bold uppercase text-red-700 bg-red-200/60 px-1.5 py-0.5 rounded">
                        {sig.severity}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-snug">{sig.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DISCLAIMER FOOTNOTE */}
      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Audio Access Notice:</strong> Demo Mode simulates live conversational streams using pre-transcribed audio sequences. Real-world cellular-call audio requires a native companion application with telecommunication call-recording permissions.
        </div>
      </div>
    </div>
  );
};
