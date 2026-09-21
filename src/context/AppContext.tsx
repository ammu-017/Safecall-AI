import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CallRecord,
  TrustedContact,
  SecuritySettings,
  ManipulationSignal,
  UserProfile,
  GuardianInfo,
  RegisteredAccount,
} from '../types';
import { INITIAL_SETTINGS, INITIAL_CALLS, INITIAL_CONTACTS } from '../data/mockData';
import { apiService, BackendStatus } from '../services/apiService';
import { audioAlertService } from '../services/audioAlertService';
import {
  DEFAULT_SEED_ACCOUNT,
  getRegisteredAccounts,
  saveRegisteredAccount,
  setLastActiveAccountId,
  findAccountByCredential,
  contactsToGuardians,
} from '../services/accountService';

interface ThreatAlertPayload {
  title: string;
  message: string;
  callId?: string;
  signals: ManipulationSignal[];
  callerName?: string;
  callerNumber?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
}

interface AppContextType {
  user: UserProfile | null;
  currentGuardians: GuardianInfo[];
  isAuthenticated: boolean;
  demoMode: boolean;
  backendStatus: BackendStatus;
  isCheckingBackend: boolean;
  checkBackendHealth: () => Promise<void>;
  login: (credential?: string, password?: string) => boolean;
  signup: (accountData: {
    name: string;
    email: string;
    phone?: string;
    guardianName?: string;
    guardianRelation?: string;
    guardianPhone?: string;
    password?: string;
  }) => void;
  logout: () => void;
  enterDemoMode: (accountId?: string) => void;
  switchAccount: () => void;
  calls: CallRecord[];
  refreshCalls: () => Promise<void>;
  addCall: (call: CallRecord) => Promise<void>;
  deleteCall: (id: string) => Promise<void>;
  contacts: TrustedContact[];
  refreshContacts: () => Promise<void>;
  addContact: (contact: Omit<TrustedContact, 'id' | 'addedAt'>) => Promise<TrustedContact>;
  updateContact: (id: string, updates: Partial<TrustedContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  settings: SecuritySettings;
  updateSettings: (newSettings: Partial<SecuritySettings>) => Promise<void>;
  activeThreatModal: ThreatAlertPayload | null;
  triggerThreatAlert: (payload: ThreatAlertPayload) => void;
  dismissThreatAlert: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  testFamilyNotification: (contact: TrustedContact) => void;
  resetAllDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_USER: UserProfile = DEFAULT_SEED_ACCOUNT.user;


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState<RegisteredAccount | null>(() => {
    try {
      const auth = localStorage.getItem('safecall_auth');
      const accounts = getRegisteredAccounts();
      const lastId = localStorage.getItem('safecall_last_account_id');
      if (lastId) {
        const found = accounts.find((a) => a.id === lastId);
        if (found) return found;
      }
      return accounts[0] || DEFAULT_SEED_ACCOUNT;
    } catch {
      return DEFAULT_SEED_ACCOUNT;
    }
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const auth = localStorage.getItem('safecall_auth');
      if (auth !== 'true') return null;
      const saved = localStorage.getItem('safecall_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return null;
    }
  });

  const [currentGuardians, setCurrentGuardians] = useState<GuardianInfo[]>(() => {
    return currentAccount?.guardians || DEFAULT_SEED_ACCOUNT.guardians;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('safecall_auth') === 'true';
  });

  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [calls, setCalls] = useState<CallRecord[]>(() => {
    try {
      const raw = localStorage.getItem('safecall_calls_v1');
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_CALLS;
  });
  const [contacts, setContacts] = useState<TrustedContact[]>(() => {
    try {
      const raw = localStorage.getItem('safecall_contacts_v1');
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_CONTACTS;
  });
  const [settings, setSettings] = useState<SecuritySettings>(() => {
    try {
      const raw = localStorage.getItem('safecall_settings_v1');
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_SETTINGS;
  });
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    connected: false,
    checkedAt: 'Initial Check',
    endpoint: 'http://localhost:8000',
  });
  const [isCheckingBackend, setIsCheckingBackend] = useState<boolean>(false);
  const [activeThreatModal, setActiveThreatModal] = useState<ThreatAlertPayload | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply visual accessibility modes to the document body
  useEffect(() => {
    if (settings?.largeTextMode) {
      document.body.classList.add('large-text-mode');
    } else {
      document.body.classList.remove('large-text-mode');
    }

    if (settings?.highContrastMode) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [settings?.largeTextMode, settings?.highContrastMode]);

  // Load initial data
  const refreshCalls = useCallback(async () => {
    const data = await apiService.getCalls();
    setCalls(data);
  }, []);

  const refreshContacts = useCallback(async () => {
    const data = await apiService.getContacts();
    setContacts(data);
  }, []);

  const refreshSettings = useCallback(async () => {
    const data = await apiService.getSettings();
    setSettings(data);
  }, []);

  const checkBackendHealth = useCallback(async () => {
    setIsCheckingBackend(true);
    const status = await apiService.checkBackendHealth();
    setBackendStatus(status);
    setIsCheckingBackend(false);
  }, []);

  useEffect(() => {
    refreshCalls();
    refreshContacts();
    refreshSettings();
    checkBackendHealth();
  }, [refreshCalls, refreshContacts, refreshSettings, checkBackendHealth]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const login = (credential?: string, password?: string): boolean => {
    const cred = (credential || '').trim();
    let accountToLogin: RegisteredAccount | null = null;

    if (cred) {
      accountToLogin = findAccountByCredential(cred);
    } else if (currentAccount) {
      accountToLogin = currentAccount;
    } else {
      accountToLogin = DEFAULT_SEED_ACCOUNT;
    }

    if (!accountToLogin) {
      // If no existing account matches, check if it's a valid email format
      if (cred.includes('@')) {
        accountToLogin = {
          id: `acc-${Date.now()}`,
          user: {
            name: cred.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
            email: cred,
            phone: '+1 (555) 749-3011',
            isDemoUser: true,
            protectedSince: 'Recently',
            accountStatus: 'verified',
          },
          guardians: DEFAULT_SEED_ACCOUNT.guardians,
          passwordHash: password || 'ProtectionPass123!',
        };
        saveRegisteredAccount(accountToLogin);
      } else {
        return false;
      }
    }

    // Optional password verification
    if (password && accountToLogin.passwordHash && accountToLogin.passwordHash !== password) {
      return false;
    }

    // Persist login state
    setUser(accountToLogin.user);
    setCurrentAccount(accountToLogin);
    setCurrentGuardians(accountToLogin.guardians);
    setIsAuthenticated(true);
    setLastActiveAccountId(accountToLogin.id);

    try {
      localStorage.setItem('safecall_user', JSON.stringify(accountToLogin.user));
      localStorage.setItem('safecall_auth', 'true');
    } catch {}

    addToast(`Welcome back, ${accountToLogin.user.name}`, 'Protection shields are fully active.', 'success');
    return true;
  };

  const signup = (accountData: {
    name: string;
    email: string;
    phone?: string;
    guardianName?: string;
    guardianRelation?: string;
    guardianPhone?: string;
    password?: string;
  }) => {
    const guardians: GuardianInfo[] = [];

    if (accountData.guardianName) {
      guardians.push({
        name: accountData.guardianName,
        relationship: accountData.guardianRelation || 'Family Guardian',
        phoneNumber: accountData.guardianPhone || '+1 (555) 382-9104',
        email: 'guardian@familyconnect.net',
        notifyOnHighRisk: true,
        alertStatus: 'Active Standing Guard',
        isSecondary: false,
      });
    } else {
      guardians.push(...DEFAULT_SEED_ACCOUNT.guardians);
    }

    const newUser: UserProfile = {
      name: accountData.name,
      email: accountData.email,
      phone: accountData.phone || '+1 (555) 749-3011',
      isDemoUser: true,
      protectedSince: 'Just now',
      accountStatus: 'verified',
    };

    const newAccount: RegisteredAccount = {
      id: `acc-${Date.now()}`,
      user: newUser,
      guardians,
      passwordHash: accountData.password || 'SeniorGuard2026!',
    };

    // Save in accounts registry
    saveRegisteredAccount(newAccount);
    setLastActiveAccountId(newAccount.id);

    // Sync in app state
    setUser(newUser);
    setCurrentAccount(newAccount);
    setCurrentGuardians(guardians);
    setIsAuthenticated(true);

    try {
      localStorage.setItem('safecall_user', JSON.stringify(newUser));
      localStorage.setItem('safecall_auth', 'true');
    } catch {}

    addToast('Account Created', 'SafeCall AI protection is now standing guard.', 'success');
  };

  const enterDemoMode = (accountId?: string) => {
    const accounts = getRegisteredAccounts();
    const target = (accountId ? accounts.find((a) => a.id === accountId) : null) || DEFAULT_SEED_ACCOUNT;
    
    setUser(target.user);
    setCurrentAccount(target);
    setCurrentGuardians(target.guardians);
    setIsAuthenticated(true);
    setDemoMode(true);
    setLastActiveAccountId(target.id);

    try {
      localStorage.setItem('safecall_user', JSON.stringify(target.user));
      localStorage.setItem('safecall_auth', 'true');
    } catch {}

    addToast('Demo Mode Enabled', `Exploring SafeCall AI as ${target.user.name}.`, 'info');
  };

  const switchAccount = () => {
    setLastActiveAccountId(null);
    setCurrentAccount(null);
    logout();
  };

  const logout = () => {
    // 1. Immediately terminate any active alarms and audio sirens
    audioAlertService.stopAlarm();
    audioAlertService.resetThreatDeduplication();

    // 2. Dismiss any active modal threats
    setActiveThreatModal(null);

    // 3. Clear auth and session state (do NOT wipe registered accounts or guardians)
    setIsAuthenticated(false);
    setUser(null);
    setDemoMode(false);

    // 4. Update session storage flags (keep registered profile stored in accounts registry)
    try {
      localStorage.removeItem('safecall_user');
      localStorage.setItem('safecall_auth', 'false');
      sessionStorage.removeItem('safecall_session');
    } catch (e) {
      console.warn('Storage cleanup error during logout:', e);
    }

    // 5. Fire global sign-out signal so active listeners (e.g. live call monitoring) stop immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('safecall:logout'));
    }

    addToast('Logged Out', 'You have been logged out successfully.', 'info');
  };


  const addCall = async (call: CallRecord) => {
    await apiService.saveCall(call);
    await refreshCalls();
  };

  const deleteCall = async (id: string) => {
    await apiService.deleteCall(id);
    await refreshCalls();
    addToast('Call Record Removed', 'The forensic call log has been securely deleted.', 'info');
  };

  const addContact = async (contact: Omit<TrustedContact, 'id' | 'addedAt'>) => {
    const created = await apiService.createContact(contact);
    await refreshContacts();
    addToast('Trusted Contact Added', `${created.name} will be notified in emergencies.`, 'success');
    return created;
  };

  const updateContact = async (id: string, updates: Partial<TrustedContact>) => {
    await apiService.updateContact(id, updates);
    await refreshContacts();
    addToast('Contact Updated', 'Notification preferences updated.', 'success');
  };

  const deleteContact = async (id: string) => {
    await apiService.deleteContact(id);
    await refreshContacts();
    addToast('Contact Removed', 'Trusted contact was deleted.', 'info');
  };

  const updateSettings = async (newSettings: Partial<SecuritySettings>) => {
    const updated = await apiService.updateSettings(newSettings);
    setSettings(updated);
    addToast('Settings Saved', 'Your security & accessibility settings were updated.', 'success');
  };

  const triggerThreatAlert = (payload: ThreatAlertPayload) => {
    setActiveThreatModal(payload);

    // Trigger warning buzzer if enabled and volume > 0
    if (settings?.buzzerEnabled) {
      const threatKey = payload.callId || payload.title;
      audioAlertService.playHighRiskBuzzer(threatKey, settings.alertVolume);
    }

    // Trigger notification toast
    addToast(
      'SCAM THREAT DETECTED',
      payload.message || 'Severe social engineering patterns detected. Do not share OTP or money!',
      'critical'
    );
  };

  const dismissThreatAlert = () => {
    audioAlertService.stopAlarm();
    setActiveThreatModal(null);
  };

  const testFamilyNotification = (contact: TrustedContact) => {
    addToast(
      'Simulated SMS Sent',
      `High-priority alert dispatched to ${contact.name} (${contact.phoneNumber}): "SafeCall Alert: Alekya is receiving a high-risk scam call."`,
      'success'
    );
  };

  const resetAllDemoData = async () => {
    apiService.resetAllDemoData();
    await refreshCalls();
    await refreshContacts();
    await refreshSettings();
    audioAlertService.resetThreatDeduplication();
    addToast('Demo Data Reset', 'Restored default demo scenarios, call history, and contacts.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentGuardians,
        isAuthenticated,
        demoMode,
        backendStatus,
        isCheckingBackend,
        checkBackendHealth,
        login,
        signup,
        logout,
        enterDemoMode,
        switchAccount,
        calls,
        refreshCalls,
        addCall,
        deleteCall,
        contacts,
        refreshContacts,
        addContact,
        updateContact,
        deleteContact,
        settings,
        updateSettings,
        activeThreatModal,
        triggerThreatAlert,
        dismissThreatAlert,
        toasts,
        addToast,
        dismissToast,
        testFamilyNotification,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );

};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
