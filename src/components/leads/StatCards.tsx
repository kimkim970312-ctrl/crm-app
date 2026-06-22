/** 统计卡片数据 */
interface StatCard {
  title: string;
  value: string | number;
  trend?: { value: string; direction: 'up' | 'down' };
  icon: React.ReactNode;
  iconClass: string;
}

const stats: StatCard[] = [
  {
    title: '全部线索',
    value: 248,
    trend: { value: '+12个 本月', direction: 'up' },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    iconClass: 'icon-blue',
  },
  {
    title: '已跟进',
    value: 86,
    trend: { value: '+8% 本月', direction: 'up' },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    iconClass: 'icon-green',
  },
  {
    title: '待跟进',
    value: 134,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    iconClass: 'icon-orange',
  },
  {
    title: '预估价值',
    value: '¥52.4w',
    trend: { value: '+18% 本月', direction: 'up' },
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    iconClass: 'icon-purple',
  },
];

const iconStyleMap: Record<string, { bg: string; stroke: string }> = {
  'icon-blue':   { bg: '#EFF6FF', stroke: '#2563EB' },
  'icon-green':  { bg: '#ECFDF5', stroke: '#10B981' },
  'icon-orange': { bg: '#FFFBEB', stroke: '#F59E0B' },
  'icon-purple': { bg: '#EEF2FF', stroke: '#6366F1' },
};

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const colors = iconStyleMap[stat.iconClass] || iconStyleMap['icon-blue'];
        return (
          <div
            key={stat.title}
            className="bg-white rounded-xl border border-slate-200 py-5 px-6 flex items-center gap-4 transition-shadow duration-200 hover:shadow-sm"
          >
            {/* 图标 */}
            <span
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: colors.bg, color: colors.stroke }}
            >
              {stat.icon}
            </span>

            {/* 文字 */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-slate-400">{stat.title}</p>
              <p className="text-[28px] font-bold text-slate-800 leading-tight">{stat.value}</p>
              {stat.trend && (
                <p className={`text-xs font-semibold mt-0.5 ${
                  stat.trend.direction === 'up' ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {stat.trend.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
