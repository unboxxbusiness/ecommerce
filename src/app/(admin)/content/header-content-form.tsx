
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SiteContent } from '@/lib/types';
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
import { handleUpdateSiteContent } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { CardFooter } from '@/components/ui/card';

const headerContentSchema = z.object({
    siteName: z.string().min(2, 'Site name must be at least 2 characters'),
    logoUrl: z.string().url('Must be a valid URL'),
});

type HeaderContentFormProps = {
  content: SiteContent['header'];
};

export function HeaderContentForm({ content }: HeaderContentFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof headerContentSchema>>({
    resolver: zodResolver(headerContentSchema),
    defaultValues: content,
  });

  useEffect(() => {
    form.reset(content);
  }, [content, form]);

  const onSubmit = async (values: z.infer<typeof headerContentSchema>) => {
    setIsSaving(true);
    try {
      const result = await handleUpdateSiteContent({ header: values });
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: 'Content Updated',
        description: 'Your header content has been saved.',
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to save content:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'There was an error saving your content. Please try again.',
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
          name="siteName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Site Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Digital Shop" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
        <CardFooter className="px-0 mt-8">
            <div className="flex justify-end gap-2 w-full">
                <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
                </Button>
            </div>
        </CardFooter>
      </form>
    </Form>
  );
}
