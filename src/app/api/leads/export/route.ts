import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import type { Lead, Priority, Source } from '@/types/lead';

/** 优先级中文 */
const priorityLabel: Record<string, string> = { high: '高', medium: '中', low: '低' };

/** 来源中文 */
const sourceLabel: Record<string, string> = {
  web: '官网', referral: '转介绍', ads: '广告投放', event: '活动', social: '社交媒体',
};

/** 读取线索数据 */
async function getLeads(): Promise<Lead[]> {
  const filePath = path.join(process.cwd(), 'data', 'leads.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  const json = JSON.parse(raw);
  return json.leads as Lead[];
}

/**
 * 从查询条件生成可读的描述文本
 * 例："创建时间: 2024-06-01 ~ 2024-06-15, 姓名: 张, 优先级: 高"
 */
function describeFilters(params: URLSearchParams): string {
  const parts: string[] = [];
  const start = params.get('createdAtStart');
  const end = params.get('createdAtEnd');
  if (start || end) {
    parts.push(`创建时间: ${start || '不限'} ~ ${end || '不限'}`);
  }
  const name = params.get('name');
  if (name) parts.push(`姓名: ${name}`);
  const phone = params.get('phone');
  if (phone) parts.push(`电话: ${phone}`);
  const source = params.get('source');
  if (source) parts.push(`客户来源: ${sourceLabel[source] || source}`);
  const priority = params.get('priority');
  if (priority) parts.push(`优先级: ${priorityLabel[priority] || priority}`);
  return parts.length > 0 ? parts.join('；') : '无筛选条件（全部数据）';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // 解析筛选条件
    const createdAtStart = searchParams.get('createdAtStart') || '';
    const createdAtEnd = searchParams.get('createdAtEnd') || '';
    const name = searchParams.get('name') || '';
    const phone = searchParams.get('phone') || '';
    const priority = searchParams.get('priority') || '';
    const source = searchParams.get('source') || '';

    let leads = await getLeads();

    // 应用筛选（与列表接口一致，但不分页）
    if (createdAtStart) leads = leads.filter((l) => l.createdAt >= createdAtStart);
    if (createdAtEnd) leads = leads.filter((l) => l.createdAt <= createdAtEnd);
    if (name) leads = leads.filter((l) => l.name.includes(name));
    if (phone) leads = leads.filter((l) => l.phone.includes(phone));
    if (priority) leads = leads.filter((l) => l.priority === priority);
    if (source) leads = leads.filter((l) => l.source === source);

    // 按创建时间倒序
    leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    // ========== 构建 Excel ==========
    const wb = XLSX.utils.book_new();

    // --- 第1行：查询条件标注 ---
    const filterDesc = describeFilters(searchParams);
    const metaData = [
      [`导出时间: ${new Date().toLocaleString('zh-CN')}`],
      [`查询条件: ${filterDesc}`],
      [`导出条数: ${leads.length} 条`],
      [], // 空行分隔
    ];

    // --- 数据行 ---
    const dataRows = leads.map((l) => [
      l.id,
      l.createdAt,
      l.name,
      l.phone,
      priorityLabel[l.priority] || l.priority,
      sourceLabel[l.source] || l.source,
      l.follower.join('、'),
    ]);

    // --- 合并元数据 + 表头 + 数据 ---
    const headers = ['线索编号', '创建时间', '姓名', '电话', '优先级', '客户来源', '跟进人'];
    const sheetData = [...metaData, headers, ...dataRows];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // 设置列宽
    ws['!cols'] = [
      { wch: 18 },  // 线索编号
      { wch: 14 },  // 创建时间
      { wch: 10 },  // 姓名
      { wch: 15 },  // 电话
      { wch: 8 },   // 优先级
      { wch: 12 },  // 客户来源
      { wch: 16 },  // 跟进人
    ];

    // 合并元数据前3行的列（A-G）
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } },
    ];

    // 表头行加粗——通过遍历设置单元格样式
    const headerRowIdx = metaData.length; // 第4行（0-indexed）
    for (let c = 0; c < headers.length; c++) {
      const addr = XLSX.utils.encode_cell({ r: headerRowIdx, c });
      if (!ws[addr]) continue;
      ws[addr].s = {
        font: { bold: true, sz: 11 },
        fill: { fgColor: { rgb: 'EFF6FF' } },
        alignment: { horizontal: 'center' },
      };
    }

    XLSX.utils.book_append_sheet(wb, ws, '线索数据');

    // ========== 生成 Buffer 并返回 ==========
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    const filename = `线索导出_${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      },
    });
  } catch (error) {
    console.error('导出失败:', error);
    return NextResponse.json({ error: '导出失败' }, { status: 500 });
  }
}
