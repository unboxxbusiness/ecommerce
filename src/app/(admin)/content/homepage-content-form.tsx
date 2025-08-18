
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { SiteContent } from '@/lib/types';
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
import { Loader2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { updateSiteContent } from '@/lib/firestore';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const testimonialSchema = z.object({
  id: z.string(),
  quote: z.string().min(10, 'Quote is required'),
  author: z.string().min(2, 'Author is required'),
  authorRole: z.string().min(2, 'Role is required'),
});

const homePageContentSchema = z.object({
  hero: z.object({
    show: z.boolean(),
    title: z.string().min(5, 'Title is required'),
    subtitle: z.string().min(10, 'Subtitle is required'),
    ctaText: z.string().min(2, 'CTA text is required'),
    ctaLink: z.string().url('Must be a valid URL'),
    imageUrl: z.string().url('Must be a valid URL'),
  }),
  testimonials: z.object({
    show: z.boolean(),
    title: z.string().min(5, 'Title is required'),
    items: z.array(testimonialSchema),
  }),
  ctaBlock: z.object({
    show: z.boolean(),
    title: z.string().min(5, 'Title is required'),
    subtitle: z.string().min(10, 'Subtitle is required'),
    ctaText: z.string().min(2, 'CTA text is required'),
    ctaLink: z.string().url('Must be a valid URL'),
  }),
});

type HomePageContentFormProps = {
  content: SiteContent['homePage'];
};

export function HomePageContentForm({ content }: HomePageContentFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof homePageContentSchema>>({
    resolver: zodResolver(homePageContentSchema),
    defaultValues: content,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'testimonials.items',
  });

  useEffect(() => {
    form.reset(content);
  }, [content, form]);

  const onSubmit = async (values: z.infer<typeof homePageContentSchema>) => {
    setIsSaving(true);
    try {
      await updateSiteContent({ homePage: values });
      toast({
        title: 'Content Updated',
        description: 'Your home page content has been saved.',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Accordion type="multiple" defaultValue={['hero']} className="w-full">
            {/* Hero Section */}
            <AccordionItem value="hero">
                <AccordionTrigger className="text-xl font-bold">Hero Section</AccordionTrigger>
                <AccordionContent className="p-1">
                    <Card className="border-none shadow-none">
                        <CardHeader>
                             <FormField
                                control={form.control}
                                name="hero.show"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Show Hero Section</FormLabel>
                                            <p className="text-sm text-muted-foreground">Toggle visibility of the hero section on the homepage.</p>
                                        </div>
                                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="hero.title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="hero.subtitle" render={({ field }) => (<FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="hero.imageUrl" render={({ field }) => (<FormItem><FormLabel>Background Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="hero.ctaText" render={({ field }) => (<FormItem><FormLabel>CTA Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="hero.ctaLink" render={({ field }) => (<FormItem><FormLabel>CTA Button Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>

            {/* Testimonials Section */}
            <AccordionItem value="testimonials">
                <AccordionTrigger className="text-xl font-bold">Testimonials Section</AccordionTrigger>
                <AccordionContent className="p-1">
                    <Card className="border-none shadow-none">
                        <CardHeader>
                             <FormField control={form.control} name="testimonials.show" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5"><FormLabel className="text-base">Show Testimonials</FormLabel><p className="text-sm text-muted-foreground">Toggle visibility of testimonials.</p></div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )}/>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField control={form.control} name="testimonials.title" render={({ field }) => (<FormItem><FormLabel>Section Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                             {fields.map((item, index) => (
                                <Card key={item.id} className="relative p-4">
                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => remove(index)}><Trash2 className="h-4 w-4" /></Button>
                                    <div className="space-y-4">
                                        <FormField control={form.control} name={`testimonials.items.${index}.quote`} render={({ field }) => (<FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField control={form.control} name={`testimonials.items.${index}.author`} render={({ field }) => (<FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                            <FormField control={form.control} name={`testimonials.items.${index}.authorRole`} render={({ field }) => (<FormItem><FormLabel>Author's Role</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                        </div>
                                    </div>
                                </Card>
                             ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ id: crypto.randomUUID(), quote: '', author: '', authorRole: '' })}>Add Testimonial</Button>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
            
            {/* CTA Block Section */}
            <AccordionItem value="ctaBlock">
                <AccordionTrigger className="text-xl font-bold">Call-to-Action Block</AccordionTrigger>
                <AccordionContent className="p-1">
                     <Card className="border-none shadow-none">
                        <CardHeader>
                             <FormField control={form.control} name="ctaBlock.show" render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5"><FormLabel className="text-base">Show CTA Block</FormLabel><p className="text-sm text-muted-foreground">Toggle visibility of the final CTA block.</p></div>
                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </FormItem>
                            )}/>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="ctaBlock.title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="ctaBlock.subtitle" render={({ field }) => (<FormItem><FormLabel>Subtitle</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="ctaBlock.ctaText" render={({ field }) => (<FormItem><FormLabel>CTA Button Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="ctaBlock.ctaLink" render={({ field }) => (<FormItem><FormLabel>CTA Button Link</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        </CardContent>
                    </Card>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

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
