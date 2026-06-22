'use client';

import type { Lead } from '@/types/lead';

/** 优先级配置 — 圆角药丸徽章 + 小圆点 */
const priorityConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  high:   { label: '高', bg: '#FEF2F2', text: '#EF4444', dot: '#EF4444' },
  medium: { label: '中', bg: '#FFFBEB', text: '#B45309', dot: '#F59E0B' },
  low:    { label: '低', bg: '#ECFDF5', text: '#047857', dot: '#10B981' },
};

/** 来源配置 — 彩色小方块 + 首字母 */
const sourceConfig: Record<string, { label: string; icon: string; bg: string; text: string }> = {
  web:      { label: '官网',     icon: 'W', bg: '#DBEAFE', text: '#1D4ED8' },
  referral: { label: '转介绍',   icon: 'R', bg: '#F3E8FF', text: '#7C3AED' },
  ads:      { label: '广告投放', icon: 'A', bg: '#FEF3C7', text: '#B45309' },
  event:    { label: '活动',     icon: 'E', bg: '#D1FAE5', text: '#047857' },
  social:   { label: '社交媒体', icon: 'S', bg: '#FFE4E6', text: '#BE123C' },
};

/** 跟进人头像色 — 与原始 HTML 一致 */
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

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  perms?: { canView: boolean; canEdit: boolean; canDelete: boolean };
}

export default function LeadTable({ leads, loading, onView, onEdit, onDelete, perms }: LeadTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-slate-400">
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            加载中...
          </div>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 mb-3 text-slate-300">
            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-sm">暂无线索数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr className="bg-slate-50" style={{ position: 'sticky', top: 0 }}>
              <th className="text-left pl-6 pr-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">线索编号</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">创建时间</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">姓名</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">电话</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">优先级</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">客户来源</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">跟进人</th>
              <th className="text-center pl-4 pr-6 py-3 font-semibold text-slate-400 text-xs uppercase tracking-wider whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100" style={{ borderTop: '1px solid #E2E8F0' }}>
            {leads.map((lead) => {
              const pCfg = priorityConfig[lead.priority] || priorityConfig.medium;
              const sCfg = sourceConfig[lead.source] || sourceConfig.web;

              return (
                <tr key={lead.id} className="transition-colors duration-150 hover:bg-primary-50">
                  {/* 线索编号 */}
                  <td className="pl-6 pr-4 py-[14px] text-[13px] whitespace-nowrap">
                    <span className="text-primary-600 font-semibold cursor-pointer hover:text-primary-700 hover:underline">
                      {lead.id}
                    </span>
                  </td>

                  {/* 创建时间 */}
                  <td className="px-4 py-[14px] text-[13px] text-slate-500 whitespace-nowrap">{lead.createdAt}</td>

                  {/* 姓名 */}
                  <td className="px-4 py-[14px] text-[13px] text-slate-800 font-semibold whitespace-nowrap">{lead.name}</td>

                  {/* 电话 */}
                  <td className="px-4 py-[14px] text-[13px] text-slate-500 tabular-nums whitespace-nowrap">{lead.phone}</td>

                  {/* 优先级 — 药丸徽章 + 小圆点 */}
                  <td className="px-4 py-[14px] text-[13px] whitespace-nowrap">
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 10px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        background: pCfg.bg,
                        color: pCfg.text,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: pCfg.dot,
                          flexShrink: 0,
                        }}
                      />
                      {pCfg.label}
                    </span>
                  </td>

                  {/* 客户来源 — 彩色小方块 + 首字母 */}
                  <td className="px-4 py-[14px] text-[13px] whitespace-nowrap">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 10,
                          fontWeight: 700,
                          background: sCfg.bg,
                          color: sCfg.text,
                          flexShrink: 0,
                        }}
                      >
                        {sCfg.icon}
                      </span>
                      {sCfg.label}
                    </span>
                  </td>

                  {/* 跟进人 — 多个圆形头像 + 姓名 */}
                  <td className="px-4 py-[14px] text-[13px] whitespace-nowrap">
                    {lead.follower.length > 0 ? (
                      <div className="flex items-center" style={{ gap: 0 }}>
                        {lead.follower.slice(0, 3).map((name, i) => (
                          <span
                            key={name}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white flex-shrink-0"
                            style={{
                              background: getFollowerColor(name),
                              marginLeft: i === 0 ? 0 : -8,
                              zIndex: 3 - i,
                              position: 'relative' as const,
                            }}
                            title={name}
                          >
                            {name.charAt(0)}
                          </span>
                        ))}
                        {lead.follower.length > 3 && (
                          <span
                            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-500 border-2 border-white flex-shrink-0"
                            style={{ marginLeft: -8, position: 'relative', zIndex: 0 }}
                            title={lead.follower.slice(3).join(', ')}
                          >
                            +{lead.follower.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[12px]">未分配</span>
                    )}
                  </td>

                  {/* 操作按钮 */}
                  <td className="pl-4 pr-6 py-[14px] text-[13px] text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1">
                      {perms?.canView && (
                        <button
                        onClick={() => onView(lead)}
                        className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-all duration-150 hover:bg-primary-50 hover:text-primary-600"
                        title="详情"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      )}
                      {perms?.canEdit && (
                      <button
                        onClick={() => onEdit(lead)}
                        className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-all duration-150 hover:bg-primary-50 hover:text-primary-600"
                        title="修改"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      )}
                      {perms?.canDelete && (
                      <button
                        onClick={() => onDelete(lead)}
                        className="w-8 h-8 flex items-center justify-center rounded-md border-none bg-transparent text-slate-400 cursor-pointer transition-all duration-150 hover:bg-red-50 hover:text-red-500"
                        title="删除"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
