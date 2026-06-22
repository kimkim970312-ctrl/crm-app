'use client';

import { useState } from 'react';
import { Card } from './Card';

type RankType = 'sales' | 'conversion';

interface RankItem { name: string; value: number; unit: string }

const salesData: RankItem[] = [
  { name: '张明远', value: 286000, unit: '元' },
  { name: '赵雨萱', value: 235000, unit: '元' },
  { name: '李思琪', value: 198000, unit: '元' },
  { name: '王浩然', value: 175000, unit: '元' },
  { name: '金扶摇', value: 142000, unit: '元' },
  { name: '周经理',   value: 128000, unit: '元' },
  { name: '吴主管',   value: 96000,  unit: '元' },
  { name: '郑专员',   value: 85000,  unit: '元' },
  { name: '孙代表',   value: 72000,  unit: '元' },
  { name: '冯专员',   value: 58000,  unit: '元' },
];

const conversionData: RankItem[] = [
  { name: '赵雨萱', value: 38, unit: '%' },
  { name: '张明远', value: 35, unit: '%' },
  { name: '金扶摇', value: 32, unit: '%' },
  { name: '李思琪', value: 29, unit: '%' },
  { name: '王浩然', value: 26, unit: '%' },
  { name: '周经理',   value: 22, unit: '%' },
  { name: '吴主管',   value: 19, unit: '%' },
  { name: '郑专员',   value: 17, unit: '%' },
  { name: '孙代表',   value: 15, unit: '%' },
  { name: '冯专员',   value: 12, unit: '%' },
];

const TABS: { key: RankType; label: string }[] = [
  { key: 'sales', label: '销售业绩' },
  { key: 'conversion', label: '转化率' },
];

const TOP_COLORS = ['#2563EB', '#3B82F6', '#60A5FA'];

export default function SalesRanking() {
  const [activeTab, setActiveTab] = useState<RankType>('sales');
  const data = activeTab === 'sales' ? salesData : conversionData;
  const maxVal = Math.max(...data.map((d) => d.value));

  const fmt = (v: number, u: string) => {
    if (u === '元') return `¥${(v / 1000).toFixed(0)}k`;
    return `${v}%`;
  };

  return (
    <Card title="销售人员业绩排行榜">
      <div className="flex flex-col h-[calc(100%-2rem)]">
        {/* Tab */}
        <div className="flex items-center justify-end mb-3">
          <div className="inline-flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-md transition-all duration-150 ${
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

        {/* 排行列表 — flex-1 填满空间 */}
        <div className="flex-1 flex flex-col justify-around space-y-1.5">
          {data.map((item, i) => {
            const pct = (item.value / maxVal) * 100;
            const barColor = i < 3 ? TOP_COLORS[i] : '#CBD5E1';

            return (
              <div key={item.name} className="flex items-center gap-3 group">
                {/* 排名 */}
                <div className="w-6 text-center flex-shrink-0">
                  {i < 3 ? (
                    <span className="text-sm">{['🥇', '🥈', '🥉'][i]}</span>
                  ) : (
                    <span className="text-[12px] font-semibold text-slate-400">{i + 1}</span>
                  )}
                </div>

                {/* 名字 */}
                <span className="w-14 text-[13px] text-slate-700 font-medium truncate flex-shrink-0">
                  {item.name}
                </span>

                {/* 进度条 */}
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${pct}%`,
                      background: i < 3 ? barColor : '#E2E8F0',
                    }}
                  />
                  <span
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold tabular-nums"
                    style={{ color: pct > 30 ? 'white' : '#94A3B8' }}
                  >
                    {fmt(item.value, item.unit)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
