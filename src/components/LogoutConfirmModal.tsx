'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LogoutConfirmModal({ visible, onClose }: Props) {
  const { logout } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (!visible) return null;

  const handleLogout = () => {
    setSubmitting(true);
    logout();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* 头部 */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-red-500">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-2">确认退出</h2>
          <p className="text-[13px] text-slate-500">确定要退出当前登录吗？</p>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-center gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="h-10 px-6 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-150"
          >
            取消
          </button>
          <button
            onClick={handleLogout}
            disabled={submitting}
            className="h-10 px-6 rounded-lg bg-red-600 text-white text-[13px] font-semibold hover:bg-red-500 transition-all duration-150 flex items-center gap-2"
          >
            确认退出
          </button>
        </div>
      </div>
    </div>
  );
}
