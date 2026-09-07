import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  title: '张跃文 Yuewen Zhang · AI Infra',
  description:
    '从端侧实时系统到 LLM Infra。张跃文的工程项目、研究与交互式面试履历。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body>{children}</body>
    </html>
  );
}
