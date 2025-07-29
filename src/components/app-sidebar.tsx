
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Hospital, MessageSquare, Stethoscope, User, Siren, Heart, Leaf, LifeBuoy, Shield, Pill, FileScan, Baby, HeartPulse } from 'lucide-react';
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
import { useEffect, useState } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { useTranslation } from '@/hooks/use-translation';

export function AppSidebar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { isAdmin } = useAdmin();
  const { t } = useTranslation();

  const links = [
    { href: '/chatbot', label: t('ai_health_chatbot'), icon: MessageSquare },
    { href: '/symptom-checker', label: t('symptom_checker'), icon: Stethoscope },
    { href: '/therapist', label: t('ai_therapist'), icon: Heart },
    { href: '/nutritionist', label: t('ai_nutritionist'), icon: Leaf },
    { href: '/first-aid', label: t('first_aid_assistant'), icon: LifeBuoy },
    { href: '/medication', label: t('medication_tracker'), icon: Pill },
    { href: '/lab-results', label: t('lab_analyzer'), icon: FileScan },
    { href: '/vaccination-tracker', label: t('vaccination_tracker'), icon: Baby },
    { href: '/pregnancy-tracker', label: t('pregnancy_tracker'), icon: HeartPulse },
    { href: '/resources', label: t('health_resources'), icon: BookOpen },
    { href: '/directory', label: t('healthcare_directory'), icon: Hospital },
    { href: '/emergency', label: t('emergency_services'), icon: Siren },
  ];

  const bottomLinks = [
      { href: '/profile', label: t('your_profile'), icon: User },
  ]

  const adminLinks = [
      { href: '/admin', label: t('admin_panel'), icon: Shield },
  ]
  
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
            {isAdmin && isClient && adminLinks.map((link) => (
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
