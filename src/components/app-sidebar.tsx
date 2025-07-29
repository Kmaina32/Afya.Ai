
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Hospital, MessageSquare, Stethoscope, User, Siren } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { UserButton } from './user-button';
import { useSidebar } from './ui/sidebar';
import { useEffect, useState } from 'react';


const links = [
  { href: '/chatbot', label: 'AI Health Chatbot', icon: MessageSquare },
  { href: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
  { href: '/resources', label: 'Health Resources', icon: BookOpen },
  { href: '/directory', label: 'Healthcare Directory', icon: Hospital },
  { href: '/emergency', label: 'Emergency Services', icon: Siren },
];

const bottomLinks = [
    { href: '/profile', label: 'Your Profile', icon: User },
]

export function AppSidebar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <SidebarHeader>
        <Link href="/chatbot" className="flex flex-col items-center gap-2 p-2 text-center">
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className={cn('text-xl font-semibold', 'group-data-[collapsible=icon]:hidden')}>Afya.Ai</span>
          </div>
          <div className={cn('text-xs text-muted-foreground', 'group-data-[collapsible=icon]:hidden')}>
            by Milleast.tech
          </div>
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
       <SidebarFooter>
        <SidebarMenu>
            {bottomLinks.map((link) => (
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
        {isClient && <UserButton />}
      </SidebarFooter>
    </>
  );
}
