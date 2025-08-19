
'use client';

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { MobileDock } from './mobile-dock';
import { CartDrawer } from '@/components/cart-drawer';
import { CartDrawerContext } from '@/hooks/use-cart-drawer';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false);
  
  return (
    <CartDrawerContext.Provider value={{ isCartDrawerOpen, setIsCartDrawerOpen }}>
      <div className="flex min-h-screen w-full flex-col">
        <Navbar />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <MobileDock />
        <Footer />
        <CartDrawer />
      </div>
    </CartDrawerContext.Provider>
  );
}
