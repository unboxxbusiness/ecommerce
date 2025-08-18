'use client';

import * as React from 'react';
import { Book, Menu, Sunset, Trees, Zap, Gem, ShoppingCart } from "lucide-react";
import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import type { SiteContent, Product, Page } from '@/lib/types';


interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface NavbarProps {
  siteContent: SiteContent,
  products: Product[],
  pages: Page[],
}

export const Navbar = ({ siteContent, products, pages }: NavbarProps) => {
    const { user, loading, logout } = useAuth();
    const { cartCount } = useCart();
    
    const menu: MenuItem[] = [
        { title: 'Home', url: '/' },
        { 
            title: 'Shop',
            url: '/',
            items: products.slice(0, 4).map(p => ({
                title: p.name,
                url: `/products/${p.id}`,
                description: p.category,
                icon: <Gem className="size-5 shrink-0" />
            }))
        },
        ...pages.slice(0, 2).map(p => ({
            title: p.title,
            url: `/p/${p.slug}`
        }))
    ];
    
    const mobileExtraLinks = siteContent.global.footerLinks.map(l => ({
        name: l.text,
        url: l.url
    }))

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto">
        <nav className="hidden justify-between lg:flex py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
                {siteContent.global.logoUrl ? (
                    <img src={siteContent.global.logoUrl} className="w-8" alt={siteContent.global.siteName} />
                ) : (
                    <Gem className="size-8 text-primary" />
                )}
              <span className="text-lg font-semibold">{siteContent.global.siteName}</span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
           <div className="flex items-center gap-2">
                 <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                        <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                        {cartCount}
                        </Badge>
                    )}
                    <span className="sr-only">Cart</span>
                    </Button>
                </Link>

              {loading ? (
                <>
                    <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
                    <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
                </>
              ) : user ? (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/account">My Account</Link>
                  </Button>
                  <Button onClick={logout} size="sm">Logout</Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
        </nav>
        <div className="block lg:hidden py-4">
          <div className="flex items-center justify-between">
             <Link href="/" className="flex items-center gap-2">
                {siteContent.global.logoUrl ? (
                    <img src={siteContent.global.logoUrl} className="w-8" alt={siteContent.global.siteName} />
                ) : (
                    <Gem className="size-8 text-primary" />
                )}
                <span className="text-lg font-semibold">{siteContent.global.siteName}</span>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                     <Link href="/" className="flex items-center gap-2">
                       {siteContent.global.logoUrl ? (
                            <img src={siteContent.global.logoUrl} className="w-8" alt={siteContent.global.siteName} />
                        ) : (
                            <Gem className="size-8 text-primary" />
                        )}
                        <span className="text-lg font-semibold">
                          {siteContent.global.siteName}
                        </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="my-6 flex flex-col gap-6">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>
                  <div className="border-t py-4">
                    <div className="grid grid-cols-2 justify-start">
                      {mobileExtraLinks.map((link, idx) => (
                        <a
                          key={idx}
                          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
                          href={link.url}
                        >
                          {link.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                     {loading ? (
                        <>
                            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                            <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                        </>
                    ) : user ? (
                        <>
                            <Button asChild variant="outline">
                                <Link href="/account">My Account</Link>
                            </Button>
                            <Button onClick={logout}>Logout</Button>
                        </>
                    ) : (
                         <>
                            <Button asChild variant="outline">
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Sign up</Link>
                            </Button>
                        </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items && item.items.length > 0) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <NavigationMenuLink asChild>
                    <Link
                        className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                        href={subItem.url}
                    >
                        {subItem.icon}
                        <div>
                        <div className="text-sm font-semibold">
                            {subItem.title}
                        </div>
                        {subItem.description && (
                            <p className="text-sm leading-snug text-muted-foreground">
                            {subItem.description}
                            </p>
                        )}
                        </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
     <NavigationMenuItem key={item.title}>
        <Link href={item.url} legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {item.title}
            </NavigationMenuLink>
        </Link>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items && item.items.length > 0) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
             <Link
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
     <Link key={item.title} href={item.url} className="font-semibold py-2 block hover:underline">
      {item.title}
    </Link>
  );
};
