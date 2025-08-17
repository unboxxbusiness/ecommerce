
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/lib/data';
import { Gem, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
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
        <div className="flex items-center gap-2">
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
              Handcrafted goods, sustainable products, and timeless designs for your modern lifestyle.
            </p>
            <Button size="lg" className="mt-6">
              Shop Now
            </Button>
          </div>
        </section>
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="mb-8 text-center text-3xl font-bold">Featured Products</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <Link href="#">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="aspect-square w-full object-cover"
                      data-ai-hint="product photo"
                    />
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </p>
                      <Button className="mt-4 w-full" variant="outline">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
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
