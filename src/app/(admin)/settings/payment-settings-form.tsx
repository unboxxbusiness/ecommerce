
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
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    // This is a placeholder. A real implementation would securely save these keys.
    setIsSaving(true);
    console.log('Simulating saving payment settings:', values);
    setTimeout(() => {
        toast({
            title: 'Integration Required',
            description: 'Saving payment gateway settings requires developer implementation.',
        });
        setIsSaving(false);
    }, 1000);
  };

  return (
    <>
    <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Developer Required</AlertTitle>
        <AlertDescription>
            Connecting to a payment gateway requires secure backend logic to handle secret keys and webhooks. This form is a placeholder. Please consult a developer to complete the integration.
        </AlertDescription>
    </Alert>
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
                <Button type="submit" disabled={true}>
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
