
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { Gem, ShoppingCart, Star } from 'lucide-react';
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
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { getProducts } from '@/lib/firestore';

export default function HomePage() {
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('rating');
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  React.useEffect(() => {
    if (!authLoading && user) {
        router.push('/account');
    }
  }, [authLoading, user, router]);

  React.useEffect(() => {
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const products = await getProducts();
            setAllProducts(products);
            setFilteredProducts(products);
        } catch (err) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load products.' });
        }
        setLoading(false);
    }
    fetchProducts();
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
  
  if (authLoading || user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Gem className="size-5" />
          </Button>
          <span className="font-headline text-lg font-semibold">
            Digital Shop
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart">
              <ShoppingCart />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-muted/40 py-12 text-center md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Discover Our Unique Collection
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Handcrafted goods, sustainable products, and timeless designs for
              your modern lifestyle.
            </p>
          </div>
        </section>
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
                                <p className="text-muted-foreground">
                                ${product.price.toFixed(2)}
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
      </main>
      <footer className="border-t bg-muted/40 py-6">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Digital Shop. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link href="#" className="text-sm hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm hover:underline">
              Privacy Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
