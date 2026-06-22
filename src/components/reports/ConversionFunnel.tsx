'use client';

import { Card } from './Card';

const funnelData = [
  { label: '线索获取', value: 128 },
  { label: '需求确认', value: 86 },
  { label: '推产品', value: 52 },
  { label: '成交', value: 28 },
];

export default function ConversionFunnel() {
  const maxVal = funnelData[0].value;

  return (
    <Card title="客户转化漏斗">
      <div className="flex flex-col h-[calc(100%-2rem)] justify-center">
        {/* 漏斗主体 */}
        <div className="flex flex-col items-center">
          {funnelData.map((item, i) => {
            const widthPct = (item.value / maxVal) * 100;
            const width = 62 + widthPct * 0.33;
            const isLast = i === funnelData.length - 1;
            const nextItem = i < funnelData.length - 1 ? funnelData[i + 1] : null;
            const convRate = nextItem ? Math.round((nextItem.value / item.value) * 100) : null;

            const colors = [
              { from: '#2563EB', to: '#3B82F6' },
              { from: '#3B82F6', to: '#60A5FA' },
              { from: '#60A5FA', to: '#93C5FD' },
              { from: '#059669', to: '#10B981' },
            ];

            return (
              <div key={item.label} className="w-full flex flex-col items-center">
                {/* 阶段条 */}
                <div
                  className="relative flex items-center justify-between px-5 text-white text-[13px] font-semibold shadow-sm"
                  style={{
                    width: `${width}%`,
                    height: 44,
                    background: `linear-gradient(135deg, ${colors[i].from}, ${colors[i].to})`,
                    clipPath: isLast
                      ? 'polygon(4% 0%, 96% 0%, 100% 100%, 0% 100%)'
                      : 'polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)',
                    borderRadius: isLast ? '0 0 8px 8px' : undefined,
                  }}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">{i + 1}</span>
                    {item.label}
                  </span>
                  <span className="tabular-nums font-bold">{item.value}</span>
                </div>

                {/* 本阶段→下一阶段的转化率 */}
                {convRate !== null && !isLast && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 py-0.5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-slate-300">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    转化率 {convRate}%
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 汇总信息 */}
        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">总线索</p>
            <p className="text-base font-bold text-slate-800">{funnelData[0].value}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">总成交</p>
            <p className="text-base font-bold text-slate-800">{funnelData[funnelData.length - 1].value}</p>
          </div>
          <div className="text-center">
            <p className="text-[11px] text-slate-400 mb-0.5">整体转化率</p>
            <p className="text-base font-bold text-emerald-600">
              {Math.round((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
