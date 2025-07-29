
'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { DesktopHeader } from '@/components/desktop-header';
import { MobileHeader } from '@/components/mobile-header';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <AppSidebar />
      </Sidebar>
      <div className="flex flex-1 flex-col">
        {isClient && (isMobile ? <MobileHeader /> : <DesktopHeader />)}
        <SidebarInset>{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
