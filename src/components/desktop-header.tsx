
'use client';

import { Button } from './ui/button';
import { Bell, Search, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from './ui/input';
import { searchNavigator } from '@/ai/flows/search-navigator';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useNotificationPermission } from '@/hooks/use-notification-permission';

export function DesktopHeader() {
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
      if (result && result.path) {
        router.push(result.path);
      } else {
         router.push('/chatbot');
      }
      setSearchQuery('');
    } catch (error) {
      console.error("Search failed:", error);
      toast({
        title: 'Search Not Available',
        description: 'Navigating you to the chatbot instead.',
        variant: 'destructive',
      });
      router.push('/chatbot');
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b bg-background p-4">
        <div className="flex-1">
            <form onSubmit={handleSearch} className="relative w-full max-w-md">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-10 w-full"
                />
                 {isSearching && (
                    <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                )}
            </form>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleRequestPermission} disabled={isPermissionLoading}>
              {isPermissionLoading ? <Loader2 className="animate-spin" /> : <Bell />}
            </Button>
        </div>
    </header>
  );
}
