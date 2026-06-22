'use client';

import { useState } from 'react';
import { Account } from '@/types/account';

interface Props {
  visible: boolean;
  account: Account | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function ResetPasswordModal({ visible, account, onClose, onConfirm }: Props) {
  const [submitting, setSubmitting] = useState(false);

  if (!visible || !account) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(account.id);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
        {/* 头部 */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-amber-500">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-800 mb-2">确认重置密码</h2>
          <p className="text-[13px] text-slate-500">
            确定将账号 <span className="font-semibold text-slate-700">{account.name}</span>（{account.phone}）的密码重置为 <span className="font-semibold text-amber-600">123456</span> 吗？
          </p>
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
            onClick={handleConfirm}
            disabled={submitting}
            className="h-10 px-6 rounded-lg bg-amber-600 text-white text-[13px] font-semibold hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            确认重置
          </button>
        </div>
      </div>
    </div>
  );
}
