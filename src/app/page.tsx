
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product, SiteContent } from '@/lib/types';
import { ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { getProducts } from '@/lib/firestore';
import { getSiteContent } from '@/lib/firestore-admin';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


function HeroSection({ hero }: { hero: SiteContent['homePage']['hero'] }) {
    if (!hero.show) return null;
    return (
        <section className="relative bg-muted/40 text-center">
            <Image 
                src={hero.imageUrl}
                alt={hero.title}
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-20"
                data-ai-hint="hero background"
            />
            <div className="relative z-10 container px-4 md:px-6 py-24 md:py-32 lg:py-48">
                 <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    {hero.title}
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mt-4">
                    {hero.subtitle}
                </p>
                <Button size="lg" className="mt-8" asChild>
                    <Link href={hero.ctaLink}>{hero.ctaText}</Link>
                </Button>
            </div>
        </section>
    );
}

function TestimonialsSection({ testimonials }: { testimonials: SiteContent['homePage']['testimonials'] }) {
    if (!testimonials.show || testimonials.items.length === 0) return null;

    return (
        <section className="bg-background py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">{testimonials.title}</h2>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {testimonials.items.map(item => (
                        <Card key={item.id} className="p-6">
                            <CardContent className="p-0">
                                <blockquote className="text-lg font-semibold leading-snug">
                                    &ldquo;{item.quote}&rdquo;
                                </blockquote>
                                <div className="mt-4 flex items-center gap-3">
                                     <Avatar>
                                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="person avatar" />
                                        <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{item.author}</p>
                                        <p className="text-sm text-muted-foreground">{item.authorRole}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}


export default function HomePage() {
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [siteContent, setSiteContent] = React.useState<SiteContent | null>(null);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('rating');
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  React.useEffect(() => {
    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [products, content] = await Promise.all([
              getProducts(),
              // This is a client component, but we can call a server action or API route
              // to get server-only data. For simplicity here, we'll fetch on client.
              // In a real app, this would be a server component passing data down.
              fetch('/api/content').then(res => res.json()),
            ]);
            setAllProducts(products);
            setFilteredProducts(products);
            setSiteContent(content);
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load site data.' });
        }
        setLoading(false);
    }
    fetchInitialData();
  }, [toast]);

  const categories = React.useMemo(() => {
    return ['All', ...Array.from(new Set(allProducts.map((p) => p.category)))];
  }, [allProducts]);

  React.useEffect(() => {
    let newFilteredProducts = [...allProducts];

    if (searchQuery) {
      newFilteredProducts = newFilteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      newFilteredProducts = newFilteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (sortBy === 'price-asc') {
      newFilteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      newFilteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      newFilteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(newFilteredProducts);
  }, [searchQuery, selectedCategory, sortBy, allProducts]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading || !siteContent) {
      return (
          <div className="container py-12">
            <Skeleton className="h-48 w-full mb-12" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
            </div>
          </div>
      )
  }

  return (
    <>
      <HeroSection hero={siteContent.homePage.hero} />
      
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Input
                placeholder="Search products..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {loading ? (
              <div className="text-center"><p>Loading products...</p></div>
          ) : (
              <>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                      <Card key={product.id} className="group flex flex-col justify-between overflow-hidden">
                      <Link href={`/products/${product.id}`} className="block">
                          <div className="overflow-hidden">
                          <Image
                              src={product.image || 'https://placehold.co/400x400.png'}
                              alt={product.name}
                              width={400}
                              height={400}
                              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint="product photo"
                          />
                          </div>
                          <CardContent className="p-4">
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          <div className="flex items-center justify-between">
                              <p className="font-semibold text-lg">
                              ₹{product.price.toFixed(2)}
                              </p>
                              <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="text-sm text-muted-foreground">
                                  {(product.rating || 0).toFixed(1)}
                              </span>
                              </div>
                          </div>
                          </CardContent>
                      </Link>
                      <div className="p-4 pt-0">
                          <Button className="w-full" variant="outline" onClick={() => handleAddToCart(product)} disabled={product.stock === 0}>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </Button>
                      </div>
                      </Card>
                  ))}
                  </div>
                  {filteredProducts.length === 0 && (
                  <div className="col-span-full py-12 text-center">
                      <h3 className="text-2xl font-bold">No Products Found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                  </div>
                  )}
              </>
          )}
        </div>
      </section>

      <TestimonialsSection testimonials={siteContent.homePage.testimonials} />

      {siteContent.homePage.ctaBlock.show && (
          <section className="bg-muted/40 py-12 md:py-24">
              <div className="container text-center">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">{siteContent.homePage.ctaBlock.title}</h2>
                  <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed mt-4">{siteContent.homePage.ctaBlock.subtitle}</p>
                  <Button size="lg" className="mt-8" asChild>
                      <Link href={siteContent.homePage.ctaBlock.ctaLink}>{siteContent.homePage.ctaBlock.ctaText}</Link>
                  </Button>
              </div>
          </section>
      )}
    </>
  );
}
