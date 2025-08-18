
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product, SiteContent } from '@/lib/types';
import { ShoppingCart, Star, ArrowRight, Menu, X, Gem } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const Logo = ({ className }: { className?: string }) => {
    return (
        <svg
            viewBox="0 0 78 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('h-5 w-auto', className)}>
            <path
                d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H0V15H0Z"
                fill="url(#logo-gradient)"
            />
            <path
                d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06ZM30.4782 10.114C30.4782 9.17333 30.6709 8.34033 31.0562 7.615C31.4529 6.88967 31.9855 6.32867 32.6542 5.932C33.3342 5.524 34.0822 5.32 34.8982 5.32C35.6349 5.32 36.2752 5.46733 36.8192 5.762C37.3745 6.04533 37.8165 6.40233 38.1452 6.833V5.473H40.1002V14.84H38.1452V13.446C37.8165 13.888 37.3689 14.2563 36.8022 14.551C36.2355 14.8457 35.5895 14.993 34.8642 14.993C34.0595 14.993 33.3229 14.789 32.6542 14.381C31.9855 13.9617 31.4529 13.3837 31.0562 12.647C30.6709 11.899 30.4782 11.0547 30.4782 10.114ZM38.1452 10.148C38.1452 9.502 38.0092 8.941 37.7372 8.465C37.4765 7.989 37.1309 7.62633 36.7002 7.377C36.2695 7.12767 35.8049 7.003 35.3062 7.003C34.8075 7.003 34.3429 7.12767 33.9122 7.377C33.4815 7.615 33.1302 7.972 32.8582 8.448C32.5975 8.91267 32.4672 9.468 32.4672 10.114C32.4672 10.76 32.5975 11.3267 32.8582 11.814C33.1302 12.3013 33.4815 12.6753 33.9122 12.936C34.3542 13.1853 34.8189 13.31 35.3062 13.31C35.8049 13.31 36.2695 13.1853 36.7002 12.936C37.1309 12.6867 37.4765 12.324 37.7372 11.848C38.0092 11.3607 38.1452 10.794 38.1452 10.148ZM43.6317 4.232C43.2803 4.232 42.9857 4.113 42.7477 3.875C42.5097 3.637 42.3907 3.34233 42.3907 2.991C42.3907 2.63967 42.5097 2.345 42.7477 2.107C42.9857 1.869 43.2803 1.75 43.6317 1.75C43.9717 1.75 44.2607 1.869 44.4987 2.107C44.7367 2.345 44.8557 2.63967 44.8557 2.991C44.8557 3.34233 44.7367 3.637 44.4987 3.875C44.2607 4.113 43.9717 4.232 43.6317 4.232ZM44.5837 5.473V14.84H42.6457V5.473H44.5837ZM49.0661 2.26V14.84H47.1281V2.26H49.0661ZM50.9645 10.114C50.9645 9.17333 51.1572 8.34033 51.5425 7.615C51.9392 6.88967 52.4719 6.32867 53.1405 5.932C53.8205 5.524 54.5685 5.32 55.3845 5.32C56.1212 5.32 56.7615 5.46733 57.3055 5.762C57.8609 6.04533 58.3029 6.40233 58.6315 6.833V5.473H60.5865V14.84H58.6315V13.446C58.3029 13.888 57.8552 14.2563 57.2885 14.551C56.7219 14.8457 56.0759 14.993 55.3505 14.993C54.5459 14.993 53.8092 14.789 53.1405 14.381C52.4719 13.9617 51.9392 13.3837 51.5425 12.647C51.1572 11.899 50.9645 11.0547 50.9645 10.114ZM58.6315 10.148C58.6315 9.502 58.4955 8.941 58.2235 8.465C57.9629 7.989 57.6172 7.62633 57.1865 7.377C56.7559 7.12767 56.2912 7.003 55.7925 7.003C55.2939 7.003 54.8292 7.12767 54.3985 7.377C53.9679 7.615 53.6165 7.972 53.3445 8.448C53.0839 8.91267 52.9535 9.468 52.9535 10.114C52.9535 10.76 53.0839 11.3267 53.3445 11.814C53.6165 12.3013 53.9679 12.6753 54.3985 12.936C54.8405 13.1853 55.3052 13.31 55.7925 13.31C56.2912 13.31 56.7559 13.1853 57.1865 12.936C57.6172 12.6867 57.9629 12.324 58.2235 11.848C58.4955 11.3607 58.6315 10.794 58.6315 10.148ZM65.07 6.833C65.3533 6.357 65.7273 5.98867 66.192 5.728C66.668 5.456 67.229 5.32 67.875 5.32V7.326H67.382C66.6227 7.326 66.0447 7.51867 65.648 7.904C65.2627 8.28933 65.07 8.958 65.07 9.91V14.84H63.132V5.473H65.07V6.833ZM73.3624 10.165L77.6804 14.84H75.0624L71.5944 10.811V14.84H69.6564V2.26H71.5944V9.57L74.9944 5.473H77.6804L73.3624 10.165Z"
                fill="currentColor"
            />
            <defs>
                <linearGradient
                    id="logo-gradient"
                    x1="10"
                    y1="0"
                    x2="10"
                    y2="20"
                    gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9B99FE" />
                    <stop
                        offset="1"
                        stopColor="#2BC8B7"
                    />
                </linearGradient>
            </defs>
        </svg>
    )
}

