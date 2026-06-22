import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type { Lead, LeadListResponse, Priority, Source } from '@/types/lead';

/** JSON 文件路径 */
function getFilePath() {
  return path.join(process.cwd(), 'data', 'leads.json');
}

/** 读取线索数据 */
async function getLeads(): Promise<Lead[]> {
  const raw = await fs.readFile(getFilePath(), 'utf-8');
  const json = JSON.parse(raw);
  return json.leads as Lead[];
}

/** 写入线索数据 */
async function saveLeads(leads: Lead[]): Promise<void> {
  await fs.writeFile(getFilePath(), JSON.stringify({ leads }, null, 2), 'utf-8');
}

/** 生成线索编号 */
function generateId(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `XL-${date}${seq}`;
}

/** 优先级排序权重 */
const priorityWeight: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

// ==================== GET：查询列表 ====================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const createdAtStart = searchParams.get('createdAtStart') || '';
    const createdAtEnd = searchParams.get('createdAtEnd') || '';
    const name = searchParams.get('name') || '';
    const phone = searchParams.get('phone') || '';
    const priority = searchParams.get('priority') || '';
    const source = searchParams.get('source') || '';

    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const pageSize = Math.max(1, Math.min(100, Number(searchParams.get('pageSize')) || 10));

    let leads = await getLeads();

    // 筛选条件
    if (createdAtStart) leads = leads.filter((l) => l.createdAt >= createdAtStart);
    if (createdAtEnd) leads = leads.filter((l) => l.createdAt <= createdAtEnd);
    if (name) leads = leads.filter((l) => l.name.includes(name));
    if (phone) leads = leads.filter((l) => l.phone.includes(phone));
    if (priority) leads = leads.filter((l) => l.priority === priority);
    if (source) leads = leads.filter((l) => l.source === source);

    // 按创建时间倒序
    leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    // 分页
    const total = leads.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = leads.slice(start, start + pageSize);

    const response: LeadListResponse = { data, total, page, pageSize, totalPages };
    return NextResponse.json(response);
  } catch (error) {
    console.error('获取线索列表失败:', error);
    return NextResponse.json({ error: '获取线索列表失败' }, { status: 500 });
  }
}

// ==================== POST：新增线索 ====================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, priority, source, follower } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: '姓名和电话为必填项' }, { status: 400 });
    }
    if (!/^1\d{10}$/.test(phone)) {
      return NextResponse.json({ error: '请输入有效的手机号码（11位，1开头）' }, { status: 400 });
    }

    const leads = await getLeads();
    const now = new Date();
    const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newLead: Lead = {
      id: generateId(),
      createdAt,
      name,
      phone,
      priority: priority || 'medium',
      source: source || 'web',
      follower: follower || [],
    };

    leads.push(newLead);
    await saveLeads(leads);

    return NextResponse.json({ data: newLead }, { status: 201 });
  } catch (error) {
    console.error('新增线索失败:', error);
    return NextResponse.json({ error: '新增线索失败' }, { status: 500 });
  }
}

// ==================== PUT：修改线索 ====================
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, phone, priority, source, follower } = body;

    if (!id) {
      return NextResponse.json({ error: '线索编号不能为空' }, { status: 400 });
    }
    if (phone !== undefined && !/^1\d{10}$/.test(phone)) {
      return NextResponse.json({ error: '请输入有效的手机号码（11位，1开头）' }, { status: 400 });
    }

    const leads = await getLeads();
    const index = leads.findIndex((l) => l.id === id);

    if (index === -1) {
      return NextResponse.json({ error: '未找到该线索' }, { status: 404 });
    }

    // 更新字段
    if (name !== undefined) leads[index].name = name;
    if (phone !== undefined) leads[index].phone = phone;
    if (priority !== undefined) leads[index].priority = priority;
    if (source !== undefined) leads[index].source = source;
    if (follower !== undefined) leads[index].follower = follower;

    await saveLeads(leads);

    return NextResponse.json({ data: leads[index] });
  } catch (error) {
    console.error('修改线索失败:', error);
    return NextResponse.json({ error: '修改线索失败' }, { status: 500 });
  }
}

// ==================== DELETE：删除线索 ====================
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '线索编号不能为空' }, { status: 400 });
    }

    const leads = await getLeads();
    const index = leads.findIndex((l) => l.id === id);

    if (index === -1) {
      return NextResponse.json({ error: '未找到该线索' }, { status: 404 });
    }

    leads.splice(index, 1);
    await saveLeads(leads);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('删除线索失败:', error);
    return NextResponse.json({ error: '删除线索失败' }, { status: 500 });
  }
}
