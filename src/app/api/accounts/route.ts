import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Account, AccountFilter, AccountListResponse } from '@/types/account';

const DATA_FILE = path.join(process.cwd(), 'data', 'accounts.json');
const ROLES_FILE = path.join(process.cwd(), 'data', 'roles.json');

// ==================== 工具函数 ====================

async function getAccounts(): Promise<Account[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveAccounts(accounts: Account[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(accounts, null, 2), 'utf-8');
}

async function getRoles(): Promise<{ id: string; name: string }[]> {
  try {
    const raw = await fs.readFile(ROLES_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** 生成账号 ID（A-五位数字） */
function generateId(accounts: Account[]): string {
  const maxSeq = accounts.reduce((max, a) => {
    const match = a.id.match(/A-(\d+)/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  return `A-${String(maxSeq + 1).padStart(5, '0')}`;
}

// ==================== GET：查询账号列表 ====================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter: AccountFilter = {
      createdAtStart: searchParams.get('createdAtStart') || undefined,
      createdAtEnd: searchParams.get('createdAtEnd') || undefined,
      phone: searchParams.get('phone') || undefined,
      name: searchParams.get('name') || undefined,
      roleName: searchParams.get('roleName') || undefined,
      page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
      pageSize: Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '10', 10))),
    };

    // 支持 type=roles 获取角色列表
    if (searchParams.get('type') === 'roles') {
      const roles = await getRoles();
      return NextResponse.json(roles);
    }

    let accounts = await getAccounts();

    // 筛选
    if (filter.createdAtStart) {
      accounts = accounts.filter((a) => a.createdAt >= filter.createdAtStart!);
    }
    if (filter.createdAtEnd) {
      accounts = accounts.filter((a) => a.createdAt <= filter.createdAtEnd!);
    }
    if (filter.phone) {
      const kw = filter.phone.trim().toLowerCase();
      accounts = accounts.filter((a) => a.phone.includes(kw));
    }
    if (filter.name) {
      const kw = filter.name.trim().toLowerCase();
      accounts = accounts.filter((a) => a.name.toLowerCase().includes(kw));
    }
    if (filter.roleName) {
      const kw = filter.roleName.trim().toLowerCase();
      accounts = accounts.filter((a) => a.roleName.toLowerCase().includes(kw));
    }

    const total = accounts.length;
    const totalPages = Math.ceil(total / filter.pageSize!);
    const start = (filter.page! - 1) * filter.pageSize!;
    const items = accounts.slice(start, start + filter.pageSize!);

    // 返回时不暴露密码
    const safeItems = items.map(({ password, ...rest }) => rest);

    const response: AccountListResponse = { items: safeItems, total, page: filter.page!, pageSize: filter.pageSize!, totalPages };
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/accounts error:', error);
    return NextResponse.json({ error: '获取账号列表失败' }, { status: 500 });
  }
}

// ==================== POST：新增账号 ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, name, roleId, roleName } = body;

    if (!phone || !phone.trim()) {
      return NextResponse.json({ error: '手机号为必填项' }, { status: 400 });
    }
    if (!/^1\d{10}$/.test(phone.trim())) {
      return NextResponse.json({ error: '请输入有效的手机号' }, { status: 400 });
    }
    if (!name || !name.trim()) {
      return NextResponse.json({ error: '用户姓名为必填项' }, { status: 400 });
    }
    if (!roleId) {
      return NextResponse.json({ error: '请选择所属角色' }, { status: 400 });
    }

    const accounts = await getAccounts();

    // 检查手机号是否已存在
    if (accounts.some((a) => a.phone === phone.trim())) {
      return NextResponse.json({ error: '该手机号已存在' }, { status: 400 });
    }

    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newAccount: Account = {
      id: generateId(accounts),
      createdAt,
      phone: phone.trim(),
      name: name.trim(),
      roleId,
      roleName: roleName || '',
      password: '123123',
    };

    accounts.push(newAccount);
    await saveAccounts(accounts);

    const { password, ...safe } = newAccount;
    return NextResponse.json({ message: '新增成功', account: safe }, { status: 201 });
  } catch (error) {
    console.error('POST /api/accounts error:', error);
    return NextResponse.json({ error: '新增账号失败' }, { status: 500 });
  }
}

// ==================== PUT：修改账号 ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, phone, name, roleId, roleName } = body;

    if (!id) {
      return NextResponse.json({ error: '缺少账号 ID' }, { status: 400 });
    }

    const accounts = await getAccounts();
    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 });
    }

    if (phone !== undefined) {
      if (!/^1\d{10}$/.test(phone.trim())) {
        return NextResponse.json({ error: '请输入有效的手机号' }, { status: 400 });
      }
      // 检查手机号是否与其他账号重复
      if (accounts.some((a) => a.phone === phone.trim() && a.id !== id)) {
        return NextResponse.json({ error: '该手机号已被其他账号使用' }, { status: 400 });
      }
      accounts[index].phone = phone.trim();
    }
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({ error: '用户姓名不能为空' }, { status: 400 });
      }
      accounts[index].name = name.trim();
    }
    if (roleId !== undefined) {
      accounts[index].roleId = roleId;
      if (roleName !== undefined) {
        accounts[index].roleName = roleName;
      }
    }

    await saveAccounts(accounts);
    const { password, ...safe } = accounts[index];
    return NextResponse.json({ message: '修改成功', account: safe });
  } catch (error) {
    console.error('PUT /api/accounts error:', error);
    return NextResponse.json({ error: '修改账号失败' }, { status: 500 });
  }
}

// ==================== DELETE：删除账号 ====================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '缺少账号 ID' }, { status: 400 });
    }

    const accounts = await getAccounts();
    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 });
    }

    // 禁止删除最后一个管理员
    const adminRoleAccounts = accounts.filter((a) => a.roleName === '超级管理员');
    if (adminRoleAccounts.length <= 1 && accounts[index].roleName === '超级管理员') {
      return NextResponse.json({ error: '至少保留一个管理员账号' }, { status: 400 });
    }

    accounts.splice(index, 1);
    await saveAccounts(accounts);

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('DELETE /api/accounts error:', error);
    return NextResponse.json({ error: '删除账号失败' }, { status: 500 });
  }
}

// ==================== PATCH：重置密码 ====================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: '缺少账号 ID' }, { status: 400 });
    }

    const accounts = await getAccounts();
    const index = accounts.findIndex((a) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 });
    }

    accounts[index].password = '123456';
    await saveAccounts(accounts);

    return NextResponse.json({ message: '密码已重置为 123456' });
  } catch (error) {
    console.error('PATCH /api/accounts error:', error);
    return NextResponse.json({ error: '重置密码失败' }, { status: 500 });
  }
}
