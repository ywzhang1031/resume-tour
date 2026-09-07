import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  title: '张跃文 Yuewen Zhang · Systems & AI',
  description:
    '张跃文的个人履历：高性能系统、模型训练与推理、Coding Agent，以及研究与生活。',
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
