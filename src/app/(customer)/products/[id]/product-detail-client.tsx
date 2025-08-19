
'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ShareButtons } from '@/components/share-buttons';
import * as React from 'react';

export function ProductDetailClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <main className="flex-1 pt-16">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Image
                src={product.image || 'https://placehold.co/600x600.png'}
                alt={product.name}
                width={600}
                height={600}
                className="aspect-square w-full rounded-lg border object-cover shadow-lg"
                data-ai-hint="product photo"
              />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {product.name}
            </h1>

            <p className="text-4xl font-bold">₹{product.price.toFixed(2)}</p>

            <div>
              <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'} className={product.stock > 0 ? 'bg-green-100 text-green-800' : ''}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </Badge>
              {product.stock > 0 && product.stock < 10 && (
                  <p className="mt-1 text-sm text-yellow-600">Only {product.stock} left!</p>
              )}
            </div>

            {product.variants && product.variants.length > 0 && (
              <div className="grid gap-2">
                  <label className="text-sm font-medium">{product.variants[0].type}</label>
                  <Select defaultValue={product.variants[0].options[0]}>
                      <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder={`Select ${product.variants[0].type}`} />
                      </SelectTrigger>
                      <SelectContent>
                          {product.variants[0].options.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
            )}

            <Button size="lg" disabled={product.stock === 0} onClick={() => handleAddToCart(product)}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            
            <Separator className="my-2" />

            <ShareButtons productName={product.name} />

            <Separator className="my-2" />

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Product Description</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
