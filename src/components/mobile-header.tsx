
'use client';

import { SidebarTrigger } from './ui/sidebar';
import Link from 'next/link';
import { Logo } from './icons/logo';
import { cn } from '@/lib/utils';
import { UserButton } from './user-button';
import { Button } from './ui/button';
import { Bell, Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { searchNavigator } from '@/ai/flows/search-navigator';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useNotificationPermission } from '@/hooks/use-notification-permission';

export function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { handleRequestPermission, isPermissionLoading } = useNotificationPermission();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const result = await searchNavigator({ query: searchQuery });
      router.push(result.path);
      setIsSearchOpen(false);
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
  
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-background p-4 md:hidden">
      {isSearchOpen ? (
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <Input 
            placeholder="Go to..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
            autoFocus
          />
          <Button type="submit" size="icon" disabled={isSearching}>
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </form>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Link href="/chatbot" className="flex items-center gap-2 font-semibold">
                <Logo className="size-6 text-primary" />
                <span className={cn('text-lg')}>Afya.Ai</span>
            </Link>
          </div>
          <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search />
             </Button>
              <Button variant="ghost" size="icon" onClick={handleRequestPermission} disabled={isPermissionLoading}>
                {isPermissionLoading ? <Loader2 className="animate-spin" /> : <Bell />}
              </Button>
            <UserButton />
          </div>
        </>
      )}
    </header>
  );
}
