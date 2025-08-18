
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { CardFooter } from '@/components/ui/card';

const paymentSettingsSchema = z.object({
  razorpayKeyId: z.string().min(1, 'Razorpay Key ID is required'),
  razorpayKeySecret: z.string().min(1, 'Razorpay Key Secret is required'),
  razorpayWebhookSecret: z.string().min(1, 'Razorpay Webhook Secret is required'),
});

export function PaymentSettingsForm() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<z.infer<typeof paymentSettingsSchema>>({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      razorpayKeyId: '',
      razorpayKeySecret: '',
      razorpayWebhookSecret: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof paymentSettingsSchema>) => {
    // In a real application, you would make an API call to a secure backend 
    // endpoint to save these keys, likely as environment variables or in a secure vault.
    // For this prototype, we'll just log them and show a toast.
    setIsSaving(true);
    console.log('Simulating saving payment settings. In a real app, these would be sent to a secure backend endpoint, NOT stored in the browser.');
    console.log('Razorpay Key ID:', values.razorpayKeyId);
    console.log('Razorpay Key Secret:', values.razorpayKeySecret);
    console.log('Razorpay Webhook Secret:', values.razorpayWebhookSecret);
    
    setTimeout(() => {
        toast({
            title: 'Settings Saved (Simulated)',
            description: 'Your Razorpay keys have been logged. A restart is required for environment variables to be loaded.',
        });
        setIsSaving(false);
    }, 1000);
  };

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="razorpayKeyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razorpay Key ID</FormLabel>
              <FormControl>
                <Input placeholder="rzp_live_..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="razorpayKeySecret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razorpay Key Secret</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="razorpayWebhookSecret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razorpay Webhook Secret</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CardFooter className="px-0">
            <div className="flex justify-end gap-2 w-full">
                <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
            </div>
        </CardFooter>
      </form>
    </Form>
    </>
  );
}
