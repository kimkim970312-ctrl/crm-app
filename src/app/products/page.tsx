'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product, ProductFilter, ProductListResponse, ProductStatus } from '@/types/product';
import FilterBar from '@/components/products/FilterBar';
import ProductTable from '@/components/products/ProductTable';
import Pagination from '@/components/leads/Pagination';
import Drawer from '@/components/Drawer';
import ProductDetail from '@/components/products/ProductDetail';
import ProductEdit from '@/components/products/ProductEdit';
import AddProductModal from '@/components/products/AddProductModal';
import DeleteConfirmModal from '@/components/products/DeleteConfirmModal';
import { usePermission } from '@/hooks/usePermission';

export default function ProductsPage() {
  const perms = usePermission('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<ProductFilter>({});

  // 抽屉/弹窗状态
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /** Toast 消息 */
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  /** 获取商品列表 */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (filter.createdAtStart) params.set('createdAtStart', filter.createdAtStart);
      if (filter.createdAtEnd) params.set('createdAtEnd', filter.createdAtEnd);
      if (filter.code) params.set('code', filter.code);
      if (filter.name) params.set('name', filter.name);
      if (filter.status) params.set('status', filter.status);
      if (filter.category) params.set('category', filter.category);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error('请求失败');

      const data: ProductListResponse = await res.json();
      setProducts(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('获取商品列表失败:', err);
      setProducts([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /** 筛选查询 */
  const handleFilter = (newFilter: ProductFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  /** 翻页 */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // ========== 详情 ==========
  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };

  // ========== 修改 ==========
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleEditSave = async (data: { name: string; price: number; status: ProductStatus; category: string; description: string }) => {
    if (!selectedProduct) return;
    try {
      const res = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedProduct.id, ...data }),
      });
      if (!res.ok) throw new Error('修改失败');
      showToast('商品修改成功');
      setEditOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch {
      showToast('修改失败，请重试', 'error');
    }
  };

  // ========== 删除 ==========
  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      const res = await fetch(`/api/products?id=${selectedProduct.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      showToast('商品已删除');
      setDeleteOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch {
      showToast('删除失败，请重试', 'error');
    }
  };

  // ========== 新增 ==========
  const handleAddSubmit = async (data: { name: string; price: number; status: ProductStatus; category: string; description: string }) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('添加失败');
      showToast('新商品添加成功');
      setAddOpen(false);
      fetchProducts();
    } catch {
      showToast('添加失败，请重试', 'error');
    }
  };

  return (
    <div className="flex-1 ml-60">
      {/* 顶栏 */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">商品管理</h1>
          <span className="text-[13px] text-slate-400 font-normal">管理和维护所有商品信息</span>
        </div>
      </header>

      {/* 内容区 */}
      <main className="px-8 py-6">
        <FilterBar onFilter={handleFilter} />

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-700">商品列表</h2>
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
                新增商品
              </button>
              )}
            </div>
          </div>

          <ProductTable products={products} loading={loading} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />

          <Pagination page={page} pageSize={pageSize} total={total} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </main>

      {/* ========== 详情抽屉 ========== */}
      <Drawer open={detailOpen} onClose={() => { setDetailOpen(false); setSelectedProduct(null); }} title="商品详情">
        {selectedProduct && <ProductDetail product={selectedProduct} />}
      </Drawer>

      {/* ========== 修改抽屉 ========== */}
      <Drawer open={editOpen} onClose={() => { setEditOpen(false); setSelectedProduct(null); }} title="修改商品">
        {selectedProduct && (
          <ProductEdit
            product={selectedProduct}
            onSave={handleEditSave}
            onCancel={() => { setEditOpen(false); setSelectedProduct(null); }}
          />
        )}
      </Drawer>

      {/* ========== 新增商品弹窗 ========== */}
      <AddProductModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAddSubmit} />

      {/* ========== 删除确认弹窗 ========== */}
      <DeleteConfirmModal
        open={deleteOpen}
        productName={selectedProduct?.name || ''}
        productId={selectedProduct?.id || ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteOpen(false); setSelectedProduct(null); }}
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
