'use client';

import { useState } from 'react';
import { Card } from './Card';

type TrendType = 'sales' | 'leads' | 'orders';

interface DayData { label: string; value: number }

const TABS: { key: TrendType; label: string; unit: string }[] = [
  { key: 'sales', label: '销售额', unit: '¥' },
  { key: 'leads', label: '客户线索数', unit: '' },
  { key: 'orders', label: '订单数', unit: '' },
];

function generateData(type: TrendType): DayData[] {
  const labels: string[] = [];
  const today = new Date();
  for (let i = 14; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
  }
  const map: Record<TrendType, number[]> = {
    sales:    [12000, 15000, 9800, 16500, 14200, 13000, 18000, 15500, 11000, 17500, 16000, 19000, 14500, 20000, 18500],
    leads:    [8, 12, 6, 15, 10, 9, 14, 11, 7, 13, 16, 10, 8, 18, 12],
    orders:   [5, 8, 4, 10, 7, 6, 9, 8, 5, 11, 9, 12, 7, 14, 10],
  };
  return labels.map((l, i) => ({ label: l, value: map[type][i] }));
}

/** 计算平滑曲线的 control points，生成 SVG C 命令 */
function smoothCurve(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  const n = points.length;
  const cp = points.map((p, i) => {
    if (i === 0) return { cp1: p, cp2: p };
    if (i === n - 1) return { cp1: p, cp2: p };
    const prev = points[i - 1];
    const next = points[i + 1];
    const dx = (next.x - prev.x) / 6;
    const dy = (next.y - prev.y) / 6;
    return {
      cp1: { x: p.x + dx, y: p.y + dy },
      cp2: { x: p.x - dx, y: p.y - dy },
    };
  });

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < n; i++) {
    const p1 = cp[i - 1].cp1;
    const p2 = cp[i].cp2;
    d += ` C ${p1.x},${p1.y} ${p2.x},${p2.y} ${points[i].x},${points[i].y}`;
  }
  return d;
}

export default function TrendChart() {
  const [activeTab, setActiveTab] = useState<TrendType>('sales');
  const data = generateData(activeTab);
  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;

  // 用 viewBox 自适应宽度，缩小比例与其他图表和谐
  const W = 720, H = 160;
  const padL = 42, padR = 14, padT = 14, padB = 26;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const xStep = chartW / (data.length - 1);

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: padT + chartH * (1 - pct),
    label: Math.round(minVal + range * pct).toLocaleString(),
  }));

  const points = data.map((d, i) => ({
    x: padL + i * xStep,
    y: padT + chartH * (1 - (d.value - minVal) / range),
  }));

  // 平滑曲线
  const smoothPath = smoothCurve(points);
  // 面积图（用平滑曲线 + 底部闭合）
  const areaPath = `${smoothPath} L${points[points.length - 1].x},${padT + chartH} L${points[0].x},${padT + chartH} Z`;

  // 最近一天高亮
  const last = points[points.length - 1];
  const lastData = data[data.length - 1];

  return (
    <Card title="业绩趋势图" className="mb-6">
      {/* Tab 切换 */}
      <div className="flex items-center justify-end -mt-1 mb-3">
        <div className="inline-flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-md transition-all duration-150 ${
                activeTab === tab.key
                  ? 'bg-white text-primary-600 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG 折线图 — 响应式宽度，viewBox 让线条填满卡片 */}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* 网格线 */}
        {gridLines.map((gl, i) => (
          <g key={i}>
            <line x1={padL} y1={gl.y} x2={W - padR} y2={gl.y} stroke="#F1F5F9" strokeWidth="1" />
            <text x={padL - 8} y={gl.y + 3} textAnchor="end" fill="#94A3B8" fontSize="10" fontFamily="inherit">
              {activeTab === 'sales' ? `¥${Math.round(Number(gl.label.replace(/,/g, '')) / 1000)}k` : gl.label}
            </text>
          </g>
        ))}

        {/* 面积 */}
        <path d={areaPath} fill="url(#tg)" />

        {/* 平滑折线 */}
        <path d={smoothPath} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* 数据点 */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="2.5" fill="white" stroke="#2563EB" strokeWidth="1.5" className="cursor-pointer" />
            <title>{data[i].label}: {activeTab === 'sales' ? `¥${data[i].value.toLocaleString()}` : data[i].value}</title>
          </g>
        ))}

        {/* 最新数据高亮 */}
        <circle cx={last.x} cy={last.y} r="4" fill="#2563EB" stroke="white" strokeWidth="2" className="cursor-pointer" />
        <text x={last.x} y={last.y - 10} textAnchor="middle" fill="#2563EB" fontSize="10" fontWeight="700" fontFamily="inherit">
          {activeTab === 'sales' ? `¥${lastData.value.toLocaleString()}` : lastData.value}
        </text>

        {/* X 轴标签 */}
        {data.map((d, i) =>
          (i % 2 === 0 || i === data.length - 1) ? (
            <text key={i} x={padL + i * xStep} y={H - 6} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="inherit">
              {d.label}
            </text>
          ) : null
        )}
      </svg>
    </Card>
  );
}
