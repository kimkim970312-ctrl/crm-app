import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Product, ProductListResponse, ProductStatus } from '@/types/product';

/** JSON 文件路径 */
function getFilePath() {
  return path.join(process.cwd(), 'data', 'products.json');
}

/** 读取商品数据 */
async function getProducts(): Promise<Product[]> {
  const raw = await fs.readFile(getFilePath(), 'utf-8');
  const json = JSON.parse(raw);
  return json.products as Product[];
}

/** 写入商品数据 */
async function saveProducts(products: Product[]): Promise<void> {
  await fs.writeFile(getFilePath(), JSON.stringify({ products }, null, 2), 'utf-8');
}

/** 生成商品 ID（SP-YYYYMMDDXXXX） */
function generateId(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `SP-${date}${seq}`;
}

/** 生成商品编码（PROD + 5位数字，自动递增） */
async function generateCode(): Promise<string> {
  const products = await getProducts();
  let maxNum = 0;
  for (const p of products) {
    const match = p.code.match(/^PROD(\d{5})$/);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  const nextNum = maxNum + 1;
  return `PROD${String(nextNum).padStart(5, '0')}`;
}

// ==================== GET：查询列表 ====================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const createdAtStart = searchParams.get('createdAtStart') || '';
    const createdAtEnd = searchParams.get('createdAtEnd') || '';
    const code = searchParams.get('code') || '';
    const name = searchParams.get('name') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';

    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(searchParams.get('pageSize')) || 10));

    let products = await getProducts();

    // 筛选条件
    if (createdAtStart) products = products.filter((p) => p.createdAt >= createdAtStart);
    if (createdAtEnd) products = products.filter((p) => p.createdAt <= createdAtEnd);
    if (code) products = products.filter((p) => p.code.includes(code));
    if (name) products = products.filter((p) => p.name.includes(name));
    if (status) products = products.filter((p) => p.status === status);
    if (category) products = products.filter((p) => p.category === category);

    // 按创建时间倒序
    products.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    // 分页
    const total = products.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = products.slice(start, start + pageSize);

    const response: ProductListResponse = { data, total, page, pageSize, totalPages };
    return NextResponse.json(response);
  } catch (error) {
    console.error('获取商品列表失败:', error);
    return NextResponse.json({ error: '获取商品列表失败' }, { status: 500 });
  }
}

// ==================== POST：新增商品 ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, status, category, description } = body;

    if (!name) {
      return NextResponse.json({ error: '商品名称为必填项' }, { status: 400 });
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      return NextResponse.json({ error: '请输入有效的商品价格' }, { status: 400 });
    }

    const products = await getProducts();
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const code = await generateCode();

    const newProduct: Product = {
      id: generateId(),
      createdAt,
      code,
      name,
      price: Number(price),
      status: status || 'active',
      category: category || '',
      description: description || '',
    };

    products.push(newProduct);
    await saveProducts(products);

    return NextResponse.json({ data: newProduct }, { status: 201 });
  } catch (error) {
    console.error('新增商品失败:', error);
    return NextResponse.json({ error: '新增商品失败' }, { status: 500 });
  }
}

// ==================== PUT：修改商品 ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, code, price, status, category, description } = body;

    if (!id) {
      return NextResponse.json({ error: '商品ID不能为空' }, { status: 400 });
    }

    const products = await getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: '未找到该商品' }, { status: 404 });
    }

    // 更新字段（商品编码自动生成，不可手动修改）
    if (name !== undefined) products[index].name = name;
    if (price !== undefined) products[index].price = Number(price);
    if (status !== undefined) products[index].status = status;
    if (category !== undefined) products[index].category = category;
    if (description !== undefined) products[index].description = description;

    await saveProducts(products);

    return NextResponse.json({ data: products[index] });
  } catch (error) {
    console.error('修改商品失败:', error);
    return NextResponse.json({ error: '修改商品失败' }, { status: 500 });
  }
}

// ==================== DELETE：删除商品 ====================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '商品ID不能为空' }, { status: 400 });
    }

    const products = await getProducts();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      return NextResponse.json({ error: '未找到该商品' }, { status: 404 });
    }

    products.splice(index, 1);
    await saveProducts(products);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('删除商品失败:', error);
    return NextResponse.json({ error: '删除商品失败' }, { status: 500 });
  }
}
