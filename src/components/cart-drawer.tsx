
'use client';

import * as React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription
} from '@/components/ui/sheet';
import { useCartDrawer } from '@/hooks/use-cart-drawer';
import { useCart } from '@/hooks/use-cart';
import { CartView } from './cart-view';
import { Button } from './ui/button';
import Link from 'next/link';

export function CartDrawer() {
    const { isCartDrawerOpen, setIsCartDrawerOpen } = useCartDrawer();
    const { cartItems } = useCart();
    
    return(
        <Sheet open={isCartDrawerOpen} onOpenChange={setIsCartDrawerOpen}>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-6">
                    <SheetTitle>Shopping Cart</SheetTitle>
                    <SheetDescription>
                        Review your items before you checkout.
                    </SheetDescription>
                </SheetHeader>
                {cartItems.length > 0 ? (
                    <CartView />
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-4">
                        <p className="text-muted-foreground">Your cart is empty.</p>
                        <Button
                            variant="outline"
                            onClick={() => setIsCartDrawerOpen(false)}
                            asChild
                        >
                            <Link href="/">Continue Shopping</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
