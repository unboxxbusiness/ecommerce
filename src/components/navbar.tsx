
"use client";

import React, { useState, useEffect } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "@/components/ui/hover-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import type { SiteContent, Product, Page } from "@/lib/types";
import { getProducts } from "@/lib/firestore";
import Link from "next/link";
import { Button } from "./ui/button";
import { Gem, ShoppingCart } from "lucide-react";
import { Badge } from "./ui/badge";

export function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState<Page[]>([]);

  useEffect(() => {
    const fetchNavData = async () => {
      const productData = await getProducts();
      setProducts(productData.slice(0, 4)); // Get first 4 products for the menu

      const pagesData = await fetch("/api/pages").then((res) => res.json());
      setPages(pagesData.slice(0, 2)); // Get first 2 pages for the menu
    };
    fetchNavData();
  }, []);

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <Link href="/">
            <MenuItem setActive={setActive} active={active} item="Digital Shop">
                <Gem className="h-4 w-4 text-black dark:text-white" />
            </MenuItem>
        </Link>
        <MenuItem setActive={setActive} active={active} item="Shop">
          <div className="text-sm grid grid-cols-2 gap-10 p-4">
            {products.map((p) => (
              <ProductItem
                key={p.id}
                title={p.name}
                href={`/products/${p.id}`}
                src={p.image || "https://placehold.co/140x70.png"}
                description={p.category}
              />
            ))}
          </div>
        </MenuItem>
        {pages.length > 0 && (
          <MenuItem setActive={setActive} active={active} item="About">
            <div className="flex flex-col space-y-4 text-sm">
              {pages.map((p) => (
                <HoveredLink key={p.id} href={`/p/${p.slug}`}>
                  {p.title}
                </HoveredLink>
              ))}
            </div>
          </MenuItem>
        )}
        <div className="flex items-center gap-4">
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
