import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Role, RoleFilter, RoleListResponse, PagePermission, FeaturePerm, DataScope } from '@/types/role';

const DATA_FILE = path.join(process.cwd(), 'data', 'roles.json');

// ==================== 工具函数 ====================

async function getRoles(): Promise<Role[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveRoles(roles: Role[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(roles, null, 2), 'utf-8');
}

/** 生成角色 ID（R-五位数字） */
function generateId(roles: Role[]): string {
  const maxSeq = roles.reduce((max, r) => {
    const match = r.id.match(/R-(\d+)/);
    return match ? Math.max(max, parseInt(match[1], 10)) : max;
  }, 0);
  return `R-${String(maxSeq + 1).padStart(5, '0')}`;
}

// ==================== GET：查询角色列表 ====================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter: RoleFilter = {
      name: searchParams.get('name') || undefined,
      page: Math.max(1, parseInt(searchParams.get('page') || '1', 10)),
      pageSize: Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '10', 10))),
    };

    let roles = await getRoles();

    // 筛选
    if (filter.name) {
      const kw = filter.name.trim().toLowerCase();
      roles = roles.filter((r) => r.name.toLowerCase().includes(kw));
    }

    const total = roles.length;
    const totalPages = Math.ceil(total / filter.pageSize!);
    const start = (filter.page! - 1) * filter.pageSize!;
    const items = roles.slice(start, start + filter.pageSize!);

    const response: RoleListResponse = { items, total, page: filter.page!, pageSize: filter.pageSize!, totalPages };
    return NextResponse.json(response);
  } catch (error) {
    console.error('GET /api/roles error:', error);
    return NextResponse.json({ error: '获取角色列表失败' }, { status: 500 });
  }
}

// ==================== POST：新增角色 ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: '角色名称为必填项' }, { status: 400 });
    }

    const roles = await getRoles();
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newRole: Role = {
      id: generateId(roles),
      createdAt,
      name: name.trim(),
      permissions: [],
    };

    roles.push(newRole);
    await saveRoles(roles);

    return NextResponse.json({ message: '新增成功', role: newRole }, { status: 201 });
  } catch (error) {
    console.error('POST /api/roles error:', error);
    return NextResponse.json({ error: '新增角色失败' }, { status: 500 });
  }
}

// ==================== PUT：修改角色名 / 修改权限 ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, permissions } = body;

    if (!id) {
      return NextResponse.json({ error: '缺少角色 ID' }, { status: 400 });
    }

    const roles = await getRoles();
    const index = roles.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: '角色不存在' }, { status: 404 });
    }

    // 修改角色名
    if (name !== undefined) {
      if (!name.trim()) {
        return NextResponse.json({ error: '角色名称不能为空' }, { status: 400 });
      }
      roles[index].name = name.trim();
    }

    // 修改权限
    if (permissions !== undefined) {
      roles[index].permissions = permissions as PagePermission[];
    }

    await saveRoles(roles);
    return NextResponse.json({ message: '修改成功', role: roles[index] });
  } catch (error) {
    console.error('PUT /api/roles error:', error);
    return NextResponse.json({ error: '修改角色失败' }, { status: 500 });
  }
}

// ==================== DELETE：删除角色 ====================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '缺少角色 ID' }, { status: 400 });
    }

    const roles = await getRoles();
    const index = roles.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: '角色不存在' }, { status: 404 });
    }

    // 禁止删除管理员
    if (roles[index].name === '超级管理员') {
      return NextResponse.json({ error: '不能删除管理员角色' }, { status: 400 });
    }

    roles.splice(index, 1);
    await saveRoles(roles);

    return NextResponse.json({ message: '删除成功' });
  } catch (error) {
    console.error('DELETE /api/roles error:', error);
    return NextResponse.json({ error: '删除角色失败' }, { status: 500 });
  }
}
