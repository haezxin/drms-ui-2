import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { demoAccounts } from '../data/roles';
import type { DemoAccount, LoginResult, Role, User } from '../types/auth';

interface AuthContextValue {
  user: User | null;
  login: (identifier: string, password: string) => Promise<LoginResult>;
  signup: (identifier: string, password: string, name?: string) => Promise<LoginResult>;
  loginDemo: (role: Role) => Promise<void>;
  /** Development-only: swap to another demo persona without signing out. */
  switchRole: (role: Role) => void;
  logout: () => void;
}

const STORAGE_KEY = 'drms.session';
const REGISTERED_USERS_KEY = 'drms.registeredUsers';
const DEFAULT_ROLE: Role = 'operator';
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(readSession);

  const startSession = useCallback((next: User | null) => {
    setUser(next);
    try {
      if (next) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));else
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {

      // Storage unavailable — session stays in memory only.
    }}, []);

  const login = useCallback(
    async (identifier: string, password: string): Promise<LoginResult> => {
      const id = identifier.trim();
      if (!id || !password) return { ok: false, error: 'Enter your user ID and password.' };
      await delay(600);

      const registered = readRegisteredUsers().find((a) => a.username === id.toLowerCase());
      if (registered) {
        if (password !== registered.password) return { ok: false, error: 'Incorrect password for this account.' };
        startSession({ username: registered.username, name: registered.name || 'placeholder', role: registered.role, demo: false });
        return { ok: true };
      }

      const account = demoAccounts.find((a) => a.username === id.toLowerCase());
      if (account) {
        if (password !== account.password) return { ok: false, error: 'Incorrect password for this account.' };
        startSession(fromAccount(account));
        return { ok: true };
      }

      startSession({ username: id, name: nameFromIdentifier(id), role: DEFAULT_ROLE, demo: false });
      return { ok: true };
    },
    [startSession]
  );

  const signup = useCallback(
    async (identifier: string, password: string, name?: string): Promise<LoginResult> => {
      const id = identifier.trim();
      const displayName = (name ?? '').trim();
      if (!id || !password) return { ok: false, error: 'Enter a username and password.' };
      if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
      if (!/^[a-z0-9._-]+$/i.test(id)) return { ok: false, error: 'Username can only contain letters, numbers, periods, underscores, and dashes.' };

      const normalized = id.toLowerCase();
      const existing = readRegisteredUsers().find((a) => a.username === normalized);
      if (existing) return { ok: false, error: 'That username is already in use.' };

      const account = { username: normalized, password, name: displayName || 'placeholder', role: DEFAULT_ROLE };
      const next = [...readRegisteredUsers(), account];
      try {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable — keep the in-memory session only for this browser tab.
      }

      startSession({ username: account.username, name: account.name, role: account.role, demo: false });
      return { ok: true };
    },
    [startSession]
  );

  const loginDemo = useCallback(
    async (role: Role) => {
      await delay(400);
      const account = demoAccounts.find((a) => a.role === role);
      if (account) startSession(fromAccount(account));
    },
    [startSession]
  );

  const switchRole = useCallback(
    (role: Role) => {
      const account = demoAccounts.find((a) => a.role === role);
      if (account) startSession(fromAccount(account));
    },
    [startSession]
  );

  const logout = useCallback(() => startSession(null), [startSession]);

  const value = useMemo(
    () => ({ user, login, signup, loginDemo, switchRole, logout }),
    [user, login, signup, loginDemo, switchRole, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

function readSession(): User | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw) as User;
    if (!session.demo && session.role === 'responder') {
      const upgradedSession = { ...session, role: DEFAULT_ROLE };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(upgradedSession));
      return upgradedSession;
    }
    return session;
  } catch {
    return null;
  }
}

function fromAccount(account: DemoAccount): User {
  return { username: account.username, name: 'placeholder', role: account.role, demo: true };
}

function readRegisteredUsers(): DemoAccount[] {
  let accounts: DemoAccount[];
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    accounts = raw ? JSON.parse(raw) as DemoAccount[] : [];
  } catch {
    return [];
  }

  const upgradedAccounts = accounts.map((account) =>
    account.role === 'responder' ? { ...account, role: DEFAULT_ROLE } : account
  );
  if (upgradedAccounts.some((account, index) => account.role !== accounts[index].role)) {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(upgradedAccounts));
    } catch {
      // Keep the upgraded roles in memory when storage is unavailable.
    }
  }
  return upgradedAccounts;
}

function nameFromIdentifier(id: string): string {
  return 'placeholder';
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}