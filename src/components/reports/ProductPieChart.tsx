'use client';

import { useState } from 'react';
import { Card } from './Card';

const pieData = [
  { label: '电子产品', value: 35, color: '#2563EB' },
  { label: '办公设备', value: 20, color: '#7C3AED' },
  { label: '家居用品', value: 15, color: '#D97706' },
  { label: '食品饮料', value: 12, color: '#059669' },
  { label: '服装配饰', value: 10, color: '#DC2626' },
  { label: '医疗保健', value: 8, color: '#0891B2' },
];

interface TooltipState {
  show: boolean;
  x: number;
  y: number;
  label: string;
  value: number;
  pct: string;
  color: string;
}

export default function ProductPieChart() {
  const total = pieData.reduce((s, d) => s + d.value, 0);

  const [tip, setTip] = useState<TooltipState>({ show: false, x: 0, y: 0, label: '', value: 0, pct: '', color: '' });

  const cx = 100, cy = 100, r = 80, hole = 50;
  let angle = -Math.PI / 2;

  const slices = pieData.map((slice) => {
    const a = (slice.value / total) * Math.PI * 2;
    const start = angle;
    const end = angle + a;

    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    const x1i = cx + hole * Math.cos(start), y1i = cy + hole * Math.sin(start);
    const x2i = cx + hole * Math.cos(end),   y2i = cy + hole * Math.sin(end);

    const large = a > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x2i} ${y2i} A ${hole} ${hole} 0 ${large} 0 ${x1i} ${y1i} Z`;

    const pct = ((slice.value / total) * 100).toFixed(1);

    angle = end;
    return { ...slice, path, pct };
  });

  const handleMouseEnter = (s: typeof slices[0], e: React.MouseEvent) => {
    const rect = e.currentTarget.closest('svg')!.getBoundingClientRect();
    setTip({
      show: true,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      label: s.label,
      value: s.value,
      pct: s.pct,
      color: s.color,
    });
  };

  const handleMouseMove = (s: typeof slices[0], e: React.MouseEvent) => {
    const rect = e.currentTarget.closest('svg')!.getBoundingClientRect();
    setTip(prev => ({
      ...prev,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }));
  };

  const handleMouseLeave = () => {
    setTip(prev => ({ ...prev, show: false }));
  };

  return (
    <Card title="售卖商品统计">
      <div className="flex items-center gap-6 h-[calc(100%-2rem)]">
        {/* SVG 环形图 */}
        <div className="flex-shrink-0 flex items-center justify-center relative">
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            {slices.map((s) => (
              <g key={s.label}>
                <path
                  d={s.path}
                  fill={s.color}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(s, e)}
                  onMouseMove={(e) => handleMouseMove(s, e)}
                  onMouseLeave={handleMouseLeave}
                />
              </g>
            ))}
            <text x={cx} y={cy - 6} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="inherit">总计</text>
            <text x={cx} y={cy + 10} textAnchor="middle" fill="#1E293B" fontSize="16" fontWeight="800" fontFamily="inherit">
              {total}
            </text>
          </svg>

          {/* 自定义 Tooltip — B 端标准样式 */}
          {tip.show && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: tip.x + 14,
                top: tip.y - 26,
              }}
            >
              <div className="bg-white rounded-lg shadow-lg border border-slate-200 px-3 py-2 flex items-center gap-2.5 whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tip.color }} />
                <span className="text-[13px] text-slate-700 font-medium">{tip.label}</span>
                <span className="w-px h-3 bg-slate-200" />
                <span className="text-[13px] font-semibold text-slate-800 tabular-nums">{tip.value}</span>
                <span className="text-[11px] text-slate-400 tabular-nums">{tip.pct}%</span>
              </div>
            </div>
          )}
        </div>

        {/* 图例 */}
        <div className="flex-1 space-y-1.5">
          {pieData.map((item) => {
            const pct = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={item.label} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded" style={{ background: item.color }} />
                  <span className="text-[13px] text-slate-600">{item.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold text-slate-800 tabular-nums">{item.value}</span>
                  <span className="text-[11px] text-slate-400 w-9 text-right tabular-nums">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
