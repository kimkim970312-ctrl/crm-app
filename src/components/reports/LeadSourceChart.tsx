'use client';

import { Card } from './Card';

const sourceData = [
  { label: '官网', value: 42, color: '#2563EB' },
  { label: '广告投放', value: 35, color: '#D97706' },
  { label: '转介绍', value: 28, color: '#7C3AED' },
  { label: '社交媒体', value: 22, color: '#DC2626' },
  { label: '活动', value: 18, color: '#059669' },
];

export default function LeadSourceChart() {
  const maxVal = Math.max(...sourceData.map((d) => d.value));
  const total = sourceData.reduce((s, d) => s + d.value, 0);

  return (
    <Card title="线索来源排行榜">
      <div className="flex flex-col h-[calc(100%-2rem)]">
        <div className="flex-1 flex flex-col justify-around space-y-5">
          {sourceData.map((item) => {
            const pct = (item.value / maxVal) * 100;
            const share = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded" style={{ background: item.color }} />
                    <span className="text-[13px] text-slate-700 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold text-slate-800 tabular-nums">{item.value}</span>
                    <span className="text-[11px] text-slate-400 w-9 text-right tabular-nums">{share}%</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%`, background: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {/* 汇总 */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px]">
          <span className="text-slate-400">共 <span className="font-semibold text-slate-700">{total}</span> 条线索</span>
          <span className="text-slate-400">5 个来源渠道</span>
        </div>
      </div>
    </Card>
  );
}
