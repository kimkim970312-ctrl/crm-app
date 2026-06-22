'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Priority, Source } from '@/types/lead';
import { isValidPhone, FOLLOWER_OPTIONS } from '@/types/lead';
import MultiSelect from '@/components/MultiSelect';

interface AddLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; phone: string; priority: Priority; source: Source; follower: string[] }) => void;
}

export default function AddLeadModal({ open, onClose, onSubmit }: AddLeadModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [source, setSource] = useState<Source>('web');
  const [followers, setFollowers] = useState<string[]>([]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  const toggleFollower = (name: string) => {
  };

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    if (!isValidPhone(phone.trim())) {
      setPhoneError('请输入有效的手机号码（11位，1开头）');
      return;
    }
    onSubmit({ name: name.trim(), phone: phone.trim(), priority, source, follower: followers });
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName('');
    setPhone('');
    setPhoneError('');
    setPriority('medium');
    setSource('web');
    setFollowers([]);
  };

  const inputClass =
    'w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-xl shadow-2xl w-[520px] max-w-[90vw] max-h-[85vh] overflow-y-auto pointer-events-auto">
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-800">添加新线索</h2>
            <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors duration-150">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* 表单 */}
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                姓名 <span className="text-red-400">*</span>
              </label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入客户姓名" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                电话 <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setPhoneError(''); }}
                onBlur={() => {
                  if (phone.trim() && !isValidPhone(phone.trim())) {
                    setPhoneError('请输入有效的手机号码（11位，1开头）');
                  } else {
                    setPhoneError('');
                  }
                }}
                placeholder="请输入11位手机号码"
                className={`${inputClass} ${phoneError ? 'border-red-300 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : ''}`}
              />
              {phoneError && <p className="text-[11px] text-red-500 mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">优先级</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={inputClass + ' appearance-none'}>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">客户来源</label>
              <select value={source} onChange={(e) => setSource(e.target.value as Source)} className={inputClass + ' appearance-none'}>
                <option value="web">官网</option>
                <option value="referral">转介绍</option>
                <option value="ads">广告投放</option>
                <option value="event">活动</option>
                <option value="social">社交媒体</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">跟进人</label>
              <MultiSelect
                options={FOLLOWER_OPTIONS}
                selected={followers}
                onChange={setFollowers}
                placeholder="请选择跟进人"
              />
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
            <button onClick={handleClose} className="h-[38px] px-4 text-[13px] font-semibold rounded-md bg-white text-slate-600 border border-slate-200 cursor-pointer transition-all duration-150 hover:bg-slate-50">
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim() || !phone.trim()}
              className="inline-flex items-center gap-2 h-[38px] px-4 text-[13px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              确认添加
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
