
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Package,
  ShoppingCart,
  TicketPercent,
  Megaphone,
  Palette,
  FileText,
  Search,
  Gem,
  type LucideIcon,
  icons,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { SiteContent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface SidebarProps {
  className?: string;
}

const allNavigationItems: NavigationItem[] = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'orders', name: 'Orders', icon: ShoppingCart, href: '/orders' },
  { id: 'products', name: 'Products', icon: Package, href: '/products' },
  { id: 'customers', name: 'Customers', icon: User, href: '/customers' },
  { id: 'coupons', name: 'Coupons', icon: TicketPercent, href: '/coupons' },
  { id: 'marketing', name: 'Marketing', icon: Megaphone, href: '/marketing' },
  { id: 'content', name: 'Content', icon: Palette, href: '/content' },
  { id: 'pages', name: 'Pages', icon: FileText, href: '/pages' },
];

const DynamicIcon = ({ name, className }: { name?: string, className?:string }) => {
  const IconComponent = (icons as Record<string, LucideIcon>)[name || 'Gem'];

  if (!IconComponent) {
    return <Gem className={className} />;
  }

  return <IconComponent className={className} />;
};


export function Sidebar({ className = "" }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const getInitialActiveItem = () => {
    const activeNav = allNavigationItems.find(item => pathname.startsWith(item.href));
    return activeNav ? activeNav.id : 'dashboard';
  };
  const [activeItem, setActiveItem] = useState(getInitialActiveItem());

  useEffect(() => {
    setActiveItem(getInitialActiveItem());
  }, [pathname]);
  
  useEffect(() => {
      fetch('/api/content')
          .then(res => res.json())
          .then(data => setSiteContent(data));
  }, []);

  const filteredNavigationItems = allNavigationItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
        setIsCollapsed(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleItemClick = (itemId: string) => {
    if (itemId === 'logout') {
        logout();
        return;
    }
    setActiveItem(itemId);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const userInitial = user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'A';

  if (!siteContent) {
      return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden hover:bg-accent"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300" 
          onClick={toggleSidebar} 
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full bg-card border-r z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-64"}
          md:translate-x-0 md:relative md:z-auto
          ${className}
        `}
      >
        <div className={`flex items-center p-4 border-b h-18 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <DynamicIcon name={siteContent.header.iconName} className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">{siteContent.header.siteName}</span>
            </Link>
          )}

          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {filteredNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id} className="list-none">
                  <Link href={item.href} passHref>
                    <button
                        onClick={() => handleItemClick(item.id)}
                        className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group
                        ${isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }
                        ${isCollapsed ? "justify-center" : ""}
                        `}
                        title={isCollapsed ? item.name : undefined}
                    >
                        <Icon className="h-5 w-5 flex-shrink-0"/>
                        {!isCollapsed && <span className="flex-1 text-left">{item.name}</span>}
                    </button>
                  </Link>
                </li>
              );
            })}
        </nav>

        <div className="mt-auto border-t p-3">
          <Link href="/settings">
            <div className={`flex items-center gap-3 p-2 rounded-md ${pathname.startsWith('/settings') ? "bg-accent" : ""}`}>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-muted text-muted-foreground">{userInitial}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{user?.displayName || user?.email}</p>
                  <p className="text-xs text-muted-foreground truncate">Administrator</p>
                </div>
              )}
            </div>
          </Link>
          <button
              onClick={() => handleItemClick("logout")}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 group mt-2
                text-muted-foreground hover:bg-destructive/10 hover:text-destructive
                ${isCollapsed ? "justify-center" : ""}
              `}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="flex-1 text-left">Logout</span>}
            </button>
        </div>
      </div>
    </>
  );
}
