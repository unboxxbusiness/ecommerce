
'use client';

import * as React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import Link from 'next/link';
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
import { createOrder } from '@/lib/firestore';
import { Loader2 } from 'lucide-react';

const shippingSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zip: z.string().min(5, 'Valid ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
});

const paymentSchema = z.object({
  paymentMethod: z.enum(['credit-card', 'paypal'], {
    required_error: 'You need to select a payment method.',
  }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvc: z.string().optional(),
}).refine(data => {
    if (data.paymentMethod === 'credit-card') {
        return !!data.cardNumber && !!data.expiryDate && !!data.cvc;
    }
    return true;
}, { message: "Credit card details are required", path: ['cardNumber']});


type ShippingForm = z.infer<typeof shippingSchema>;
type PaymentForm = z.infer<typeof paymentSchema>;

const steps = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const { user } = useAuth();
  const { cartItems, subtotal, discount, total, couponApplied, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const shippingForm = useForm<ShippingForm>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { fullName: '', address: '', city: '', zip: '', country: '' },
  });

  const paymentForm = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: 'credit-card' },
  });

  if (cartItems.length === 0 && currentStep < 2) {
     router.push('/cart');
     return null;
  }

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await shippingForm.trigger();
    } else if (currentStep === 1) {
      isValid = await paymentForm.trigger();
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
        await createOrder({
            customerName: shippingForm.getValues('fullName'),
            customerEmail: user.email!,
            date: new Date().toISOString(),
            status: 'Pending',
            total: total,
            items: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
            shippingAddress: shippingForm.getValues()
        });

        toast({
            title: "Order Placed!",
            description: "Thank you for your purchase. You will receive a confirmation email shortly."
        });
        clearCart();
        router.push('/account');

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
                 <FormProvider {...paymentForm}>
                    <Form {...paymentForm}>
                         <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Method</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField control={paymentForm.control} name="paymentMethod" render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 gap-4">
                                                    <Label className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent">
                                                        <RadioGroupItem value="credit-card" />
                                                        <span>Credit Card</span>
                                                    </Label>
                                                     <Label className="flex items-center gap-4 rounded-md border p-4 cursor-pointer hover:bg-accent">
                                                        <RadioGroupItem value="paypal" />
                                                        <span>PayPal</span>
                                                    </Label>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                                <CardFooter className="justify-between">
                                    <Button variant="outline" onClick={handlePrevStep}>Back to Shipping</Button>
                                    <Button type="submit">Continue to Review</Button>
                                </CardFooter>
                            </Card>
                         </form>
                    </Form>
                 </FormProvider>
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
                            <p>{paymentForm.getValues('paymentMethod') === 'credit-card' ? "Credit Card" : "PayPal"}</p>
                        </div>
                        <Separator/>
                         <div>
                            <h3 className="font-semibold mb-2">Order Items:</h3>
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-4">
                                        <Image src={item.image} alt={item.name} width={50} height={50} className="rounded-md" />
                                        <div>
                                            <p>{item.name}</p>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <Separator />
                         <div className="space-y-2">
                            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                            {discount > 0 && <div className="flex justify-between"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>}
                            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                         <Button variant="outline" onClick={handlePrevStep} disabled={isPlacingOrder}>Back to Payment</Button>
                         <Button onClick={handlePlaceOrder} disabled={isPlacingOrder}>
                            {isPlacingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Place Order
                         </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
