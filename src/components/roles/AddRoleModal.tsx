'use client';

import { useState } from 'react';
import { Role } from '@/types/role';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export default function AddRoleModal({ visible, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!visible) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(name.trim());
      setName('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting) handleSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">新增角色</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* 表单 */}
        <div className="p-6">
          <label className="block text-[13px] font-semibold text-slate-700 mb-2">角色名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="请输入角色名称"
            autoFocus
            className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150"
          />
          <p className="text-[11px] text-slate-400 mt-1.5">新增后可在权限管理中分配页面权限</p>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-150"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim() || submitting}
            className="h-10 px-6 rounded-lg bg-primary-600 text-white text-[13px] font-semibold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            添加
          </button>
        </div>
      </div>
    </div>
  );
}
