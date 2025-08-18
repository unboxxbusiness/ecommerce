
'use client';

import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Nav } from '@/nav';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import {useEffect} from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      router.push('/account');
    }
  }, [loading, user, router]);

  if (loading || !user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:bg-primary/10 hover:text-primary">
                <Gem className="size-5" />
             </Button>
            <span className="font-headline text-lg font-semibold group-data-[collapsible=icon]:hidden">Digital Shop</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Nav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
