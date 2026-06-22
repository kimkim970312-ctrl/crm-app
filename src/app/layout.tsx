import type { Metadata } from 'next';
import './globals.css';
import RootLayoutClient from './layout.client';

export const metadata: Metadata = {
  title: 'CRM Pro - 客户关系管理',
  description: 'CRM客户关系管理系统',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-800">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
