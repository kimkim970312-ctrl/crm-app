'use client';

interface StatItem {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  subText: string;
  icon: React.ReactNode;
  color: string;
  /** 业绩完成卡片专用：进度百分比 */
  progress?: number;
  /** 业绩完成卡片专用：目标金额 */
  target?: string;
}

const items: StatItem[] = [
  {
    label: '本月销售额',
    value: '¥186,250',
    change: '+12.5%',
    changeType: 'up',
    subText: '较上月',
    color: '#2563EB',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    label: '本月客户线索数',
    value: '128',
    change: '+8.3%',
    changeType: 'up',
    subText: '较上月',
    color: '#059669',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: '本月订单数',
    value: '86',
    change: '+5.2%',
    changeType: 'up',
    subText: '较上月',
    color: '#D97706',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: '本月业绩完成',
    value: '¥186,250',
    change: '+12.5%',
    changeType: 'up',
    subText: '较上月',
    color: '#7C3AED',
    progress: 68.5,
    target: '¥100,000',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-4 gap-5 mb-6">
      {items.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-slate-200 p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group relative overflow-hidden"
        >
          {/* 顶部：标签 + 右侧图标 */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] text-slate-500 font-medium">{card.label}</span>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${card.color}12`, color: card.color }}
            >
              {card.icon}
            </div>
          </div>

          {/* 中部：大数值 */}
          <p className="text-[26px] font-bold text-slate-800 tracking-tight leading-tight mb-2">{card.value}</p>

          {/* 底部：环比变化 — 正值红色（涨），负值绿色（跌），中国市场惯例 */}
          {card.progress !== undefined ? (
            /* 业绩完成卡片 — 进度条形式 */
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-slate-400">
                  目标 <span className="font-semibold text-slate-600">{card.target}</span>
                </span>
                <span className="text-[13px] font-bold text-slate-700">{card.progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${card.progress}%`,
                    background: card.progress >= 100
                      ? '#059669'
                      : `linear-gradient(90deg, ${card.color}, ${card.color}CC)`,
                  }}
                />
              </div>
            </div>
          ) : (
            /* 普通卡片 — 环比行内显示 */
            <div className="flex items-center gap-1.5">
              {card.changeType === 'up' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-red-500">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-emerald-500">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
              <span className={`text-[12px] font-semibold ${card.changeType === 'up' ? 'text-red-600' : 'text-emerald-600'}`}>
                {card.change}
              </span>
              <span className="text-[12px] text-slate-400">{card.subText}</span>
            </div>
          )}

          {/* 右下角装饰光晕 */}
          <div
            className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-[0.06] pointer-events-none"
            style={{ background: card.color }}
          />
        </div>
      ))}
    </div>
  );
}
