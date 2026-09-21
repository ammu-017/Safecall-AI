/**
 * Web Audio API synthesizer for high-risk scam threat alerts.
 * Generates an authoritative, distinct cyber-protection alert tone
 * without relying on external media files.
 */

let audioCtx: AudioContext | null = null;
let currentAlarmTimeout: number | null = null;
let isMuted = false;
let lastPlayedThreatId: string | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (err) {
    console.warn('AudioContext not available or blocked by browser policy:', err);
    return null;
  }
}

export const audioAlertService = {
  setMuted(muted: boolean) {
    isMuted = muted;
    if (muted) {
      this.stopAlarm();
    }
  },

  isMuted() {
    return isMuted;
  },

  resetThreatDeduplication() {
    lastPlayedThreatId = null;
  },

  playHighRiskBuzzer(threatEventId: string, volumePercent: number = 80) {
    // Prevent buzzer if muted
    if (isMuted) return;

    // Prevent repeated buzzer playback for the exact same threat event ID
    if (lastPlayedThreatId === threatEventId) {
      return;
    }
    lastPlayedThreatId = threatEventId;

    const ctx = getAudioContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    const volume = Math.max(0.05, Math.min(1.0, (volumePercent / 100) * 0.45));
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Dual-tone urgent security chime pattern: 2 pulses (Beep-Beep ... Beep-Beep)
    const playPulse = (startDelay: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startDelay);

      // Low-pass filter for warmer, healthcare-appropriate sound
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime + startDelay);

      gain.gain.setValueAtTime(0, ctx.currentTime + startDelay);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startDelay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + 0.28);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(ctx.currentTime + startDelay);
      osc.stop(ctx.currentTime + startDelay + 0.3);
    };

    // Tone 1
    playPulse(0.0, 587.33); // D5
    playPulse(0.12, 880);   // A5

    // Tone 2
    playPulse(0.4, 587.33);
    playPulse(0.52, 880);
  },

  stopAlarm() {
    if (currentAlarmTimeout) {
      window.clearTimeout(currentAlarmTimeout);
      currentAlarmTimeout = null;
    }
  },

  playTestSound(volumePercent: number = 80) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    const volume = Math.max(0.05, Math.min(1.0, (volumePercent / 100) * 0.4));
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Single pleasant confirmation chime for settings test
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.38);
  },
};
