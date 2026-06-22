'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { businessNav, systemNav, NavItem } from '@/config/navigation';
import { useAuth } from '@/context/AuthContext';
import { hasPagePermission } from '@/hooks/usePermission';
import UserCenter from '@/components/UserCenter';

/** 图标映射 — 按 key 匹配 */
const iconMap: Record<string, React.ReactNode> = {
  leads: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  products: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  reports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  roles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  accounts: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

/** 渲染导航链接列表 */
function NavList({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-slate-600 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              <span className={isActive ? 'text-primary-600' : 'text-slate-400'}>{iconMap[item.key]}</span>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Sidebar() {
  const [showUserCenter, setShowUserCenter] = useState(false);
  const { user } = useAuth();
  const name = user?.name || '管理员';
  const initial = name.charAt(0);

  // 根据权限过滤导航菜单
  const visibleBusinessNav = businessNav.filter((item) => hasPagePermission(user, item.key));
  const visibleSystemNav = systemNav.filter((item) => hasPagePermission(user, item.key));

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-slate-200 flex flex-col z-30">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
        <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
            <circle cx="20" cy="14" r="4" fill="white" />
            <circle cx="11" cy="26" r="3.5" fill="white" />
            <circle cx="29" cy="26" r="3.5" fill="white" />
            <line x1="20" y1="18" x2="11" y2="22.5" stroke="white" strokeWidth="1.8" />
            <line x1="20" y1="18" x2="29" y2="22.5" stroke="white" strokeWidth="1.8" />
            <line x1="14.5" y1="26" x2="25.5" y2="26" stroke="white" strokeWidth="1.8" />
          </svg>
        </div>
        <span className="text-lg font-bold text-slate-800 tracking-tight">CRM Pro</span>
      </div>

      {/* 导航 */}
      <nav className="flex-1 py-4 px-3">
        <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">业务管理</p>
        <NavList items={visibleBusinessNav} />

        <div className="my-4 border-t border-slate-100" />

        <p className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">系统</p>
        <NavList items={visibleSystemNav} />
      </nav>

      {/* 底部用户 */}
      <div className="border-t border-slate-100 p-4">
        <button
          onClick={() => setShowUserCenter(true)}
          className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors duration-150 text-left"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #2563EB, #3B82F6)' }}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-slate-800 truncate">{user?.name || '管理员'}</p>
            <p className="text-[11px] text-slate-400">{user?.phone || '未登录'}</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-300 flex-shrink-0">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* 用户中心弹窗 */}
      <UserCenter visible={showUserCenter} onClose={() => setShowUserCenter(false)} />
    </aside>
  );
}
