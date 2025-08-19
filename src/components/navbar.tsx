
"use client";

import React, { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from 'next/link';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import type { Product, Page, SiteContent } from "@/lib/types";
import { getProducts } from "@/lib/firestore";
import { Button } from "./ui/button";
import { Gem, ShoppingCart, Sun, Moon, type LucideIcon, icons } from "lucide-react";
import { Badge } from "./ui/badge";
import { useTheme } from "next-themes";
import { useCartDrawer } from "@/hooks/use-cart-drawer";

const DynamicIcon = ({ name }: { name?: string }) => {
  const IconComponent = (icons as Record<string, LucideIcon>)[name || 'Gem'];

  if (!IconComponent) {
    return <Gem className="h-5 w-5 text-primary" />;
  }

  return <IconComponent className="h-5 w-5 text-primary" />;
};

function PublicThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-foreground"
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


export function Navbar({ className }: { className?: string }) {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const { setIsCartDrawerOpen } = useCartDrawer();
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [categories, setCategories] = useState<
    Record<string, Product[]>
  >({});
  
  useEffect(() => {
    const fetchNavData = async () => {
      const productData = await getProducts();
      setProducts(productData);

      const groupedCategories: Record<string, Product[]> = productData.reduce(
        (acc, product) => {
          const { category } = product;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
          return acc;
        },
        {} as Record<string, Product[]>
      );
      setCategories(groupedCategories);
      
      const pagesData = await fetch("/api/pages").then((res) => res.json());
      setPages(pagesData.slice(0, 4)); // limit to 4 pages in nav

      const content = await fetch("/api/content").then((res) => res.json());
      setSiteContent(content);
    };
    fetchNavData();
  }, []);
  
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block',
        className
      )}
    >
      <div className="container flex h-16 items-center">
         {siteContent && (
             <Link href="/" className="flex items-center gap-2 text-foreground font-semibold hover:opacity-90 mr-4">
               <DynamicIcon name={siteContent.header.iconName} />
               <span>{siteContent.header.siteName}</span>
             </Link>
          )}

        <NavigationMenu>
          <NavigationMenuList>
             <NavigationMenuItem>
              <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {Object.entries(categories).map(([category, products]) => (
                    <ListItem
                      key={category}
                      href={`/?category=${encodeURIComponent(category)}#products`}
                      title={category}
                    >
                      {products.length} products available.
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            {pages.length > 0 && (
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {pages.map((page) => (
                      <ListItem
                        key={page.id}
                        href={`/p/${page.slug}`}
                        title={page.title}
                      >
                       Learn more about us and our policies.
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}

             <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/#products">All Products</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

          <div className="flex flex-1 items-center justify-end gap-2">
              <Button variant="ghost" size="icon" className="relative text-foreground" onClick={() => setIsCartDrawerOpen(true)}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                      <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                      {cartCount}
                      </Badge>
                  )}
                  <span className="sr-only">Cart</span>
              </Button>
              <PublicThemeToggle />
               {loading ? (
                  <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
                ) : user ? (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/account">Account</Link>
                    </Button>
                    <Button onClick={logout} size="sm">Logout</Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/login">Log in</Link>
                    </Button>
                  </>
                )}
          </div>
      </div>
    </header>
  );
}
