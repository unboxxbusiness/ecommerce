
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Coupon } from '@/lib/types';
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
import { useState, useEffect } from 'react';
import { handleCreateCoupon, handleUpdateCoupon } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const couponSchema = z.object({
  code: z.string().min(4, 'Code must be at least 4 characters').regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only'),
  discount: z.coerce.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
  isActive: z.boolean().default(true),
});

type CouponFormProps = {
  coupon?: Coupon | null;
};

export function CouponForm({ coupon }: CouponFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof couponSchema>>({
    resolver: zodResolver(couponSchema),
    defaultValues: coupon ? {
        ...coupon,
        discount: coupon.discount * 100 // convert back to percentage for form
    } : {
      code: '',
      discount: 10,
      isActive: true,
    },
  });

  useEffect(() => {
    if (coupon) {
      form.reset({
          ...coupon,
          discount: coupon.discount * 100
      });
    }
  }, [coupon, form]);

  const onSubmit = async (values: z.infer<typeof couponSchema>) => {
    setIsSaving(true);
    try {
      const dataToSave = {
          ...values,
          discount: values.discount / 100, // Convert to decimal for storage
      };
      
      let result;
      if (coupon) {
        result = await handleUpdateCoupon(coupon.id, dataToSave);
      } else {
        result = await handleCreateCoupon(dataToSave);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: coupon ? 'Coupon Updated' : 'Coupon Created',
        description: `The coupon "${values.code}" has been saved.`,
      });
      router.push('/coupons');
      router.refresh();
    } catch (error: any) {
      console.error('Failed to save coupon:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'There was an error saving the coupon. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coupon Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. SUMMER25" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount (%)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 10 for 10%" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <p className="text-sm text-muted-foreground">
                            Inactive coupons cannot be used by customers.
                        </p>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
        <CardFooter className="px-0">
            <div className="flex justify-end gap-2 w-full">
                <Button type="button" variant="outline" onClick={() => router.push('/coupons')} disabled={isSaving}>
                Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Coupon
                </Button>
            </div>
        </CardFooter>
      </form>
    </Form>
  );
}
