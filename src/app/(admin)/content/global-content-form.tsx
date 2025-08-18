
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
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
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { updateSiteContent } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import { CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const linkSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Link text is required'),
  url: z.string().url('Must be a valid URL'),
});

const globalContentSchema = z.object({
    siteName: z.string().min(2, 'Site name must be at least 2 characters'),
    logoUrl: z.string().url('Must be a valid URL'),
    footerLinks: z.array(linkSchema),
});

type GlobalContentFormProps = {
  content: SiteContent['global'];
};

export function GlobalContentForm({ content }: GlobalContentFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof globalContentSchema>>({
    resolver: zodResolver(globalContentSchema),
    defaultValues: content,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'footerLinks',
  });

  useEffect(() => {
    form.reset(content);
  }, [content, form]);

  const onSubmit = async (values: z.infer<typeof globalContentSchema>) => {
    setIsSaving(true);
    try {
      await updateSiteContent({ global: values });
      toast({
        title: 'Content Updated',
        description: 'Your global site content has been saved.',
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
        
        <Separator />

        <div>
            <h3 className="text-lg font-medium">Footer Links</h3>
            <div className="space-y-4 mt-4">
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                         <FormField
                            control={form.control}
                            name={`footerLinks.${index}.text`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link Text</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`footerLinks.${index}.url`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ id: crypto.randomUUID(), text: '', url: '' })}>
                Add Footer Link
            </Button>
        </div>


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
