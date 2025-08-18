
'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import { createOrder, updateOrderStatus } from '@/lib/firestore';
import { Loader2, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const shippingSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(5, 'Valid ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
});


type ShippingForm = z.infer<typeof shippingSchema>;

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const { user, loading: authLoading } = useAuth();
  const { cartItems, subtotal, discount, total, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const shippingForm = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { fullName: '', address: '', city: '', zip: '', country: '' },
  });

  React.useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to proceed to checkout.',
        variant: 'destructive'
      });
      router.push('/login');
    }
  }, [authLoading, user, router, toast]);
  
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (authLoading || !user) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (cartItems.length === 0 && currentStep < 2) {
     router.push('/cart');
     return null;
  }

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await shippingForm.trigger();
    } else if (currentStep === 1) {
      isValid = true;
    }
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };
  
  const handlePlaceOrder = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to place an order.' });
        return;
    }
    setIsPlacingOrder(true);
    
    try {
        // 1. Create order in our DB with 'pending' status
        const orderId = await createOrder({
            customerName: shippingForm.getValues('fullName'),
            customerEmail: user.email!,
            date: new Date().toISOString(),
            status: 'Pending',
            total: total,
            items: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
            shippingAddress: shippingForm.getValues()
        });

        // 2. Create Razorpay order
        const res = await fetch('/api/razorpay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: total }),
        });

        if (!res.ok) {
            throw new Error('Failed to create Razorpay order.');
        }

        const razorpayOrder = await res.json();

        // 3. Open Razorpay checkout
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "Digital Shop",
            description: "Order Payment",
            order_id: razorpayOrder.id,
            handler: async function (response: any) {
                const verificationRes = await fetch('/api/razorpay/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: orderId, // Our internal order ID
                    }),
                });

                const verificationData = await verificationRes.json();
                
                if (verificationData.isVerified) {
                    toast({
                        title: "Payment Successful!",
                        description: "Your order has been placed."
                    });
                    clearCart();
                    router.push('/account');
                } else {
                     await updateOrderStatus(orderId, 'Cancelled');
                     toast({ variant: 'destructive', title: 'Payment Failed', description: 'Your payment could not be verified. Please try again.' });
                }
            },
            prefill: {
                name: shippingForm.getValues('fullName'),
                email: user.email,
            },
            theme: {
                color: "#16a34a"
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();

    } catch (error) {
        console.error("Failed to place order:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'There was a problem placing your order. Please try again.' });
    } finally {
        setIsPlacingOrder(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">Checkout</h1>
        <div className="flex items-center justify-center">
            {steps.map((step, index) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                            {index + 1}
                        </div>
                        <p className={`mt-2 text-sm font-medium ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>{step}</p>
                    </div>
                    {index < steps.length - 1 && (
                         <div className={`flex-1 h-1 mx-4 ${index < currentStep ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:col-span-2">
            {currentStep === 0 && (
                <FormProvider {...shippingForm}>
                    <Form {...shippingForm}>
                         <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Shipping Information</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <FormField control={shippingForm.control} name="fullName" render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                     )} />
                                     <FormField control={shippingForm.control} name="address" render={({ field }) => (
                                         <FormItem className="md:col-span-2">
                                            <FormLabel>Address</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                     )} />
                                     <FormField control={shippingForm.control} name="city" render={({ field }) => (
                                         <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                     )} />
                                     <FormField control={shippingForm.control} name="zip" render={({ field }) => (
                                         <FormItem>
                                            <FormLabel>ZIP Code</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                     )} />
                                     <FormField control={shippingForm.control} name="country" render={({ field }) => (
                                         <FormItem className="md:col-span-2">
                                            <FormLabel>Country</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                     )} />
                                </CardContent>
                                <CardFooter className="justify-end">
                                    <Button type="submit">Continue to Payment</Button>
                                </CardFooter>
                            </Card>
                         </form>
                    </Form>
                </FormProvider>
            )}

            {currentStep === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                          <CreditCard className="h-4 w-4" />
                          <AlertTitle>Pay with Razorpay</AlertTitle>
                          <AlertDescription>
                            You will be redirected to Razorpay to complete your payment securely.
                          </AlertDescription>
                        </Alert>
                         <p className="text-sm text-muted-foreground">
                            By proceeding, you agree to the terms and conditions of our payment provider.
                         </p>
                    </CardContent>
                    <CardFooter className="justify-between">
                        <Button variant="outline" onClick={handlePrevStep}>Back to Shipping</Button>
                        <Button onClick={handleNextStep}>Continue to Review</Button>
                    </CardFooter>
                </Card>
            )}
            
            {currentStep === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Review Your Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Shipping to:</h3>
                            <p>{shippingForm.getValues('fullName')}</p>
                            <p>{shippingForm.getValues('address')}</p>
                            <p>{shippingForm.getValues('city')}, {shippingForm.getValues('zip')}</p>
                            <p>{shippingForm.getValues('country')}</p>
                        </div>
                        <Separator/>
                         <div>
                            <h3 className="font-semibold mb-2">Payment Method:</h3>
                            <p>Razorpay</p>
                        </div>
                        <Separator/>
                         <div>
                            <h3 className="font-semibold mb-2">Order Items:</h3>
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-4">
                                        <Image src={item.image || 'https://placehold.co/50x50.png'} alt={item.name} width={50} height={50} className="rounded-md" />
                                        <div>
                                            <p>{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <Separator />
                         <div className="space-y-2">
                            <div className="flex justify-between"><span>Subtotal</span><span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
                            {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span className="font-semibold">-₹{discount.toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-xl"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                         <Button variant="outline" onClick={handlePrevStep} disabled={isPlacingOrder}>Back to Payment</Button>
                         <Button onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                            {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Place Order & Pay
                         </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

    
