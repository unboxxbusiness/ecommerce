
'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { CartView } from '@/components/cart-view';


export default function CartPage() {
  const { cartItems } = useCart();
  
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-8">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-xl text-muted-foreground mb-4">Your cart is empty.</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <CartView isPage />
      )}
    </div>
  );
}
