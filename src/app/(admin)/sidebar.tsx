
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
  { id: 'settings', name: 'Settings', icon: Settings, href: '/settings' },
];

const DynamicIcon = ({ name }: { name?: string }) => {
  const IconComponent = (icons as Record<string, LucideIcon>)[name || 'Gem'];

  if (!IconComponent) {
    return <Gem className="h-8 w-8 text-primary" />;
  }

  return (
    <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
      <IconComponent className="h-5 w-5 text-primary-foreground" />
    </div>
  );
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

  // Auto-open sidebar on desktop
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
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card shadow-md border md:hidden hover:bg-accent transition-all duration-200"
        aria-label="Toggle sidebar"
      >
        {isOpen ? 
          <X className="h-5 w-5 text-muted-foreground" /> : 
          <Menu className="h-5 w-5 text-muted-foreground" />
        }
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-card border-r z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "w-20" : "w-72"}
          md:translate-x-0 md:relative md:z-auto
          ${className}
        `}
      >
        {/* Header with logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b h-16">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <DynamicIcon name={siteContent.header.iconName} />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground text-base">{siteContent.header.siteName}</span>
                <span className="text-xs text-muted-foreground">Admin Dashboard</span>
              </div>
            </div>
          )}

          {isCollapsed && (
             <div className="mx-auto">
                 <DynamicIcon name={siteContent.header.iconName} />
             </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-md hover:bg-accent transition-all duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-background border rounded-md text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {filteredNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <li key={item.id}>
                  <Link href={item.href} passHref>
                    <button
                        onClick={() => handleItemClick(item.id)}
                        className={`
                        w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group relative
                        ${isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        }
                        ${isCollapsed ? "justify-center px-2" : ""}
                        `}
                        title={isCollapsed ? item.name : undefined}
                    >
                        <div className="flex items-center justify-center min-w-[24px]">
                        <Icon
                            className={`
                            h-5 w-5 flex-shrink-0
                            ${isActive 
                                ? "text-primary" 
                                : "text-muted-foreground group-hover:text-foreground"
                            }
                            `}
                        />
                        </div>
                        
                        {!isCollapsed && (
                        <div className="flex items-center justify-between w-full">
                            <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>{item.name}</span>
                        </div>
                        )}

                        {isCollapsed && (
                        <div className="absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                            {item.name}
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-popover rotate-45" />
                        </div>
                        )}
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section with profile and logout */}
        <div className="mt-auto border-t">
          <div className={`border-b ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
            {!isCollapsed ? (
              <div className="flex items-center px-3 py-2 rounded-md bg-accent/50">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-foreground font-medium text-sm">{userInitial}</span>
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-medium text-foreground truncate">{user?.displayName || user?.email}</p>
                  <p className="text-xs text-muted-foreground truncate">Administrator</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                  <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-foreground font-medium text-sm">{userInitial}</span>
                  </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="p-3">
            <button
              onClick={() => handleItemClick("logout")}
              className={`
                w-full flex items-center rounded-md text-left transition-all duration-200 group relative
                text-destructive hover:bg-destructive/10
                ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}
              `}
              title={isCollapsed ? "Logout" : undefined}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <LogOut className="h-5 w-5 flex-shrink-0 text-destructive" />
              </div>
              
              {!isCollapsed && (
                <span className="text-sm font-medium">Logout</span>
              )}
              
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                  Logout
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-1.5 h-1.5 bg-popover rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
