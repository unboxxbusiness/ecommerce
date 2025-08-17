import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import { Header } from '@/components/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
