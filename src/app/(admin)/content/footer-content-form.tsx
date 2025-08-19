
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
import { handleUpdateSiteContent } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

const relativeOrAbsoluteUrl = z.string().refine(value => {
    return z.string().url().safeParse(value).success || value.startsWith('/');
}, {
    message: 'Must be a valid URL or a relative path starting with /',
});


const footerLinkSchema = z.object({
  name: z.string().min(1, 'Link text is required'),
  href: relativeOrAbsoluteUrl,
});

const socialLinkSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().url('Must be a valid URL'),
});

const footerSectionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    links: z.array(footerLinkSchema),
})


const footerContentSchema = z.object({
    description: z.string().min(10, 'Description is required'),
    sections: z.array(footerSectionSchema),
    socialLinks: z.array(socialLinkSchema),
    legalLinks: z.array(footerLinkSchema)
});

type FooterContentFormProps = {
  content: SiteContent['footer'];
};

export function FooterContentForm({ content }: FooterContentFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof footerContentSchema>>({
    resolver: zodResolver(footerContentSchema),
    defaultValues: content,
  });
  
  const { fields: footerSections, append: appendFooterSection, remove: removeFooterSection } = useFieldArray({
    control: form.control,
    name: 'sections',
  });
  
  const { fields: socialLinks, append: appendSocialLink, remove: removeSocialLink } = useFieldArray({
    control: form.control,
    name: 'socialLinks',
  });

  const { fields: legalLinks, append: appendLegalLink, remove: removeLegalLink } = useFieldArray({
    control: form.control,
    name: 'legalLinks',
  });

  useEffect(() => {
    form.reset(content);
  }, [content, form]);

  const onSubmit = async (values: z.infer<typeof footerContentSchema>) => {
    setIsSaving(true);
    try {
      const result = await handleUpdateSiteContent({ footer: values });
      if (result.error) {
        throw new Error(result.error);
      }
      toast({
        title: 'Content Updated',
        description: 'Your footer content has been saved.',
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Footer Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short description for the footer." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Footer Link Sections</h3>
            {footerSections.map((section, sectionIndex) => (
                <div key={section.id} className="p-4 border rounded-lg space-y-4">
                     <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Section {sectionIndex + 1}</h4>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeFooterSection(sectionIndex)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Remove Section
                        </Button>
                    </div>
                    <FormField
                        control={form.control}
                        name={`sections.${sectionIndex}.title`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Section Title</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <InnerFieldArray name={`sections.${sectionIndex}.links`} control={form.control} />
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendFooterSection({ title: '', links: [{ name: '', href: ''}] })}>
                Add Footer Section
            </Button>
        </div>
        
        <Separator />
        
        <div>
            <h3 className="text-lg font-medium">Social Media Links</h3>
            <div className="space-y-4 mt-4">
            {socialLinks.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                         <FormField
                            control={form.control}
                            name={`socialLinks.${index}.label`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Facebook"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`socialLinks.${index}.href`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeSocialLink(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendSocialLink({ label: '', href: '' })}>
                Add Social Link
            </Button>
        </div>
        
         <Separator />
        
        <div>
            <h3 className="text-lg font-medium">Legal Links</h3>
            <div className="space-y-4 mt-4">
            {legalLinks.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                         <FormField
                            control={form.control}
                            name={`legalLinks.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link Text</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g. Privacy Policy"/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`legalLinks.${index}.href`}
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
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeLegalLink(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => appendLegalLink({ name: '', href: '' })}>
                Add Legal Link
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


function InnerFieldArray({ control, name }: { control: any, name: string }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name
    });

    return (
        <div className="pl-4 border-l-2 space-y-4">
            <h5 className="font-medium">Links</h5>
            {fields.map((item, index) => (
                <div key={item.id} className="flex items-end gap-2">
                    <div className="grid grid-cols-2 gap-2 flex-1">
                        <FormField
                            control={control}
                            name={`${name}.${index}.name`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Link Text</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name={`${name}.${index}.href`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Link URL</FormLabel>
                                    <FormControl><Input {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', href: '' })}>
                Add Link
            </Button>
        </div>
    );
}
