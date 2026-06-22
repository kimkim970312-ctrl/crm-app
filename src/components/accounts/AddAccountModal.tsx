'use client';

import { useState, useEffect } from 'react';

interface RoleOption {
  id: string;
  name: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (phone: string, name: string, roleId: string, roleName: string) => Promise<void>;
}

export default function AddAccountModal({ visible, onClose, onSubmit }: Props) {
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

  if (!visible) return null;

  const handleSubmit = async () => {
    if (!phone.trim() || !name.trim() || !roleId) return;
    setSubmitting(true);
    try {
      const selected = roles.find((r) => r.id === roleId);
      await onSubmit(phone.trim(), name.trim(), roleId, selected?.name || '');
      setPhone('');
      setName('');
      setRoleId('');
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
          <h2 className="text-base font-bold text-slate-800">新增账号</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* 表单 */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">手机号</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入手机号"
              autoFocus
              className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">用户姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入用户姓名"
              className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">所属角色</label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-[14px] text-slate-700 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-150 appearance-none"
            >
              <option value="">请选择角色</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-slate-400 -mt-1">默认密码为 123123</p>
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
            disabled={!phone.trim() || !name.trim() || !roleId || submitting}
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
