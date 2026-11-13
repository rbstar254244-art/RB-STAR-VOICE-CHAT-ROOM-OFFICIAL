import {
  AdminUser,
  Agency,
  AppConnectionConfig,
  AppScreenshot,
  BannedUser,
  BDManager,
  CoinPackage,
  CoinReseller,
  CoinTransaction,
  FreeCoinGrant,
  StaffApplication,
  SupportTicket,
  VoiceRoom,
} from '../types';

export interface BackendStatus {
  isPhpHost: boolean;
  configured: boolean;
  dbReady: boolean;
  authenticated: boolean;
  error?: string | null;
}

export interface FullPortalSnapshot {
  appConfig: AppConnectionConfig;
  coinPackages: CoinPackage[];
  screenshots: AppScreenshot[];
  adminUsers: AdminUser[];
  coinResellers: CoinReseller[];
  voiceRooms: VoiceRoom[];
  agencies: Agency[];
  bdManagers: BDManager[];
  tickets: SupportTicket[];
  transactions: CoinTransaction[];
  freeCoinGrants: FreeCoinGrant[];
  bannedUsers: BannedUser[];
  staffApplications: StaffApplication[];
  broadcasts: { id: string; message: string; timestamp: string; sender: string }[];
}

const TOKEN_STORAGE_KEY = 'RBSTAR_INFINITYFREE_TOKEN';

export function getStoredApiToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredApiToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // Ignore storage access errors
  }
}

async function safeFetchJson(url: string, options: RequestInit = {}): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const token = getStoredApiToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { ok: false, status: res.status, data: null };
    }

    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}

export async function checkBackendStatus(): Promise<BackendStatus> {
  const { ok, data } = await safeFetchJson('./api/auth.php?action=status', { method: 'GET' });
  if (!ok || !data || data.backend !== 'infinityfree_php_mysql') {
    return {
      isPhpHost: false,
      configured: false,
      dbReady: false,
      authenticated: false,
    };
  }
  return {
    isPhpHost: true,
    configured: Boolean(data.configured),
    dbReady: Boolean(data.dbReady),
    authenticated: Boolean(data.authenticated),
    error: data.error || null,
  };
}

export async function fetchPublicDataFromInfinityFree(): Promise<{
  appConfig?: Partial<AppConnectionConfig>;
  coinPackages?: CoinPackage[];
  screenshots?: AppScreenshot[];
} | null> {
  const { ok, data } = await safeFetchJson('./api/public.php', { method: 'GET' });
  if (!ok || !data || !data.ok) return null;
  return {
    appConfig: data.appConfig,
    coinPackages: Array.isArray(data.coinPackages) ? data.coinPackages : undefined,
    screenshots: Array.isArray(data.screenshots) ? data.screenshots : undefined,
  };
}

export async function apiLoginInfinityFree(password: string): Promise<{
  handledByBackend: boolean;
  ok: boolean;
  locked?: boolean;
  remainingSeconds?: number;
  error?: string;
}> {
  const { ok, status, data } = await safeFetchJson('./api/auth.php?action=login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });

  if (status === 0 || data === null) {
    return { handledByBackend: false, ok: false };
  }

  // If PHP host responded with 503 (MySQL not configured yet), let caller know
  if (status === 503 && data?.configured === false) {
    return { handledByBackend: false, ok: false, error: data.error };
  }

  if (ok && data.ok && data.token) {
    setStoredApiToken(data.token);
    return { handledByBackend: true, ok: true };
  }

  return {
    handledByBackend: true,
    ok: false,
    locked: Boolean(data.locked),
    remainingSeconds: data.remainingSeconds,
    error: data.error || 'Incorrect administrator password.',
  };
}

export async function apiChangePasswordInfinityFree(newPassword: string): Promise<{
  handledByBackend: boolean;
  ok: boolean;
  error?: string;
}> {
  const { ok, status, data } = await safeFetchJson('./api/auth.php?action=change_password', {
    method: 'POST',
    body: JSON.stringify({ newPassword }),
  });
  if (status === 0 || data === null || (status === 503 && data?.configured === false)) {
    return { handledByBackend: false, ok: false };
  }
  return {
    handledByBackend: true,
    ok: Boolean(ok && data.ok),
    error: data.error,
  };
}

export async function fetchFullDatabaseFromInfinityFree(): Promise<Partial<FullPortalSnapshot> | null> {
  const { ok, data } = await safeFetchJson('./api/sync.php', { method: 'GET' });
  if (!ok || !data || !data.ok || !data.data) return null;
  return data.data;
}

export async function saveFullDatabaseToInfinityFree(snapshot: FullPortalSnapshot): Promise<{
  ok: boolean;
  syncedAt?: string;
  error?: string;
}> {
  const { ok, data } = await safeFetchJson('./api/sync.php', {
    method: 'POST',
    body: JSON.stringify(snapshot),
  });
  if (!ok || !data || !data.ok) {
    return { ok: false, error: data?.error || 'Sync failed' };
  }
  return { ok: true, syncedAt: data.syncedAt };
}

export async function submitApplicationToInfinityFree(
  application: Omit<StaffApplication, 'id' | 'submittedAt' | 'status'>
): Promise<boolean> {
  const { ok, data } = await safeFetchJson('./api/public.php?action=submit_application', {
    method: 'POST',
    body: JSON.stringify(application),
  });
  return Boolean(ok && data?.ok);
}