function HeroSection({ siteContent }: { siteContent: SiteContent }) {
    const [menuState, setMenuState] = React.useState(false);
    const { user, loading, logout } = useAuth();
    const { cartCount } = useCart();
    const router = useRouter();
    const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const hero = siteContent.homePage.hero;
    const global = siteContent.global;

    if (!hero.show) return null;

    return (
        <div className="relative">
            <header>
                 <nav
                    data-state={menuState ? 'active' : 'inactive'}
                    className="group fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent">
                    <div className="m-auto max-w-6xl px-6">
                        <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                            <div className="flex w-full justify-between lg:w-auto">
                                <Link href="/" className="flex items-center gap-2">
                                     <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:bg-primary/10 hover:text-primary">
                                         {global.logoUrl ? <img src={global.logoUrl} alt={global.siteName} className="size-5" /> : <Gem className="size-5" />}
                                     </Button>
                                     <span className="font-headline text-lg font-semibold">{global.siteName}</span>
                                 </Link>
                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                    className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                    <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                    <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                                </button>
                            </div>

                            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                                <div className="lg:pr-4">
                                     <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                                         {global.footerLinks.slice(0, 2).map(link => (
                                             <li key={link.id}>
                                                 <Link href={link.url} className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                     <span>{link.text}</span>
                                                 </Link>
                                             </li>
                                         ))}
                                     </ul>
                                </div>
                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                                     <Link href="/cart">
                                        <Button variant="ghost" size="icon" className="relative">
                                        <ShoppingCart className="h-5 w-5" />
                                        {cartCount > 0 && (
                                            <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                                            {cartCount}
                                            </Badge>
                                        )}
                                        <span className="sr-only">Cart</span>
                                        </Button>
                                    </Link>
                                    {loading ? (
                                        <Skeleton className="h-9 w-24 rounded-md" />
                                     ) : user ? (
                                        <>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/account">My Account</Link>
                                        </Button>
                                        <Button onClick={logout} size="sm">Logout</Button>
                                        </>
                                    ) : (
                                        <>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/login">Login</Link>
                                        </Button>
                                        <Button asChild size="sm">
                                            <Link href="/signup">Sign Up</Link>
                                        </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
             <main>
                <section className="overflow-hidden">
                    <div className="relative mx-auto max-w-6xl px-6 pt-28 md:pt-20 pb-16">
                        <div className="lg:flex lg:items-center lg:gap-12">
                            <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <h1 className="mt-10 text-balance text-4xl font-bold md:text-5xl xl:text-5xl">{hero.title}</h1>
                                <p className="mt-8 text-muted-foreground">{hero.subtitle}</p>
                                 <div className="mt-12 flex justify-center lg:justify-start">
                                     <Button size="lg" asChild>
                                        <Link href={hero.ctaLink}>{hero.ctaText}</Link>
                                    </Button>
                                 </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 -z-10 -mx-4 rounded-3xl p-3 lg:w-1/2 lg:right-0 lg:left-auto">
                            <div aria-hidden className="absolute z-[1] inset-0 bg-gradient-to-r from-background from-0% md:from-35%" />
                            <div className="relative h-full">
                                <Image
                                    className="h-full w-full object-cover rounded-2xl"
                                    src={hero.imageUrl}
                                    alt={hero.title}
                                    width={1200}
                                    height={800}
                                    data-ai-hint="hero background"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
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
          <>
            <div className="container py-12">
                <Skeleton className="h-96 w-full mb-12" />
            </div>
             <div className="container py-12">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
            </div>
          </>
      )
  }

  return (
    <>
      <HeroSection siteContent={siteContent} />
      
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
