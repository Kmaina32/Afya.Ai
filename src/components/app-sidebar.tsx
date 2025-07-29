'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Hospital, MessageSquare, Stethoscope } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';

const links = [
  { href: '/chatbot', label: 'AI Health Chatbot', icon: MessageSquare },
  { href: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
  { href: '/resources', label: 'Health Resources', icon: BookOpen },
  { href: '/directory', label: 'Healthcare Directory', icon: Hospital },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/chatbot" className="flex items-center gap-2 p-2">
          <Logo className="size-8 text-primary" />
          <span className={cn('text-xl font-semibold', 'group-data-[collapsible=icon]:hidden')}>AfyaBot</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href)}
                tooltip={{ children: link.label }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span className='group-data-[collapsible=icon]:hidden'>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
