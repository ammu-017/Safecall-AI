export type RiskLevel = 'safe' | 'low' | 'moderate' | 'high' | 'critical';

export interface ManipulationSignal {
  id: string;
  type:
    | 'artificial_urgency'
    | 'intimidation'
    | 'otp_solicitation'
    | 'secrecy_demand'
    | 'impersonation'
    | 'suspicious_transfer'
    | 'unverified_authority'
    | 'emotional_pressure';
  label: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidenceSnippet?: string;
}

export interface TranscriptSegment {
  id: string;
  speaker: 'Caller' | 'User';
  text: string;
  timestamp: string;
  isSuspicious?: boolean;
  detectedSignal?: ManipulationSignal;
  riskContribution?: number;
}

export interface CallRecord {
  id: string;
  callerNumber: string;
  callerName?: string;
  callerLocation?: string;
  callType: 'incoming' | 'outgoing' | 'simulated';
  date: string;
  duration: string; // e.g. "2m 45s"
  durationSeconds: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  analysisStatus: 'completed' | 'in_progress' | 'flagged';
  manipulationSignals: ManipulationSignal[];
  transcript: TranscriptSegment[];
  summary: string;
  recommendedActions: string[];
  isDemo?: boolean;
}

export interface TrustedContact {
  id: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  notifyOnHighRisk: boolean;
  consentStatus: 'confirmed' | 'pending';
  addedAt: string;
}

export interface SecuritySettings {
  monitoringEnabled: boolean;
  riskThreshold: number; // 50 - 90
  riskSensitivity: 'standard' | 'high' | 'strict';
  autoAlertFamily: boolean;
  buzzerEnabled: boolean;
  alertVolume: number; // 10 - 100
  largeTextMode: boolean;
  highContrastMode: boolean;
  reducedMotion: boolean;
  voiceWarningEnabled: boolean;
  onDevicePreference: boolean;
  cloudConsent: boolean;
  audioRetention: 'none' | '24h' | '30d';
  transcriptRetention: 'local_only' | 'encrypted_cloud' | 'none';
  apiBaseUrl?: string;
  wsUrl?: string;
}

export interface AnalyticsData {
  totalCallsAnalyzed: number;
  safeCallsCount: number;
  suspiciousCallsCount: number;
  highRiskCount: number;
  weeklyActivity: Array<{ day: string; calls: number; threats: number }>;
  riskDistribution: Array<{ name: string; value: number; color: string }>;
  topManipulationSignals: Array<{ signal: string; count: number; severity: string; percentage: number }>;
  threatTimeline: Array<{ time: string; score: number; event: string }>;
}

export interface DemoScenario {
  id: string;
  title: string;
  scenarioType: 'scam' | 'legitimate';
  callerName: string;
  callerNumber: string;
  description: string;
  expectedFinalScore: number;
  expectedRiskLevel: RiskLevel;
  segments: Array<{
    speaker: 'Caller' | 'User';
    text: string;
    delayMs: number;
    incrementalRisk: number;
    suspicious?: boolean;
    signal?: ManipulationSignal;
  }>;
}

// WebSocket Event Types matching proposed FastAPI Antigravity backend
export type WebSocketEventType =
  | 'transcript_segment'
  | 'risk_update'
  | 'threat_detected'
  | 'monitoring_status';

export interface WebSocketMonitorMessage {
  event: WebSocketEventType;
  data: {
    segment?: TranscriptSegment;
    currentRiskScore?: number;
    currentRiskLevel?: RiskLevel;
    detectedSignals?: ManipulationSignal[];
    isHighRisk?: boolean;
    status?: 'listening' | 'analyzing' | 'idle' | 'stopped';
    timestamp?: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  isDemoUser: boolean;
  protectedSince: string;
  avatarUrl?: string;
  accountStatus?: 'active' | 'pending' | 'verified';
}

export interface GuardianInfo {
  name: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  notifyOnHighRisk: boolean;
  alertStatus: 'Active Standing Guard' | 'On Call' | 'Emergency Only';
  isSecondary?: boolean;
}

export interface RegisteredAccount {
  id: string;
  user: UserProfile;
  guardians: GuardianInfo[];
  passwordHash?: string; // stored for demo verification
}

