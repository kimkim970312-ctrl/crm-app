'use client';

import { useState, useEffect, useCallback } from 'react';
import { Account, AccountFilter, AccountListResponse } from '@/types/account';
import FilterBar from '@/components/accounts/FilterBar';
import AccountTable from '@/components/accounts/AccountTable';
import Pagination from '@/components/leads/Pagination';
import AddAccountModal from '@/components/accounts/AddAccountModal';
import EditAccountDrawer from '@/components/accounts/EditAccountDrawer';
import ResetPasswordModal from '@/components/accounts/ResetPasswordModal';
import DeleteConfirmModal from '@/components/accounts/DeleteConfirmModal';

export default function AccountsPage() {
  // ========== 列表状态 ==========
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AccountFilter>({
    createdAtStart: '', createdAtEnd: '', phone: '', name: '', roleName: '',
    page: 1, pageSize: 10,
  });

  // ========== 弹窗/抽屉状态 ==========
  const [showAdd, setShowAdd] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showResetPwd, setShowResetPwd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // ========== Toast ==========
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ========== 获取列表 ==========
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.createdAtStart) params.set('createdAtStart', filter.createdAtStart);
      if (filter.createdAtEnd) params.set('createdAtEnd', filter.createdAtEnd);
      if (filter.phone) params.set('phone', filter.phone);
      if (filter.name) params.set('name', filter.name);
      if (filter.roleName) params.set('roleName', filter.roleName);
      params.set('page', String(filter.page || 1));
      params.set('pageSize', String(filter.pageSize || 10));

      const res = await fetch(`/api/accounts?${params}`);
      const data: AccountListResponse = await res.json();
      setAccounts(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      showToast('获取账号列表失败', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // ========== 查询 ==========
  const handleSearch = () => {
    setFilter((prev) => ({ ...prev, page: 1 }));
  };

  // ========== 分页 ==========
  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  // ========== 新增 ==========
  const handleAdd = async (phone: string, name: string, roleId: string, roleName: string) => {
    const res = await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, name, roleId, roleName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '新增失败');
    }
    showToast('账号新增成功');
    setShowAdd(false);
    fetchAccounts();
  };

  // ========== 修改 ==========
  const handleEdit = async (phone: string, name: string, roleId?: string, roleName?: string) => {
    if (!selectedAccount) return;
    const res = await fetch('/api/accounts', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedAccount.id, phone, name, roleId, roleName }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '修改失败');
    }
    showToast('账号修改成功');
    setEditOpen(false);
    setSelectedAccount(null);
    fetchAccounts();
  };

  // ========== 重置密码 ==========
  const handleResetPwd = async (id: string) => {
    const res = await fetch('/api/accounts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '重置失败');
    }
    showToast('密码已重置为 123456');
    setShowResetPwd(false);
    setSelectedAccount(null);
  };

  // ========== 删除 ==========
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/accounts?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '删除失败');
    }
    showToast('账号已删除');
    setShowDelete(false);
    setSelectedAccount(null);
    fetchAccounts();
  };

  return (
    <div className="flex-1 ml-60">
      {/* 顶栏 */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">账号管理</h1>
          <span className="text-[13px] text-slate-400 font-normal">管理系统登录账号</span>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg shadow-lg text-[13px] font-semibold transition-all duration-300 ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* 内容区 */}
      <main className="px-8 py-6">
        <FilterBar filter={filter} onFilterChange={setFilter} onSearch={handleSearch} />

        {/* 账号列表 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700">账号列表</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center justify-center gap-2 h-[30px] px-[10px] text-[12px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                新增账号
              </button>
            </div>
          </div>

          <AccountTable
            accounts={accounts}
            loading={loading}
            onEdit={(account) => { setSelectedAccount(account); setEditOpen(true); }}
            onResetPwd={(account) => { setSelectedAccount(account); setShowResetPwd(true); }}
            onDelete={(account) => { setSelectedAccount(account); setShowDelete(true); }}
          />
          <Pagination
            page={filter.page!}
            pageSize={filter.pageSize!}
            total={total}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* 弹窗 */}
        <AddAccountModal visible={showAdd} onClose={() => setShowAdd(false)} onSubmit={handleAdd} />
        <EditAccountDrawer visible={editOpen} account={selectedAccount} onClose={() => { setEditOpen(false); setSelectedAccount(null); }} onSubmit={handleEdit} />
        <ResetPasswordModal visible={showResetPwd} account={selectedAccount} onClose={() => { setShowResetPwd(false); setSelectedAccount(null); }} onConfirm={handleResetPwd} />
        <DeleteConfirmModal visible={showDelete} account={selectedAccount} onClose={() => { setShowDelete(false); setSelectedAccount(null); }} onConfirm={handleDelete} />
      </main>
    </div>
  );
}
