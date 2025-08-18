
"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  MenuItem,
  ProductItem,
  HoveredLink,
} from "@/components/ui/hover-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import type { Product, Page, SiteContent } from "@/lib/types";
import { getProducts } from "@/lib/firestore";
import Link from "next/link";
import { Button } from "./ui/button";
import { Gem, ShoppingCart, Book, Trees, Sunset, Zap } from "lucide-react";
import { Badge } from "./ui/badge";

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [categories, setCategories] = useState<
    Record<string, Product[]>
  >({});
  const [hoveredCategory, setHoveredCategory] = useState<string>('');


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
      if (Object.keys(groupedCategories).length > 0) {
        setHoveredCategory(Object.keys(groupedCategories)[0]);
      }


      const pagesData = await fetch("/api/pages").then((res) => res.json());
      setPages(pagesData.slice(0, 2));

      const content = await fetch("/api/content").then((res) => res.json());
      setSiteContent(content);
    };
    fetchNavData();
  }, []);

  const aboutMenuItems = [
    {
      title: "About Us",
      url: "/p/about-us",
      icon: <Trees className="size-5 shrink-0" />,
      description: "Learn more about our company and mission.",
    },
    {
      title: "Contact",
      url: "/p/contact",
      icon: <Zap className="size-5 shrink-0" />,
      description: "Get in touch with us.",
    },
  ];

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        {siteContent && (
           <Link href="/" className="flex items-center gap-2 text-black dark:text-white font-semibold hover:opacity-90">
             <Gem className="h-5 w-5" />
             <span>{siteContent.global.siteName}</span>
           </Link>
        )}
        <MenuItem setActive={setActive} active={active} item="Shop">
           <div className="flex">
            <div className="w-48 border-r border-neutral-200 dark:border-white/[0.2] p-4 space-y-2">
              <h3 className="font-bold text-black dark:text-white mb-2">Categories</h3>
              {Object.keys(categories).map((category) => (
                <a
                  key={category}
                  className={cn(
                    "block text-sm p-2 rounded-md",
                    hoveredCategory === category ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white" : "text-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50"
                  )}
                  onMouseEnter={() => setHoveredCategory(category)}
                >
                  {category}
                </a>
              ))}
            </div>
            <div className="text-sm grid grid-cols-2 gap-6 p-4 w-[28rem]">
              {(categories[hoveredCategory] || []).slice(0, 4).map((p) => (
                <ProductItem
                  key={p.id}
                  title={p.name}
                  href={`/products/${p.id}`}
                  src={p.image || "https://placehold.co/140x70.png"}
                  description={p.price.toFixed(2)}
                />
              ))}
            </div>
          </div>
        </MenuItem>
        {pages.length > 0 && (
          <MenuItem setActive={setActive} active={active} item="About">
            <div className="flex flex-col space-y-2 p-4">
              {pages.map((p) => (
                <HoveredLink key={p.id} href={`/p/${p.slug}`}>
                  <div className="flex items-start gap-3">
                    <Gem className="size-5 shrink-0 mt-1" />
                    <div>
                      <span className="text-black dark:text-white font-semibold">{p.title}</span>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">Learn more</p>
                    </div>
                  </div>
                </HoveredLink>
              ))}
            </div>
          </MenuItem>
        )}
        <div className="flex items-center gap-4">
            <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-black dark:text-white">
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
      </Menu>
    </div>
  );
}
