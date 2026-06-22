'use client';

import type { Lead } from '@/types/lead';

const priorityMap: Record<string, { label: string; color: string }> = {
  high: { label: '高', color: '#EF4444' },
  medium: { label: '中', color: '#F59E0B' },
  low: { label: '低', color: '#10B981' },
};

const sourceMap: Record<string, string> = {
  web: '官网',
  referral: '转介绍',
  ads: '广告投放',
  event: '活动',
  social: '社交媒体',
};

const avatarColors = [
  '#2563EB', '#7C3AED', '#059669', '#D97706',
  '#DC2626', '#0891B2', '#4F46E5', '#C026D3',
];

function getFollowerColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

interface LeadDetailProps {
  lead: Lead;
}

export default function LeadDetail({ lead }: LeadDetailProps) {
  return (
    <div className="space-y-5">
      {/* 线索编号 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">线索编号</p>
        <p className="text-sm font-semibold text-primary-600">{lead.id}</p>
      </div>

      {/* 创建时间 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">创建时间</p>
        <p className="text-sm text-slate-700">{lead.createdAt}</p>
      </div>

      {/* 基本信息 */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">姓名</p>
          <p className="text-sm font-semibold text-slate-800">{lead.name}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">电话</p>
          <p className="text-sm text-slate-700 tabular-nums">{lead.phone}</p>
        </div>
      </div>

      {/* 优先级 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">优先级</p>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: lead.priority === 'high' ? '#FEF2F2' : lead.priority === 'medium' ? '#FFFBEB' : '#ECFDF5',
            color: priorityMap[lead.priority]?.color || '#475569',
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: priorityMap[lead.priority]?.color || '#94A3B8' }} />
          {priorityMap[lead.priority]?.label || lead.priority}
        </span>
      </div>

      {/* 客户来源 */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">客户来源</p>
        <p className="text-sm text-slate-700">{sourceMap[lead.source] || lead.source}</p>
      </div>

      {/* 跟进人（多选） */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">跟进人</p>
        {lead.follower.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {lead.follower.map((name) => (
              <div key={name} className="flex items-center gap-1.5 bg-slate-50 rounded-full px-2.5 py-1 border border-slate-100">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                  style={{ background: getFollowerColor(name) }}
                >
                  {name.charAt(0)}
                </span>
                <span className="text-[13px] text-slate-700">{name}</span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-sm text-slate-400">未分配</span>
        )}
      </div>
    </div>
  );
}
