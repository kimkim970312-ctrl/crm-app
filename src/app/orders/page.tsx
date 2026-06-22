'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order, OrderFilter, OrderListResponse } from '@/types/order';
import FilterBar from '@/components/orders/FilterBar';
import OrderTable from '@/components/orders/OrderTable';
import Pagination from '@/components/leads/Pagination';
import Drawer from '@/components/Drawer';
import OrderDetail from '@/components/orders/OrderDetail';
import OrderEdit from '@/components/orders/OrderEdit';
import AddOrderModal from '@/components/orders/AddOrderModal';
import DeleteConfirmModal from '@/components/orders/DeleteConfirmModal';
import { usePermission } from '@/hooks/usePermission';

export default function OrdersPage() {
  const perms = usePermission('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<OrderFilter>({});

  // 抽屉/弹窗状态
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // 客户和商品列表（供弹窗使用）
  const [leads, setLeads] = useState<{ name: string; phone: string }[]>([]);
  const [products, setProducts] = useState<{ code: string; name: string; price: number }[]>([]);

  /** Toast 消息 */
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  /** 加载客户和商品列表（编辑抽屉使用） */
  const loadLeadsAndProducts = useCallback(async () => {
    try {
      const [leadsRes, productsRes] = await Promise.all([
        fetch('/api/orders?type=leads').then((r) => r.json()),
        fetch('/api/orders?type=products').then((r) => r.json()),
      ]);
      setLeads(leadsRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err) {
      console.error('加载客户/商品数据失败:', err);
    }
  }, []);

  /** 获取订单列表 */
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (filter.createdAtStart) params.set('createdAtStart', filter.createdAtStart);
      if (filter.createdAtEnd) params.set('createdAtEnd', filter.createdAtEnd);
      if (filter.orderNo) params.set('orderNo', filter.orderNo);
      if (filter.customerName) params.set('customerName', filter.customerName);
      if (filter.customerPhone) params.set('customerPhone', filter.customerPhone);
      if (filter.productName) params.set('productName', filter.productName);

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (!res.ok) throw new Error('请求失败');

      const data: OrderListResponse = await res.json();
      setOrders(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('获取订单列表失败:', err);
      setOrders([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /** 筛选查询 */
  const handleFilter = (newFilter: OrderFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  /** 翻页 */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // ========== 详情 ==========
  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  // ========== 修改 ==========
  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    loadLeadsAndProducts();
    setEditOpen(true);
  };

  const handleEditSave = async (data: { customerName: string; customerPhone: string; productCode: string; productName: string; amount: number }) => {
    if (!selectedOrder) return;
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedOrder.id, ...data }),
      });
      if (!res.ok) throw new Error('修改失败');
      showToast('订单修改成功');
      setEditOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch {
      showToast('修改失败，请重试', 'error');
    }
  };

  // ========== 删除 ==========
  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/orders?id=${selectedOrder.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      showToast('订单已删除');
      setDeleteOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch {
      showToast('删除失败，请重试', 'error');
    }
  };

  // ========== 新增 ==========
  const handleAddSubmit = async (data: { customerName: string; customerPhone: string; productCode: string; productName: string; amount: number }) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('添加失败');
      showToast('新订单添加成功');
      setAddOpen(false);
      fetchOrders();
    } catch {
      showToast('添加失败，请重试', 'error');
    }
  };

  return (
    <div className="flex-1 ml-60">
      {/* 顶栏 */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">订单管理</h1>
          <span className="text-[13px] text-slate-400 font-normal">管理和跟踪所有客户订单</span>
        </div>
      </header>

      {/* 内容区 */}
      <main className="px-8 py-6">
        <FilterBar onFilter={handleFilter} />

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700">订单列表</h2>
            <div className="flex items-center gap-2">
              {perms.canCreate && (
              <button
                onClick={() => setAddOpen(true)}
                className="inline-flex items-center justify-center gap-2 h-[30px] px-[10px] text-[12px] font-semibold rounded-md bg-primary-600 text-white border border-primary-600 cursor-pointer transition-all duration-150 hover:bg-primary-700"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                新增订单
              </button>
              )}
            </div>
          </div>

          <OrderTable orders={orders} loading={loading} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />

          <Pagination page={page} pageSize={pageSize} total={total} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </main>

      {/* ========== 详情抽屉 ========== */}
      <Drawer open={detailOpen} onClose={() => { setDetailOpen(false); setSelectedOrder(null); }} title="订单详情">
        {selectedOrder && <OrderDetail order={selectedOrder} />}
      </Drawer>

      {/* ========== 修改抽屉 ========== */}
      <Drawer open={editOpen} onClose={() => { setEditOpen(false); setSelectedOrder(null); }} title="修改订单">
        {selectedOrder && (
          <OrderEdit
            order={selectedOrder}
            leads={leads}
            products={products}
            onSave={handleEditSave}
            onCancel={() => { setEditOpen(false); setSelectedOrder(null); }}
          />
        )}
      </Drawer>

      {/* ========== 新增订单弹窗 ========== */}
      <AddOrderModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAddSubmit} />

      {/* ========== 删除确认弹窗 ========== */}
      <DeleteConfirmModal
        open={deleteOpen}
        orderName={selectedOrder?.orderNo || ''}
        orderId={selectedOrder?.id || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteOpen(false); setSelectedOrder(null); }}
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
