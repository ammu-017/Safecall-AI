import {
  CallRecord,
  TrustedContact,
  SecuritySettings,
  AnalyticsData,
  WebSocketMonitorMessage,
} from '../types';
import {
  INITIAL_CALLS,
  INITIAL_CONTACTS,
  INITIAL_SETTINGS,
  INITIAL_ANALYTICS,
} from '../data/mockData';

// API Base configuration from environment variable
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const WS_BASE_URL = API_BASE_URL.replace(/^http/, 'ws');

// Local storage keys for resilient demo persistence
const STORAGE_KEYS = {
  CALLS: 'safecall_calls_v1',
  CONTACTS: 'safecall_contacts_v1',
  SETTINGS: 'safecall_settings_v1',
};

// Internal local state fallback
function getLocalCalls(): CallRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CALLS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return INITIAL_CALLS;
}

function saveLocalCalls(calls: CallRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CALLS, JSON.stringify(calls));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

function getLocalContacts(): TrustedContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return INITIAL_CONTACTS;
}

function saveLocalContacts(contacts: TrustedContact[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

function getLocalSettings(): SecuritySettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return INITIAL_SETTINGS;
}

function saveLocalSettings(settings: SecuritySettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
}

export interface BackendStatus {
  connected: boolean;
  checkedAt: string;
  endpoint: string;
  error?: string;
}

export const apiService = {
  /**
   * Healthcheck to verify if Google Antigravity / FastAPI backend is online
   */
  async checkBackendHealth(): Promise<BackendStatus> {
    const endpoint = `${API_BASE_URL}/api/health`;
    const now = new Date().toLocaleTimeString();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(endpoint, {
        signal: controller.signal,
        method: 'GET',
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        return { connected: true, checkedAt: now, endpoint };
      }
      return { connected: false, checkedAt: now, endpoint, error: `HTTP ${res.status}` };
    } catch {
      return {
        connected: false,
        checkedAt: now,
        endpoint,
        error: 'Backend offline or unreachable (Operating in local Demo Mode)',
      };
    }
  },

  /**
   * POST /api/analyze-audio
   */
  async analyzeAudio(file: File | Blob): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
      const formData = new FormData();
      formData.append('audio', file);
      const res = await fetch(`${API_BASE_URL}/api/analyze-audio`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json };
      }
      throw new Error(`Server returned ${res.status}`);
    } catch (err) {
      console.info('Antigravity backend not reachable, using mock audio analysis adapter');
      return {
        success: true,
        data: {
          analyzed: true,
          signalsDetected: 2,
          riskScore: 78,
          riskLevel: 'high',
          summary: 'Audio sample showed high vocal pressure and urgency anomalies.',
        },
      };
    }
  },

  /**
   * POST /api/analyze-text
   */
  async analyzeText(text: string): Promise<{ success: boolean; data?: unknown }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const json = await res.json();
        return { success: true, data: json };
      }
    } catch {
      // Fallback
    }

    // Mock analysis of text for demo
    const lower = text.toLowerCase();
    const hasUrgency = lower.includes('urgent') || lower.includes('15 minutes') || lower.includes('immediately');
    const hasOtp = lower.includes('otp') || lower.includes('code') || lower.includes('pin');
    const hasArrest = lower.includes('arrest') || lower.includes('police') || lower.includes('cbi');

    let score = 15;
    if (hasUrgency) score += 30;
    if (hasOtp) score += 40;
    if (hasArrest) score += 35;
    score = Math.min(score, 99);

    return {
      success: true,
      data: {
        analyzed: true,
        riskScore: score,
        riskLevel: score > 75 ? 'critical' : score > 50 ? 'high' : 'safe',
      },
    };
  },

  /**
   * GET /api/calls
   */
  async getCalls(): Promise<CallRecord[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/calls`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return getLocalCalls();
  },

  /**
   * GET /api/calls/:id
   */
  async getCallById(id: string): Promise<CallRecord | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/calls/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    const calls = getLocalCalls();
    return calls.find((c) => c.id === id) || null;
  },

  /**
   * DELETE /api/calls/:id
   */
  async deleteCall(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/calls/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {
      // Fallback to local storage
    }
    const calls = getLocalCalls().filter((c) => c.id !== id);
    saveLocalCalls(calls);
    return true;
  },

  /**
   * Save a newly analyzed call record
   */
  async saveCall(call: CallRecord): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(call),
      });
    } catch {
      // Local fallback
    }
    const calls = [call, ...getLocalCalls()];
    saveLocalCalls(calls);
  },

  /**
   * GET /api/analytics
   */
  async getAnalytics(): Promise<AnalyticsData> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return INITIAL_ANALYTICS;
  },

  /**
   * GET /api/contacts
   */
  async getContacts(): Promise<TrustedContact[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }
    return getLocalContacts();
  },

  /**
   * POST /api/contacts
   */
  async createContact(contact: Omit<TrustedContact, 'id' | 'addedAt'>): Promise<TrustedContact> {
    const newContact: TrustedContact = {
      ...contact,
      id: `tc-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local fallback
    }

    const current = getLocalContacts();
    const updated = [newContact, ...current];
    saveLocalContacts(updated);
    return newContact;
  },

  /**
   * PUT /api/contacts/:id
   */
  async updateContact(id: string, updates: Partial<TrustedContact>): Promise<TrustedContact | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Local fallback
    }

    const current = getLocalContacts();
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const updatedContact = { ...current[index], ...updates };
    current[index] = updatedContact;
    saveLocalContacts(current);
    return updatedContact;
  },

  /**
   * DELETE /api/contacts/:id
   */
  async deleteContact(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return true;
    } catch {
      // Local fallback
    }

    const updated = getLocalContacts().filter((c) => c.id !== id);
    saveLocalContacts(updated);
    return true;
  },

  /**
   * GET /api/settings
   */
  async getSettings(): Promise<SecuritySettings> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return getLocalSettings();
  },

  /**
   * PUT /api/settings
   */
  async updateSettings(settings: Partial<SecuritySettings>): Promise<SecuritySettings> {
    const current = getLocalSettings();
    const updated = { ...current, ...settings };
    try {
      await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // Fallback
    }
    saveLocalSettings(updated);
    return updated;
  },

  /**
   * Reset all mock data to clean hackathon demo defaults
   */
  resetAllDemoData(): void {
    localStorage.removeItem(STORAGE_KEYS.CALLS);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};

/**
 * WebSocket client abstraction for live monitoring: ws://localhost:8000/ws/monitor
 */
export class LiveMonitorWebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessageCallback: (msg: WebSocketMonitorMessage) => void;
  private onStatusChangeCallback: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

  constructor(
    onMessage: (msg: WebSocketMonitorMessage) => void,
    onStatusChange: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void,
    customUrl?: string
  ) {
    this.url = customUrl || `${WS_BASE_URL}/ws/monitor`;
    this.onMessageCallback = onMessage;
    this.onStatusChangeCallback = onStatusChange;
  }

  connect() {
    this.onStatusChangeCallback('connecting');
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.onStatusChangeCallback('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data) as WebSocketMonitorMessage;
          this.onMessageCallback(parsed);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      this.ws.onerror = () => {
        this.onStatusChangeCallback('error');
      };

      this.ws.onclose = () => {
        this.onStatusChangeCallback('disconnected');
      };
    } catch {
      this.onStatusChangeCallback('error');
    }
  }

  send(data: Record<string, unknown>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
