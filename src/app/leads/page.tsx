'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Lead, LeadFilter, LeadListResponse, Priority, Source } from '@/types/lead';
import FilterBar from '@/components/leads/FilterBar';
import LeadTable from '@/components/leads/LeadTable';
import Pagination from '@/components/leads/Pagination';
import Drawer from '@/components/Drawer';
import LeadDetail from '@/components/leads/LeadDetail';
import LeadEdit from '@/components/leads/LeadEdit';
import AddLeadModal from '@/components/leads/AddLeadModal';
import DeleteConfirmModal from '@/components/leads/DeleteConfirmModal';
import { usePermission } from '@/hooks/usePermission';

export default function LeadsPage() {
  const perms = usePermission('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<LeadFilter>({});

  // 抽屉/弹窗状态
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  /** Toast 消息 */
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  /** 获取线索列表 */
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (filter.createdAtStart) params.set('createdAtStart', filter.createdAtStart);
      if (filter.createdAtEnd) params.set('createdAtEnd', filter.createdAtEnd);
      if (filter.name) params.set('name', filter.name);
      if (filter.phone) params.set('phone', filter.phone);
      if (filter.priority) params.set('priority', filter.priority);
      if (filter.source) params.set('source', filter.source);

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error('请求失败');

      const data: LeadListResponse = await res.json();
      setLeads(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('获取线索列表失败:', err);
      setLeads([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  /** 筛选查询（FilterBar onFilter） */
  const handleFilter = (newFilter: LeadFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  /** 翻页 */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // ========== 详情 ==========
  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailOpen(true);
  };

  // ========== 修改 ==========
  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setEditOpen(true);
  };

  const handleEditSave = async (data: { name: string; phone: string; priority: Priority; source: Source; follower: string[] }) => {
    if (!selectedLead) return;
    try {
      const res = await fetch('/api/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedLead.id, ...data }),
      });
      if (!res.ok) throw new Error('修改失败');
      showToast('线索修改成功');
      setEditOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch {
      showToast('修改失败，请重试', 'error');
    }
  };

  // ========== 删除 ==========
  const handleDelete = (lead: Lead) => {
    setSelectedLead(lead);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLead) return;
    try {
      const res = await fetch(`/api/leads?id=${selectedLead.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      showToast('线索已删除');
      setDeleteOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch {
      showToast('删除失败，请重试', 'error');
    }
  };

  // ========== 新增 ==========
  const handleAddSubmit = async (data: { name: string; phone: string; priority: Priority; source: Source; follower: string[] }) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('添加失败');
      showToast('新线索添加成功');
      setAddOpen(false);
      fetchLeads();
    } catch {
      showToast('添加失败，请重试', 'error');
    }
  };

  // ========== 导出 ==========
  const handleExport = () => {
    const params = new URLSearchParams();
    if (filter.createdAtStart) params.set('createdAtStart', filter.createdAtStart);
    if (filter.createdAtEnd) params.set('createdAtEnd', filter.createdAtEnd);
    if (filter.name) params.set('name', filter.name);
    if (filter.phone) params.set('phone', filter.phone);
    if (filter.priority) params.set('priority', filter.priority);
    if (filter.source) params.set('source', filter.source);

    window.open(`/api/leads/export?${params.toString()}`, '_blank');
  };

  return (
    <div className="flex-1 ml-60">
      {/* 顶栏 */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">线索管理</h1>
          <span className="text-[13px] text-slate-400 font-normal">管理和跟踪所有潜在客户线索</span>
        </div>
      </header>

      {/* 内容区 */}
      <main className="px-8 py-6">
        <FilterBar onFilter={handleFilter} />

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700">线索列表</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center justify-center gap-2 h-[30px] px-[10px] text-[12px] font-semibold rounded-md bg-white text-slate-600 border border-slate-200 cursor-pointer transition-all duration-150 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                导出
              </button>
              {perms.canCreate && (
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center justify-center gap-2 h-[30px] px-[10px] text-[12px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                新增线索
              </button>
              )}
            </div>
          </div>

          <LeadTable leads={leads} loading={loading} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} perms={perms} />

          <Pagination page={page} pageSize={pageSize} total={total} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </main>

      {/* ========== 详情抽屉 ========== */}
      <Drawer open={detailOpen} onClose={() => { setDetailOpen(false); setSelectedLead(null); }} title="线索详情">
        {selectedLead && <LeadDetail lead={selectedLead} />}
      </Drawer>

      {/* ========== 修改抽屉 ========== */}
      <Drawer open={editOpen} onClose={() => { setEditOpen(false); setSelectedLead(null); }} title="修改线索">
        {selectedLead && (
          <LeadEdit
            lead={selectedLead}
            onSave={handleEditSave}
            onCancel={() => { setEditOpen(false); setSelectedLead(null); }}
          />
        )}
      </Drawer>

      {/* ========== 新增线索弹窗 ========== */}
      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAddSubmit} />

      {/* ========== 删除确认弹窗 ========== */}
      <DeleteConfirmModal
        open={deleteOpen}
        leadName={selectedLead?.name || ''}
        leadId={selectedLead?.id || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteOpen(false); setSelectedLead(null); }}
      />

      {/* ========== Toast ========== */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-right">
          <div
            className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
              {toast.type === 'success' ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></>
              )}
            </svg>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
