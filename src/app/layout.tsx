
'use client';

import * as React from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { ThemeProvider } from 'next-themes';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Gem, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { GoogleAnalytics } from '@/components/google-analytics';
import { Suspense } from 'react';
import type { SiteContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const [siteContent, setSiteContent] = React.useState<SiteContent | null>(null);
  const [contentLoading, setContentLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  usePushNotifications();

  React.useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
          setSiteContent(data)
          setContentLoading(false)
      })
      .catch(err => {
          console.error("Failed to load site content", err)
          setContentLoading(false)
      })
  }, [])

  React.useEffect(() => {
    // Only redirect admin if they are not trying to view a public content page.
    if (!loading && isAdmin && !pathname.startsWith('/p/')) {
      router.push('/dashboard');
    }
  }, [loading, isAdmin, router, pathname]);

  if (isAdmin && !pathname.startsWith('/p/')) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Redirecting to dashboard...</p>
        </div>
    );
  }

  const HeaderContent = () => {
    if (contentLoading || !siteContent) {
      return (
        <>
            <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-24" />
            </div>
        </>
      )
    }
    return (
        <>
        <Link href="/" className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-primary hover:bg-primary/10 hover:text-primary"
            >
                {siteContent.global.logoUrl ? (
                    <img src={siteContent.global.logoUrl} alt={siteContent.global.siteName} className="size-5" />
                ) : (
                    <Gem className="size-5" />
                )}
            </Button>
            <span className="font-headline text-lg font-semibold">
                {siteContent.global.siteName}
            </span>
        </Link>
        <div className="flex items-center gap-4">
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
            <div className="w-24 h-8 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                >
                  Admin
                </Button>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/account">My Account</Link>
              </Button>
              <Button onClick={logout} size="sm">
                Logout
              </Button>
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
        </>
    );
  };
  
   const FooterContent = () => {
    if (contentLoading || !siteContent) {
        return (
            <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-4 sm:gap-6">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        )
    }
    return (
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteContent.global.siteName}. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            {siteContent.global.footerLinks.map(link => (
                 <Link key={link.id} href={link.url} className="text-sm hover:underline">
                    {link.text}
                </Link>
            ))}
          </nav>
        </div>
    )
   }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <HeaderContent />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-muted/40 py-6">
        <FooterContent />
      </footer>
    </div>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pathname, setPathname] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);
  
  const currentPath = usePathname();
   React.useEffect(() => {
    setPathname(currentPath);
  }, [currentPath]);

  // Updated logic: Only treat specific URLs as admin paths.
  const isAdminPath = pathname === '/products' ||
                      pathname === '/pages' ||
                      pathname.startsWith('/dashboard') || 
                      pathname.startsWith('/orders') || 
                      pathname.startsWith('/products/new') || 
                      /^\/products\/[^/]+\/edit$/.test(pathname) ||
                      pathname.startsWith('/customers') || 
                      pathname.startsWith('/coupons') || 
                      pathname.startsWith('/marketing') ||
                      pathname.startsWith('/content') ||
                      pathname.startsWith('/pages/new') ||
                      /^\/pages\/[^/]+\/edit$/.test(pathname) ||
                      pathname.startsWith('/settings');

  const isPublicContentPage = /^\/p\/[^/]+$/.test(pathname);
  const isCustomerPath = !isAdminPath || isPublicContentPage;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#4fb4a5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <CartProvider>
              {isCustomerPath ? <CustomerLayout>{children}</CustomerLayout> : children}
            </CartProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
