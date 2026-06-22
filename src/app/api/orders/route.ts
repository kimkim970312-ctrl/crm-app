import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Order, OrderListResponse } from '@/types/order';

/** JSON 文件路径 */
function getFilePath() {
  return path.join(process.cwd(), 'data', 'orders.json');
}

/** 读取订单数据 */
async function getOrders(): Promise<Order[]> {
  const raw = await fs.readFile(getFilePath(), 'utf-8');
  const json = JSON.parse(raw);
  return json.orders as Order[];
}

/** 写入订单数据 */
async function saveOrders(orders: Order[]): Promise<void> {
  await fs.writeFile(getFilePath(), JSON.stringify({ orders }, null, 2), 'utf-8');
}

/** 生成订单 ID（DD-YYYYMMDDXXXX） */
function generateId(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `DD-${date}${seq}`;
}

/** 生成订单编号（ORD + 5位数字，自动递增） */
async function generateOrderNo(): Promise<string> {
  const orders = await getOrders();
  let maxNum = 0;
  for (const o of orders) {
    const match = o.orderNo.match(/^ORD(\d{5})$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const nextNum = maxNum + 1;
  return `ORD${String(nextNum).padStart(5, '0')}`;
}

/** 读取线索数据（用于关联客户信息） */
async function getLeads(): Promise<{ name: string; phone: string }[]> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'leads.json'), 'utf-8');
    const json = JSON.parse(raw);
    return json.leads.map((l: any) => ({ name: l.name, phone: l.phone }));
  } catch {
    return [];
  }
}

/** 读取商品数据（用于关联商品信息） */
async function getProducts(): Promise<{ code: string; name: string; price: number }[]> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'products.json'), 'utf-8');
    const json = JSON.parse(raw);
    return json.products.map((p: any) => ({ code: p.code, name: p.name, price: p.price }));
  } catch {
    return [];
  }
}

// ==================== GET：查询客户列表 + 商品列表（供新增/修改弹窗使用） ====================
// 通过 /api/orders?type=leads 获取客户列表，/api/orders?type=products 获取商品列表
// ==================== GET：查询订单列表 ====================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type') || '';

    // 特殊查询：获取客户列表（供弹窗使用）
    if (type === 'leads') {
      const leads = await getLeads();
      return NextResponse.json({ data: leads });
    }

    // 特殊查询：获取商品列表（供弹窗使用）
    if (type === 'products') {
      const products = await getProducts();
      return NextResponse.json({ data: products });
    }

    // 正常订单列表查询
    const createdAtStart = searchParams.get('createdAtStart') || '';
    const createdAtEnd = searchParams.get('createdAtEnd') || '';
    const orderNo = searchParams.get('orderNo') || '';
    const customerName = searchParams.get('customerName') || '';
    const customerPhone = searchParams.get('customerPhone') || '';
    const productName = searchParams.get('productName') || '';

    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(searchParams.get('pageSize')) || 10));

    let orders = await getOrders();

    // 筛选条件
    if (createdAtStart) orders = orders.filter((o) => o.createdAt >= createdAtStart);
    if (createdAtEnd) orders = orders.filter((o) => o.createdAt <= createdAtEnd);
    if (orderNo) orders = orders.filter((o) => o.orderNo.includes(orderNo));
    if (customerName) orders = orders.filter((o) => o.customerName.includes(customerName));
    if (customerPhone) orders = orders.filter((o) => o.customerPhone.includes(customerPhone));
    if (productName) orders = orders.filter((o) => o.productName.includes(productName));

    // 按创建时间倒序
    orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    // 分页
    const total = orders.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = orders.slice(start, start + pageSize);

    const response: OrderListResponse = { data, total, page, pageSize, totalPages };
    return NextResponse.json(response);
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return NextResponse.json({ error: '获取订单列表失败' }, { status: 500 });
  }
}

// ==================== POST：新增订单 ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, productCode, productName, amount } = body;

    if (!customerName || !customerPhone || !productName) {
      return NextResponse.json({ error: '客户名称、客户电话、下单商品为必填项' }, { status: 400 });
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return NextResponse.json({ error: '请输入有效的下单金额' }, { status: 400 });
    }

    const orders = await getOrders();
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const orderNo = await generateOrderNo();

    const newOrder: Order = {
      id: generateId(),
      createdAt,
      orderNo,
      customerName,
      customerPhone,
      productCode,
      productName,
      amount: Number(amount),
    };

    orders.push(newOrder);
    await saveOrders(orders);

    return NextResponse.json({ data: newOrder }, { status: 201 });
  } catch (error) {
    console.error('新增订单失败:', error);
    return NextResponse.json({ error: '新增订单失败' }, { status: 500 });
  }
}

// ==================== PUT：修改订单 ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, customerName, customerPhone, productCode, productName, amount } = body;

    if (!id) {
      return NextResponse.json({ error: '订单ID不能为空' }, { status: 400 });
    }

    const orders = await getOrders();
    const index = orders.findIndex((o) => o.id === id);

    if (index === -1) {
      return NextResponse.json({ error: '未找到该订单' }, { status: 404 });
    }

    // 更新字段（订单编号不修改）
    if (customerName !== undefined) orders[index].customerName = customerName;
    if (customerPhone !== undefined) orders[index].customerPhone = customerPhone;
    if (productCode !== undefined) orders[index].productCode = productCode;
    if (productName !== undefined) orders[index].productName = productName;
    if (amount !== undefined) orders[index].amount = Number(amount);

    await saveOrders(orders);

    return NextResponse.json({ data: orders[index] });
  } catch (error) {
    console.error('修改订单失败:', error);
    return NextResponse.json({ error: '修改订单失败' }, { status: 500 });
  }
}

// ==================== DELETE：删除订单 ====================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '订单ID不能为空' }, { status: 400 });
    }

    const orders = await getOrders();
    const index = orders.findIndex((o) => o.id === id);

    if (index === -1) {
      return NextResponse.json({ error: '未找到该订单' }, { status: 404 });
    }

    orders.splice(index, 1);
    await saveOrders(orders);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('删除订单失败:', error);
    return NextResponse.json({ error: '删除订单失败' }, { status: 500 });
  }
}
