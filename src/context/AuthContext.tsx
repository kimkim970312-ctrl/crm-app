'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

/** 用户页面权限 */
export interface UserPagePerm {
  pageKey: string;
  pageName: string;
  features: string[];
  dataScope: string;
}

/** 登录用户信息 */
export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  roleId: string;
  roleName: string;
  permissions: UserPagePerm[];
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'crm_auth_token';

function decodeToken(): AuthUser | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const data = JSON.parse(decodeURIComponent(atob(raw)));
    // 简单校验过期（24小时）
    if (Date.now() - data.ts > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return data.user as AuthUser;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

function encodeToken(user: AuthUser): string {
  return btoa(encodeURIComponent(JSON.stringify({ user, ts: Date.now() })));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 初始化：从 localStorage 恢复登录态
  useEffect(() => {
    const saved = decodeToken();
    if (saved) setUser(saved);
    setLoading(false);
  }, []);

  const login = useCallback(async (phone: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '登录失败');
    }

    const data = await res.json();
    const authUser = data.user as AuthUser;

    // 保存到 localStorage
    localStorage.setItem(TOKEN_KEY, encodeToken(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
