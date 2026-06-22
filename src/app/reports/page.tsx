'use client';

import StatCards from '@/components/reports/StatCards';
import TrendChart from '@/components/reports/TrendChart';
import LeadSourceChart from '@/components/reports/LeadSourceChart';
import ConversionFunnel from '@/components/reports/ConversionFunnel';
import ProductPieChart from '@/components/reports/ProductPieChart';
import SalesRanking from '@/components/reports/SalesRanking';

export default function ReportsPage() {
  return (
    <div className="flex-1 ml-60">
      {/* 顶栏 — 与线索管理完全一致的风格 */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">数据仪表盘</h1>
          <span className="text-[13px] text-slate-400 font-normal">实时查看业务数据概览</span>
        </div>
      </header>

      {/* 内容区 */}
      <main className="px-8 py-6">
        {/* 顶部核心数据卡片 */}
        <StatCards />

        {/* 业绩趋势图（全宽） */}
        <TrendChart />

        {/* 图表区域 — 等宽两列，items-stretch 保证同行卡片等高 */}
        <div className="grid grid-cols-2 gap-6 mb-6 items-stretch">
          <LeadSourceChart />
          <ConversionFunnel />
        </div>

        <div className="grid grid-cols-2 gap-6 items-stretch">
          <ProductPieChart />
          <SalesRanking />
        </div>
      </main>
    </div>
  );
}
