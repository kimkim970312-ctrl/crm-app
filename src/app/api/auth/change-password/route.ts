import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'accounts.json');

export async function POST(request: NextRequest) {
  try {
    const { id, oldPassword, newPassword } = await request.json();

    if (!id || !oldPassword || !newPassword) {
      return NextResponse.json({ error: '参数不完整' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '新密码长度不能少于6位' }, { status: 400 });
    }

    // 读取账号数据
    let accounts: any[] = [];
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8');
      accounts = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: '读取账号数据失败' }, { status: 500 });
    }

    const index = accounts.findIndex((a: any) => a.id === id);
    if (index === -1) {
      return NextResponse.json({ error: '账号不存在' }, { status: 404 });
    }

    // 校验原密码
    if (accounts[index].password !== oldPassword) {
      return NextResponse.json({ error: '原密码不正确' }, { status: 400 });
    }

    // 更新密码
    accounts[index].password = newPassword;
    await fs.writeFile(DATA_FILE, JSON.stringify(accounts, null, 2), 'utf-8');

    return NextResponse.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('POST /api/auth/change-password error:', error);
    return NextResponse.json({ error: '修改密码失败' }, { status: 500 });
  }
}
