'use client';

import { useState, useEffect } from 'react';
import { Account } from '@/types/account';

interface RoleOption {
  id: string;
  name: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (phone: string, name: string, roleId?: string, roleName?: string) => Promise<void>;
  account: Account | null;
}

export default function EditAccountDrawer({ visible, onClose, onSubmit, account }: Props) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // 加载角色列表
  useEffect(() => {
    if (visible) {
      fetch('/api/accounts?type=roles')
        .then((r) => r.json())
        .then((data) => setRoles(data))
        .catch(() => {});
    }
  }, [visible]);

  useEffect(() => {
    if (account) {
      setPhone(account.phone);
      setName(account.name);
      setRoleId(account.roleId);
    }
  }, [account]);

  if (!visible) return null;

  const handleSubmit = async () => {
    if (!phone.trim() || !name.trim() || !roleId) return;
    setSubmitting(true);
    try {
      const selected = roles.find((r) => r.id === roleId);
      await onSubmit(phone.trim(), name.trim(), roleId, selected?.name || '');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 遮罩 */}
      <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={onClose} />

      {/* 抽屉 */}
      <div className="fixed top-0 right-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-base font-bold text-slate-800">修改账号</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* 表单 */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            {/* 账号 ID（只读） */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">账号 ID</label>
              <p className="text-[13px] text-primary-600 font-semibold">{account?.id}</p>
            </div>

            {/* 所属角色（改为下拉选择） */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">所属角色</label>
              <select
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                className="w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] appearance-none"
              >
                <option value="">请选择角色</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* 手机号 */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">手机号</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="请输入手机号"
                className="w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              />
            </div>

            {/* 用户姓名 */}
            <div>
              <label className="block text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">用户姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入用户姓名"
                className="w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
              />
            </div>
          </div>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="h-10 px-5 rounded-lg border border-slate-200 text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-all duration-150"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!phone.trim() || !name.trim() || !roleId || submitting}
            className="h-10 px-6 rounded-lg bg-primary-600 text-white text-[13px] font-semibold hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            保存修改
          </button>
        </div>

        {/* 动画 */}
        <style jsx>{`
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          .animate-slide-in { animation: slideIn 200ms ease-out; }
        `}</style>
      </div>
    </>
  );
}
