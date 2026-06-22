'use client';

import { useState, useEffect, useCallback } from 'react';
import { Role, RoleFilter, RoleListResponse, PagePermission } from '@/types/role';
import FilterBar from '@/components/roles/FilterBar';
import RoleTable from '@/components/roles/RoleTable';
import Pagination from '@/components/leads/Pagination';
import AddRoleModal from '@/components/roles/AddRoleModal';
import EditRoleNameModal from '@/components/roles/EditRoleNameModal';
import PermissionModal from '@/components/roles/PermissionModal';
import DeleteConfirmModal from '@/components/roles/DeleteConfirmModal';

export default function RolesPage() {
  // ========== 列表状态 ==========
  const [roles, setRoles] = useState<Role[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RoleFilter>({ name: '', page: 1, pageSize: 10 });
  const [paginationKey, setPaginationKey] = useState(0);

  // ========== 弹窗状态 ==========
  const [showAdd, setShowAdd] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showPermission, setShowPermission] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // ========== 获取列表 ==========
  const fetchRoles = useCallback(async (f: RoleFilter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.name) params.set('name', f.name);
      params.set('page', String(f.page));
      params.set('pageSize', String(f.pageSize));
      const res = await fetch(`/api/roles?${params}`);
      const data: RoleListResponse = await res.json();
      setRoles(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles(filter);
  }, [filter.page, filter.pageSize, fetchRoles]);

  // ========== 查询 ==========
  const handleSearch = () => {
    const newFilter = { ...filter, page: 1 };
    setFilter(newFilter);
    fetchRoles(newFilter);
  };

  // ========== 分页 ==========
  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
    setPaginationKey((k) => k + 1);
  };

  const handlePageSizeChange = (pageSize: number) => {
    setFilter((prev) => ({ ...prev, page: 1, pageSize }));
  };

  // ========== 新增 ==========
  const handleAdd = async (name: string) => {
    const res = await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '新增失败');
    }
    setShowAdd(false);
    fetchRoles(filter);
  };

  // ========== 修改角色名 ==========
  const handleRename = async (id: string, name: string) => {
    const res = await fetch('/api/roles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '修改失败');
    }
    setShowRename(false);
    setSelectedRole(null);
    fetchRoles(filter);
  };

  // ========== 修改权限 ==========
  const handlePermissionSave = async (id: string, permissions: PagePermission[]) => {
    const res = await fetch('/api/roles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, permissions }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '保存权限失败');
    }
    setShowPermission(false);
    setSelectedRole(null);
    fetchRoles(filter);
  };

  // ========== 删除 ==========
  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/roles?id=${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || '删除失败');
    }
    setShowDelete(false);
    setSelectedRole(null);
    fetchRoles(filter);
  };

  return (
    <div className="flex-1 ml-60">
      {/* 顶栏 */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">角色与权限管理</h1>
          <span className="text-[13px] text-slate-400 font-normal">管理系统角色和页面访问权限</span>
        </div>
      </header>

      {/* 内容区 */}
      <main className="px-8 py-6">
        <FilterBar filter={filter} onFilterChange={setFilter} onSearch={handleSearch} />

        {/* 角色列表 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700">角色列表</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center justify-center gap-2 h-[30px] px-[10px] text-[12px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                新增角色
              </button>
            </div>
          </div>

        <RoleTable
          roles={roles}
          loading={loading}
          onRename={(role) => { setSelectedRole(role); setShowRename(true); }}
          onPermission={(role) => { setSelectedRole(role); setShowPermission(true); }}
          onDelete={(role) => { setSelectedRole(role); setShowDelete(true); }}
        />
        <Pagination
          key={paginationKey}
          page={filter.page!}
          pageSize={filter.pageSize!}
          total={total}
          totalPages={Math.ceil(total / filter.pageSize!)}
          onPageChange={handlePageChange}
        />
      </div>

        {/* 弹窗 */}
        <AddRoleModal visible={showAdd} onClose={() => setShowAdd(false)} onSubmit={handleAdd} />
        <EditRoleNameModal visible={showRename} role={selectedRole} onClose={() => { setShowRename(false); setSelectedRole(null); }} onSubmit={handleRename} />
        <PermissionModal visible={showPermission} role={selectedRole} onClose={() => { setShowPermission(false); setSelectedRole(null); }} onSubmit={handlePermissionSave} />
        <DeleteConfirmModal visible={showDelete} role={selectedRole} onClose={() => { setShowDelete(false); setSelectedRole(null); }} onConfirm={handleDelete} />
      </main>
    </div>
  );
}
