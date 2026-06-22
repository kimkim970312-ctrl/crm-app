'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setError('请输入手机号和密码');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await login(phone.trim(), password);
      router.push('/leads');
    } catch (err: any) {
      setError(err.message || '用户名或密码错误');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      {/* 卡片 */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* 顶部品牌区域 */}
        <div className="px-10 pt-10 pb-6 text-center">
          <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
              <circle cx="20" cy="14" r="4" fill="white" />
              <circle cx="11" cy="26" r="3.5" fill="white" />
              <circle cx="29" cy="26" r="3.5" fill="white" />
              <line x1="20" y1="18" x2="11" y2="22.5" stroke="white" strokeWidth="1.8" />
              <line x1="20" y1="18" x2="29" y2="22.5" stroke="white" strokeWidth="1.8" />
              <line x1="14.5" y1="26" x2="25.5" y2="26" stroke="white" strokeWidth="1.8" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">CRM Pro</h1>
          <p className="text-[13px] text-slate-400 mt-1">客户关系管理系统</p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-5">
          {/* 手机号 */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 mb-1.5">手机号</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </span>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                autoFocus
                className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              />
            </div>
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-[12px] font-semibold text-slate-500 mb-1.5">密码</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                className="w-full h-11 pl-9 pr-4 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-400 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              />
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="flex items-center gap-2 text-[13px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* 登录按钮 */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-lg bg-primary-600 text-white text-[14px] font-semibold hover:bg-primary-500 active:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 shadow-sm"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
