
'use client';

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TicketPercent,
  Megaphone,
  Settings,
  Palette,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/products', icon: Package, label: 'Products' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/coupons', icon: TicketPercent, label: 'Coupons' },
  { href: '/marketing', icon: Megaphone, label: 'Marketing' },
  { href: '/content', icon: Palette, label: 'Content' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
