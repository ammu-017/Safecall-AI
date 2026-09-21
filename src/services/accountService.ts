import { RegisteredAccount, UserProfile, GuardianInfo, TrustedContact } from '../types';

export type { RegisteredAccount, UserProfile, GuardianInfo };

/**
 * Storage keys:
 * safecall_accounts_registry: List of all registered accounts on device
 * safecall_last_account_id: The ID of the last active account (persists across logout unless user clicks "Switch account")
 * safecall_auth: 'true' | 'false' (Active session token/flag)
 * safecall_user: Current active session user
 */
const ACCOUNTS_STORAGE_KEY = 'safecall_accounts_registry_v1';
const LAST_ACCOUNT_ID_KEY = 'safecall_last_account_id';

export const DEFAULT_GUARDIANS: GuardianInfo[] = [
  {
    name: 'Rohan Sharma',
    relationship: 'Son (Primary Guardian)',
    phoneNumber: '+1 (555) 382-9104',
    email: 'rohan.sharma@familyconnect.net',
    notifyOnHighRisk: true,
    alertStatus: 'Active Standing Guard',
    isSecondary: false,
  },
  {
    name: 'Dr. Anita Desai',
    relationship: 'Family Caregiver',
    phoneNumber: '+1 (555) 204-7719',
    email: 'dr.desai@caregivernet.org',
    notifyOnHighRisk: true,
    alertStatus: 'On Call',
    isSecondary: true,
  },
];

export const DEFAULT_SEED_ACCOUNT: RegisteredAccount = {
  id: 'acc-alekya-default',
  user: {
    name: 'Alekya Chintapalli',
    email: 'chintapallialekya77@gmail.com',
    phone: '+1 (555) 749-3011',
    isDemoUser: true,
    protectedSince: 'March 2024',
    accountStatus: 'verified',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  guardians: DEFAULT_GUARDIANS,
  passwordHash: 'ProtectionPass123!',
};

export const SECONDARY_SEED_ACCOUNT: RegisteredAccount = {
  id: 'acc-robert-secondary',
  user: {
    name: 'Robert H. Jenkins',
    email: 'robert.jenkins@seniorsecure.org',
    phone: '+1 (555) 921-4478',
    isDemoUser: true,
    protectedSince: 'January 2024',
    accountStatus: 'verified',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  guardians: [
    {
      name: 'Sarah Jenkins Miller',
      relationship: 'Daughter (Primary Guardian)',
      phoneNumber: '+1 (555) 612-8821',
      email: 'sarah.miller@securenet.io',
      notifyOnHighRisk: true,
      alertStatus: 'Active Standing Guard',
      isSecondary: false,
    },
    {
      name: 'Michael Jenkins',
      relationship: 'Son (Secondary Guardian)',
      phoneNumber: '+1 (555) 441-9902',
      email: 'michael.j@techcare.net',
      notifyOnHighRisk: false,
      alertStatus: 'Emergency Only',
      isSecondary: true,
    },
  ],
  passwordHash: 'ProtectionPass123!',
};

/**
 * Mask sensitive phone number showing only prefix country and last 4 digits:
 * e.g., "+1 (555) 749-3011" -> "+1 (•••) •••-3011"
 */
export function maskPhoneNumber(phone?: string): string {
  if (!phone) return '••••';
  const clean = phone.trim();
  // Extract trailing 4 digits
  const digits = clean.replace(/\D/g, '');
  if (digits.length < 4) return '••••';
  const lastFour = digits.slice(-4);
  
  if (clean.startsWith('+1')) {
    return `+1 (•••) •••-${lastFour}`;
  }
  return `••• ••• ${lastFour}`;
}

/**
 * Mask sensitive email address:
 * e.g., "chintapallialekya77@gmail.com" -> "ch•••••••77@gmail.com"
 */
export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return '••••@••••.com';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }
  const firstTwo = local.slice(0, 2);
  const lastTwo = local.slice(-2);
  return `${firstTwo}${'•'.repeat(Math.max(3, local.length - 4))}${lastTwo}@${domain}`;
}

/**
 * Initialize accounts registry with default and secondary demo accounts if none exist
 */
export function getRegisteredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading accounts registry:', e);
  }
  
  // Seed with default demo accounts
  const seed = [DEFAULT_SEED_ACCOUNT, SECONDARY_SEED_ACCOUNT];
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(seed));
  } catch {}
  return seed;
}

/**
 * Save or update an account in registry
 */
export function saveRegisteredAccount(account: RegisteredAccount): void {
  const accounts = getRegisteredAccounts();
  const index = accounts.findIndex(
    (a) => a.id === account.id || a.user.email.toLowerCase() === account.user.email.toLowerCase()
  );
  if (index >= 0) {
    accounts[index] = account;
  } else {
    accounts.push(account);
  }
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Error saving registered account:', e);
  }
}

/**
 * Retrieve the last active account for personalized logout screen.
 * Returns null if user explicitly chose "Switch account" or if no account is found.
 */
export function getLastActiveAccount(): RegisteredAccount | null {
  try {
    const lastId = localStorage.getItem(LAST_ACCOUNT_ID_KEY);
    if (!lastId) return null;
    const accounts = getRegisteredAccounts();
    return accounts.find((a) => a.id === lastId) || null;
  } catch {
    return null;
  }
}

/**
 * Set the last active account ID
 */
export function setLastActiveAccountId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(LAST_ACCOUNT_ID_KEY, id);
    } else {
      localStorage.removeItem(LAST_ACCOUNT_ID_KEY);
    }
  } catch {}
}

/**
 * Clear the last active account so a blank standard login page is shown
 */
export function clearLastActiveAccount(): void {
  try {
    localStorage.removeItem(LAST_ACCOUNT_ID_KEY);
  } catch {}
}

/**
 * Find account by email or mobile number
 */
export function findAccountByCredential(query: string): RegisteredAccount | null {
  const accounts = getRegisteredAccounts();
  const q = query.trim().toLowerCase();
  const cleanPhoneDigits = query.replace(/\D/g, '');

  return (
    accounts.find((a) => {
      const emailMatch = a.user.email.toLowerCase() === q;
      const phoneDigits = a.user.phone.replace(/\D/g, '');
      const phoneMatch = cleanPhoneDigits && phoneDigits && (phoneDigits === cleanPhoneDigits || phoneDigits.endsWith(cleanPhoneDigits));
      return emailMatch || phoneMatch;
    }) || null
  );
}

/**
 * Convert TrustedContacts list into GuardianInfo[]
 */
export function contactsToGuardians(contacts: TrustedContact[]): GuardianInfo[] {
  return contacts.map((c, index) => ({
    name: c.name,
    relationship: c.relationship,
    phoneNumber: c.phoneNumber,
    email: c.email,
    notifyOnHighRisk: c.notifyOnHighRisk,
    alertStatus: index === 0 ? 'Active Standing Guard' : 'On Call',
    isSecondary: index > 0,
  }));
}
