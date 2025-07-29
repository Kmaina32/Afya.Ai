'use client';

import { SidebarTrigger } from './ui/sidebar';
import Link from 'next/link';
import { Logo } from './icons/logo';
import { cn } from '@/lib/utils';
import { UserButton } from './user-button';


export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-background p-4 md:hidden">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Link href="/chatbot" className="flex items-center gap-2 font-semibold">
            <Logo className="size-6 text-primary" />
            <span className={cn('text-lg')}>Afya.Ai</span>
        </Link>
      </div>
      <UserButton />
    </header>
  );
}
