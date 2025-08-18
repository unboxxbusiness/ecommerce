
'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Minus, Plus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    applyCoupon, 
    subtotal, 
    discount, 
    total, 
    couponApplied 
  } = useCart();
  const [couponCode, setCouponCode] = React.useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = React.useState(false);
  const { toast } = useToast();

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponCode);
    if (success) {
      toast({ title: "Coupon applied!", description: `Coupon "${couponCode.toUpperCase()}" has been applied.` });
    } else {
      toast({ variant: 'destructive', title: "Invalid coupon", description: 'The coupon code you entered is not valid or has expired.' });
    }
    setIsApplyingCoupon(false);
  };

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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4">
                      <Image
                        src={item.image || 'https://placehold.co/100x100.png'}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-md border object-cover"
                        data-ai-hint="product photo"
                      />
                      <div className="flex-1 space-y-1">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 pt-2">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                         <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                         <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponApplied})</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                 <Button className="w-full" asChild>
                   <Link href="/checkout">Proceed to Checkout</Link>
                 </Button>
              </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Coupon Code</CardTitle>
                    <CardDescription>Enter your coupon code to apply a discount.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex gap-2">
                        <Input 
                          placeholder="Enter coupon" 
                          value={couponCode} 
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={!!couponApplied || isApplyingCoupon}
                        />
                        <Button onClick={handleApplyCoupon} disabled={!!couponApplied || isApplyingCoupon || !couponCode}>
                          {isApplyingCoupon && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {couponApplied ? 'Applied' : 'Apply'}
                        </Button>
                    </div>
                </CardContent>
             </Card>
          </div>
        </div>
      )}
    </div>
  );
}
