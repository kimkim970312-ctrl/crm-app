'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ visible, onClose }: Props) {
  const { user } = useAuth();
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!visible) return null;

  const handleSubmit = async () => {
    setError('');
    setSuccess('');

    if (!oldPwd || !newPwd || !confirmPwd) {
      setError('请填写所有密码字段');
      return;
    }
    if (newPwd.length < 6) {
      setError('新密码长度不能少于6位');
      return;
    }
    if (newPwd !== confirmPwd) {
      setError('两次输入的新密码不一致');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user?.id, oldPassword: oldPwd, newPassword: newPwd }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '修改失败');
      }

      setSuccess('密码修改成功');
      setOldPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting) handleSubmit();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">修改密码</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* 表单 */}
        <div className="p-6 space-y-4">
          {/* 原密码 */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">原密码</label>
            <input
              type="password"
              value={oldPwd}
              onChange={(e) => setOldPwd(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入原密码"
              autoFocus
              className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150"
            />
          </div>
          {/* 新密码 */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">新密码</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入新密码（至少6位）"
              className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150"
            />
          </div>
          {/* 确认新密码 */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">确认新密码</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请再次输入新密码"
              className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150"
            />
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</div>
          )}
          {success && (
            <div className="text-[13px] text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-3">{success}</div>
          )}
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
            disabled={!oldPwd || !newPwd || !confirmPwd || submitting}
            className="h-10 px-6 rounded-lg bg-primary-600 text-white text-[13px] font-semibold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            确认修改
          </button>
        </div>
      </div>
    </div>
  );
}
