
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Page } from '@/lib/types';
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
import { useState, useEffect, useCallback } from 'react';
import { handleCreatePage, handleUpdatePage } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from '@/components/rich-text-editor';

const pageSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  content: z.string().min(10, 'Content is required.'),
  isPublished: z.boolean().default(false),
});

type PageFormProps = {
  page?: Page | null;
};

export function PageForm({ page }: PageFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof pageSchema>>({
    resolver: zodResolver(pageSchema),
    defaultValues: page || {
      title: '',
      slug: '',
      content: '',
      isPublished: false,
    },
  });

  const slugify = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes
  }, []);

  const titleValue = form.watch('title');
  useEffect(() => {
      // only auto-generate slug if it's a new page
      if (!page) {
          form.setValue('slug', slugify(titleValue), { shouldValidate: true });
      }
  }, [titleValue, slugify, form, page]);


  const onSubmit = async (values: z.infer<typeof pageSchema>) => {
    setIsSaving(true);
    try {
      let result;
      if (page) {
        result = await handleUpdatePage(page.id, values);
      } else {
        result = await handleCreatePage(values);
      }

      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: page ? 'Page Updated' : 'Page Created',
        description: `The page "${values.title}" has been saved.`,
      });
      router.push('/pages');
      router.refresh();
    } catch (error) {
      console.error('Failed to save page:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'There was an error saving the page. Please try again.',
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
            name="isPublished"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Publish Status</FormLabel>
                        <p className="text-sm text-muted-foreground">
                            Published pages will be visible to customers.
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
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. About Us" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Slug</FormLabel>
              <FormControl>
                <Input placeholder="e.g. about-us" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Page Content</FormLabel>
                    <FormControl>
                        <RichTextEditor value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        <CardFooter className="px-0">
            <div className="flex justify-end gap-2 w-full">
                <Button type="button" variant="outline" onClick={() => router.push('/pages')} disabled={isSaving}>
                Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Page
                </Button>
            </div>
        </CardFooter>
      </form>
    </Form>
  );
}
