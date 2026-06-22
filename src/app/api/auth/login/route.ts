import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const ACCOUNTS_FILE = path.join(process.cwd(), 'data', 'accounts.json');
const ROLES_FILE = path.join(process.cwd(), 'data', 'roles.json');

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: '请输入手机号和密码' }, { status: 400 });
    }

    // 读取账号数据
    let accounts: any[] = [];
    try {
      const raw = await fs.readFile(ACCOUNTS_FILE, 'utf-8');
      accounts = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    // 查找账号
    const account = accounts.find((a: any) => a.phone === phone.trim() && a.password === password);
    if (!account) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    // 读取角色数据获取权限
    let userPermissions: any[] = [];
    try {
      const raw = await fs.readFile(ROLES_FILE, 'utf-8');
      const roles = JSON.parse(raw);
      const role = roles.find((r: any) => r.id === account.roleId);
      if (role) {
        userPermissions = role.permissions || [];
      }
    } catch {
      // 角色文件不存在时使用空权限
    }

    // 返回用户信息（不含密码）+ 权限
    const { password: _, ...safeAccount } = account;
    const user = {
      ...safeAccount,
      permissions: userPermissions,
    };

    return NextResponse.json({ user, message: '登录成功' });
  } catch (error) {
    console.error('POST /api/auth/login error:', error);
    return NextResponse.json({ error: '登录失败，请重试' }, { status: 500 });
  }
}
