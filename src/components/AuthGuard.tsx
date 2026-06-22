'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { hasPagePermission } from '@/hooks/usePermission';

/** 页面白名单：无需权限验证即可访问的路径 */
const PUBLIC_PATHS = ['/login'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // 1. 未登录 → 跳登录
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 2. 已登录但无此页面权限 → 跳转无权限或首页
    if (!PUBLIC_PATHS.includes(pathname)) {
      // 提取一级路径作为 pageKey
      const pageKey = pathname.split('/')[1];
      if (pageKey && !hasPagePermission(user, pageKey)) {
        router.push('/leads');
      }
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
