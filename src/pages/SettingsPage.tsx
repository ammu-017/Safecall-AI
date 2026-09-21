import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Sliders,
  Eye,
  Volume2,
  Lock,
  Server,
  Trash2,
  Save,
  RotateCcw,
  CheckCircle2,
  Info,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { BackendStatusBadge } from '../components/BackendStatusBadge';
import { apiService } from '../services/apiService';
import { audioAlertService } from '../services/audioAlertService';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetAllDemoData, addToast } = useApp();

  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingBackend, setIsTestingBackend] = useState(false);

  const handleSensitivityChange = (val: number) => {
    setLocalSettings((prev) => ({ ...prev, riskThreshold: val }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    await updateSettings(localSettings);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Settings Saved', 'Preferences and accessibility profiles updated.', 'success');
    }, 400);
  };

  const handleTestBackend = async () => {
    setIsTestingBackend(true);
    const health = await apiService.checkBackendHealth();
    setIsTestingBackend(false);

    if (health.connected) {
      addToast('Backend Connected', `FastAPI online (${health.endpoint}).`, 'success');
    } else {
      addToast(
        'Demo Mode Fallback Active',
        'Backend service unreachable at specified URL. Using client-side mock engine.',
        'info'
      );
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo call logs, trusted contacts, and restored initial state?')) {
      resetAllDemoData();
      setLocalSettings({ ...settings });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            System & Accessibility Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure scam detection sensitivity, senior accessibility modes, and backend APIs
          </p>
        </div>

        <button
          id="settings-save-top-btn"
          onClick={() => handleSave()}
          disabled={isSaving}
          className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. GENERAL DETECTION SETTINGS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-teal-600" />
            <span>Core Scam Detection Parameters</span>
          </div>

          {/* Toggle Active Monitoring */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Background Scam Shield</div>
              <div className="text-[11px] text-slate-500">
                Analyze speech audio for deceptive extortion patterns
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.monitoringEnabled}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, monitoringEnabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          {/* Sensitivity Slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Intervention Sensitivity</span>
              <span className="font-mono text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Threshold: {localSettings.riskThreshold}/100
              </span>
            </div>

            <input
              type="range"
              min="40"
              max="90"
              step="5"
              value={localSettings.riskThreshold}
              onChange={(e) => handleSensitivityChange(Number(e.target.value))}
              className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Strict (40)</span>
              <span>Balanced (70)</span>
              <span>Cautious (90)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Calls scoring above {localSettings.riskThreshold} will immediately trigger the visual red alarm and sound buzzer.
            </p>
          </div>

          {/* Emergency Alert Dispatch Toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <div className="text-xs font-bold text-slate-900">Notify Trusted Family Contacts</div>
              <div className="text-[11px] text-slate-500">
                Dispatch immediate SMS to children or caregivers on critical threats
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.autoAlertFamily}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, autoAlertFamily: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>
        </div>

        {/* 2. ACCESSIBILITY & SENIOR VISUAL MODES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
            <Eye className="w-5 h-5 text-teal-600" />
            <span>Senior Usability & Accessibility</span>
          </div>

          {/* Large Text Mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Large Text Mode (+18%)</div>
              <div className="text-[11px] text-slate-500">
                Increases baseline typography and button sizes for effortless reading
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.largeTextMode}
                onChange={(e) => {
                  const updated = { ...localSettings, largeTextMode: e.target.checked };
                  setLocalSettings(updated);
                  updateSettings(updated);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          {/* High Contrast Mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">High Contrast Palette</div>
              <div className="text-[11px] text-slate-500">
                Enhances boundary borders and text contrast for seniors with low vision
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.highContrastMode}
                onChange={(e) => {
                  const updated = { ...localSettings, highContrastMode: e.target.checked };
                  setLocalSettings(updated);
                  updateSettings(updated);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          {/* Calm Visuals / Reduced Motion */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Calm Visuals (Reduced Motion)</div>
              <div className="text-[11px] text-slate-500">
                Disables animated pulses and flickering effects to reduce eye strain
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.reducedMotion}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, reducedMotion: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          {/* Spoken Voice Warnings */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900">Spoken Voice Advice during Threats</div>
              <div className="text-[11px] text-slate-500">
                Gentle spoken audio advice ("Hang up the phone, do not send money") for vision-impaired users
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.voiceWarningEnabled}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, voiceWarningEnabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
            </label>
          </div>

          {/* Sound Alerts / Buzzer */}
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900">High-Risk Audio Alarm Chime</div>
                <div className="text-[11px] text-slate-500">
                  Auditory buzzer fires once when critical scam manipulation is verified
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  id="settings-buzzer-toggle"
                  type="checkbox"
                  checked={localSettings.buzzerEnabled}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, buzzerEnabled: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
              </label>
            </div>

            {/* Volume slider & Test Sound button */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Alert Sound Volume</span>
                  <span className="font-mono text-teal-700">{localSettings.alertVolume}%</span>
                </div>
                <input
                  id="settings-volume-slider"
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={localSettings.alertVolume}
                  onChange={(e) =>
                    setLocalSettings({ ...localSettings, alertVolume: Number(e.target.value) })
                  }
                  className="w-full accent-teal-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <button
                id="settings-test-sound-btn"
                type="button"
                onClick={() => {
                  audioAlertService.playTestSound(localSettings.alertVolume);
                  addToast('Sound Chime Tested', `Played test alert tone at ${localSettings.alertVolume}% volume.`, 'info');
                }}
                className="py-2 px-3.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors shrink-0 shadow-xs"
              >
                <Volume2 className="w-4 h-4 text-teal-600" />
                <span>Test Sound</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. PRIVACY & DATA RETENTION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-base pb-2 border-b border-slate-100">
            <Lock className="w-5 h-5 text-teal-600" />
            <span>Privacy & Ephemeral Retention</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Transcript Storage Policy
            </label>
            <select
              value={localSettings.transcriptRetention}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  transcriptRetention: e.target.value as 'local_only' | 'encrypted_cloud' | 'none',
                })
              }
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-white"
            >
              <option value="local_only">Local Device Only (Highest Privacy)</option>
              <option value="encrypted_cloud">Encrypted Cloud Backup</option>
              <option value="none">Zero Retention (Delete Immediately)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-900">Zero Raw Audio Storage</div>
            <p className="text-[11px] leading-relaxed">
              SafeCall AI evaluates audio streams in RAM. We never record or retain raw phone conversation audio files.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleResetData}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Demo State to Default</span>
            </button>
          </div>
        </div>

        {/* 4. FASTAPI BACKEND CONFIGURATION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2.5 text-slate-900 font-bold text-base">
              <Server className="w-5 h-5 text-teal-600" />
              <span>FastAPI AI Integration</span>
            </div>
            <BackendStatusBadge />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              API Base URL
            </label>
            <input
              type="text"
              value={localSettings.apiBaseUrl}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, apiBaseUrl: e.target.value })
              }
              placeholder="http://localhost:8000"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Target FastAPI server endpoint developed with Google Antigravity
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              WebSocket Streaming URL
            </label>
            <input
              type="text"
              value={localSettings.wsUrl}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, wsUrl: e.target.value })
              }
              placeholder="ws://localhost:8000/ws/call-stream"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-mono text-slate-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              onClick={handleTestBackend}
              disabled={isTestingBackend}
              className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <Radio className="w-3.5 h-3.5 text-teal-400" />
              <span>{isTestingBackend ? 'Testing Connection...' : 'Test Backend Ping'}</span>
            </button>

            <button
              onClick={() => handleSave()}
              className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-colors"
            >
              Apply URLs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
