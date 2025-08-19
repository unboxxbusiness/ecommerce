
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product } from '@/lib/types';
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
import { Loader2, Sparkles, Upload } from 'lucide-react';
import { handleOptimizeDescription, handleCreateProduct, handleUpdateProduct } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CardFooter } from '@/components/ui/card';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from '@/lib/firebase';
import Image from 'next/image';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  image: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
  category: z.string().min(2, 'Category is required'),
});

type ProductFormProps = {
  product?: Product | null;
};

export function ProductForm({ product }: ProductFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      image: '',
      category: ''
    },
  });

  useEffect(() => {
    if (product) {
      form.reset(product);
      setImagePreview(product.image);
    }
  }, [product, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        const storage = getStorage(app);
        const storageRef = ref(storage, `product-images/${Date.now()}-${file.name}`);
        
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        form.setValue('image', downloadURL, { shouldValidate: true });
        setImagePreview(downloadURL);
        toast({ title: 'Image Uploaded', description: 'The image has been successfully uploaded and the URL has been set.' });
    } catch (error) {
        console.error("Firebase Storage upload failed:", error);
        toast({ variant: 'destructive', title: 'Upload Failed', description: 'There was an error uploading your image.' });
    } finally {
        setIsUploading(false);
    }
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    const formData = new FormData();
    formData.append('productName', form.getValues('name'));
    formData.append('productDescription', form.getValues('description'));
    formData.append('keywords', 'handcrafted, unique, quality, sustainable');

    const result = await handleOptimizeDescription(formData);
    
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description: result.error,
      });
    } else if (result.optimizedDescription) {
      form.setValue('description', result.optimizedDescription, { shouldValidate: true });
      toast({
        title: 'Description Optimized!',
        description: 'The product description has been enhanced with AI.',
      });
    }
    setIsOptimizing(false);
  };
  
  const onSubmit = async (values: z.infer<typeof productSchema>) => {
    setIsSaving(true);
    try {
      let result;
      if (product) {
        result = await handleUpdateProduct(product.id, values);
      } else {
        result = await handleCreateProduct(values);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: product ? 'Product Updated' : 'Product Created',
        description: `The product "${values.name}" has been saved.`,
      });
      router.push('/products');
      router.refresh();
    } catch (error: any) {
      console.error('Failed to save product:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: error.message || 'There was an error saving the product. Please try again.',
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Artisan Ceramic Mug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Kitchen" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
            <FormLabel>Product Image</FormLabel>
            <FormControl>
                <div className="flex items-center gap-4">
                    <div className="w-32 h-32 border rounded-md flex items-center justify-center bg-muted overflow-hidden">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="Product preview" width={128} height={128} className="object-cover" data-ai-hint="product image" />
                        ) : (
                             <span className="text-sm text-muted-foreground">Preview</span>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            Upload Image
                        </Button>
                        <Input 
                            type="file" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleImageUpload}
                            accept="image/png, image/jpeg, image/gif, image/webp"
                        />
                         <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 2MB.</p>
                    </div>
                </div>
            </FormControl>
            <FormMessage />
        </FormItem>
        {/* Hidden field to store URL, handled by upload logic */}
        <FormField control={form.control} name="image" render={({ field }) => <Input type="hidden" {...field} />} />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Describe the product"
                    className="min-h-[120px] pr-12"
                    {...field}
                  />
                  <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-2 right-2 h-8 w-8 text-primary hover:bg-primary/10"
                      onClick={handleOptimize}
                      disabled={isOptimizing}
                    >
                      {isOptimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      <span className="sr-only">Optimize with AI</span>
                    </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <CardFooter className="px-0">
            <div className="flex justify-end gap-2 w-full">
                <Button type="button" variant="outline" onClick={() => router.push('/products')} disabled={isSaving}>
                Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isUploading}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Product
                </Button>
            </div>
        </CardFooter>
      </form>
    </Form>
  );
}
