'use client';

import { useState } from 'react';
import type { Lead, Priority, Source } from '@/types/lead';
import { isValidPhone, FOLLOWER_OPTIONS } from '@/types/lead';
import MultiSelect from '@/components/MultiSelect';

interface LeadEditProps {
  lead: Lead;
  onSave: (data: { name: string; phone: string; priority: Priority; source: Source; follower: string[] }) => void;
  onCancel: () => void;
}

export default function LeadEdit({ lead, onSave, onCancel }: LeadEditProps) {
  const [name, setName] = useState(lead.name);
  const [phone, setPhone] = useState(lead.phone);
  const [phoneError, setPhoneError] = useState('');
  const [priority, setPriority] = useState<Priority>(lead.priority);
  const [source, setSource] = useState<Source>(lead.source);
  const [followers, setFollowers] = useState<string[]>(lead.follower);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) return;
    if (!isValidPhone(phone.trim())) {
      setPhoneError('请输入有效的手机号码（11位，1开头）');
      return;
    }
    onSave({ name: name.trim(), phone: phone.trim(), priority, source, follower: followers });
  };

  const inputClass =
    'w-full h-[38px] px-3 text-[13px] border border-slate-200 rounded-md bg-white text-slate-700 placeholder-slate-400 outline-none transition-all duration-150 focus:border-primary-500 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]';

  return (
    <div className="space-y-5">
      {/* 线索编号（只读） */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">线索编号</p>
        <p className="text-sm font-semibold text-primary-600">{lead.id}</p>
      </div>

      {/* 姓名 */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          姓名 <span className="text-red-400">*</span>
        </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入姓名" className={inputClass} />
      </div>

      {/* 电话 */}
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

      {/* 优先级 */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">优先级</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={inputClass + ' appearance-none'}>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      {/* 客户来源 */}
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

      {/* 跟进人（多选下拉） */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">跟进人</label>
        <MultiSelect
          options={FOLLOWER_OPTIONS}
          selected={followers}
          onChange={setFollowers}
          placeholder="请选择跟进人"
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={onCancel} className="flex-1 h-[38px] text-[13px] font-semibold rounded-md bg-white text-slate-600 border border-slate-200 cursor-pointer transition-all duration-150 hover:bg-slate-50">
          取消
        </button>
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || !phone.trim()}
          className="flex-1 h-[38px] text-[13px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          保存修改
        </button>
      </div>
    </div>
  );
}
