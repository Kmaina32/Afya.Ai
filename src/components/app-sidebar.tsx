
'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Hospital, MessageSquare, Stethoscope, User, Siren, Heart, Leaf, LifeBuoy, Shield, Pill, Search, Loader2 } from 'lucide-react';
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
import { useEffect, useState, FormEvent } from 'react';
import { useAdmin } from '@/hooks/use-admin';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { searchNavigator } from '@/ai/flows/search-navigator';
import { Button } from './ui/button';

const links = [
  { href: '/chatbot', label: 'AI Health Chatbot', icon: MessageSquare },
  { href: '/symptom-checker', label: 'Symptom Checker', icon: Stethoscope },
  { href: '/therapist', label: 'AI Therapist', icon: Heart },
  { href: '/nutritionist', label: 'AI Nutritionist', icon: Leaf },
  { href: '/first-aid', label: 'First-Aid Assistant', icon: LifeBuoy },
  { href: '/medication', label: 'Medication Tracker', icon: Pill },
  { href: '/resources', label: 'Health Resources', icon: BookOpen },
  { href: '/directory', label: 'Healthcare Directory', icon: Hospital },
  { href: '/emergency', label: 'Emergency Services', icon: Siren },
];

const bottomLinks = [
    { href: '/profile', label: 'Your Profile', icon: User },
]

const adminLinks = [
    { href: '/admin', label: 'Admin Panel', icon: Shield },
]

function SidebarSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { isMobile, state: sidebarState } = useSidebar();

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const result = await searchNavigator({ query: searchQuery });
      router.push(result.path);
      setSearchQuery('');
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: 'Search Failed',
        description: 'Could not find a relevant page. Please try a different query.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  if (isMobile) return null;

  return (
    <div className="p-2">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Go to..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-9 group-data-[collapsible=icon]:hidden"
        />
        {sidebarState === 'collapsed' && (
           <Button variant="ghost" size="icon" className="w-full h-9">
             <Search className="h-4 w-4" />
           </Button>
        )}
        {isSearching && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
        )}
      </form>
    </div>
  )
}

export function AppSidebar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { isAdmin } = useAdmin();
  
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
      <SidebarSearch />
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
