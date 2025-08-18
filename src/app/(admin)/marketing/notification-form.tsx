
'use client';

import { useForm, useFormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { handleSendNotification } from '@/app/actions';
import { CardFooter } from '@/components/ui/card';

const notificationSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export function NotificationForm() {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof notificationSchema>) => {
    setIsSending(true);
    
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('message', values.message);

    try {
        const result = await handleSendNotification(formData);

        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Send Failed',
                description: result.error,
            });
        } else if (result.success) {
            toast({
                title: 'Notification Sent!',
                description: result.success,
            });
            form.reset();
        }
    } catch(err) {
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'An unexpected error occurred.',
        });
    } finally {
        setIsSending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notification Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. ✨ New Collection Alert! ✨" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Body</FormLabel>
              <FormControl>
                <Textarea
                    placeholder="e.g. Check out our latest arrivals. Tap to shop!"
                    className="min-h-[120px]"
                    {...field}
                  />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CardFooter className="px-0">
            <div className="flex justify-end gap-2 w-full">
                <Button type="submit" disabled={isSending}>
                    {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Notification
                </Button>
            </div>
        </CardFooter>
      </form>
    </Form>
  );
}
