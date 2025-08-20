
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Customer } from '@/lib/types';
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
import { handleCreateCustomer, handleUpdateCoupon } from '@/app/actions';
import { updateCustomer } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import { CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  role: z.enum(['admin', 'manager', 'delivery partner', 'customer']).default('customer'),
});

type CustomerFormProps = {
  customer?: Customer | null;
};

export function CustomerForm({ customer }: CustomerFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer || {
      name: '',
      email: '',
      avatar: '',
      isActive: true,
      role: 'customer',
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset(customer);
    }
  }, [customer, form]);

  const onSubmit = async (values: z.infer<typeof customerSchema>) => {
    setIsSaving(true);
    try {
      let result;
      if (customer) {
        await updateCustomer(customer.id, values);
        toast({
          title: 'Customer Updated',
          description: `Details for "${values.name}" have been saved.`,
        });
      } else {
        result = await handleCreateCustomer(values);
         if (result.error) {
          throw new Error(result.error);
        }
        toast({
          title: 'Customer Created',
          description: `The customer "${values.name}" has been added.`,
        });
      }
      router.push('/customers');
      router.refresh();
    } catch (error: any) {
      console.error('Failed to save customer:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'There was an error saving the customer. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                    <Input placeholder="e.g. jane.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/100x100.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="delivery partner">Delivery Partner</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
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
                                Deactivated customers cannot log in.
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
        </div>
        
        <CardFooter className="px-0">
            <div className="flex justify-end gap-2 w-full">
                <Button type="button" variant="outline" onClick={() => router.push('/customers')} disabled={isSaving}>
                Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Customer
                </Button>
            </div>
        </CardFooter>
      </form>
    </Form>
  );
}

