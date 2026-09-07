'use client';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
export function PrintButton() {
  return (
    <Button onClick={() => window.print()}>
      <Printer />
      打印 / 保存 PDF
    </Button>
  );
}
