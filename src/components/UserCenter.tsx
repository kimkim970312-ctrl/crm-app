'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import LogoutConfirmModal from './LogoutConfirmModal';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function UserCenter({ visible, onClose }: Props) {
  const { user } = useAuth();
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  if (!visible || !user) return null;

  return (
    <>
      {/* 遮罩 */}
      <div className="fixed inset-0 bg-black/30 z-50" onClick={onClose} />

      {/* 弹窗 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="pt-8 pb-4 px-8 text-center border-b border-slate-100">
            {/* 头像 */}
            <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-md">
              {user.name ? (
                <span className="text-white text-3xl font-bold">{user.name.charAt(0)}</span>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
            <p className="text-[13px] text-slate-400 mt-0.5 tabular-nums">{user.phone}</p>
          </div>

          {/* 信息区 */}
          <div className="px-8 py-5 space-y-3">
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-slate-400">用户姓名</span>
              <span className="text-slate-700 font-medium">{user.name}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-slate-400">手机号</span>
              <span className="text-slate-700 font-medium tabular-nums">{user.phone}</span>
            </div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-slate-400">所属角色</span>
              <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-medium bg-primary-50 text-primary-700 border border-primary-100">
                {user.roleName}
              </span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="px-8 pb-6 space-y-2.5">
            <button
              onClick={() => setShowChangePwd(true)}
              className="w-full h-10 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-150 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              修改密码
            </button>
            <button
              onClick={() => setShowLogout(true)}
              className="w-full h-10 rounded-lg border border-red-200 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-all duration-150 flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              退出登录
            </button>
          </div>

          {/* 关闭按钮 */}
          <div className="px-8 pb-6">
            <button
              onClick={onClose}
              className="w-full h-10 rounded-lg bg-slate-50 text-[13px] font-semibold text-slate-500 hover:bg-slate-100 transition-all duration-150"
            >
              关闭
            </button>
          </div>
        </div>
      </div>

      {/* 修改密码弹窗 */}
      <ChangePasswordModal visible={showChangePwd} onClose={() => setShowChangePwd(false)} />

      {/* 退出确认弹窗 */}
      <LogoutConfirmModal visible={showLogout} onClose={() => setShowLogout(false)} />
    </>
  );
}
