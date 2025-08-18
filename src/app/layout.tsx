
'use client';

import * as React from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { ThemeProvider } from 'next-themes';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Navbar } from '@/components/navbar';
import { getProducts } from '@/lib/firestore';
import { getSiteContent } from '@/lib/firestore-admin';
import type { SiteContent, Product, Page } from '@/lib/types';
import { getAdminPages } from '@/lib/firestore-admin';
import { GoogleAnalytics } from '@/components/google-analytics';


function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [siteContent, setSiteContent] = React.useState<SiteContent | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [pages, setPages] = React.useState<Page[]>([]);
  const [contentLoading, setContentLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  usePushNotifications();

  React.useEffect(() => {
    const fetchInitialData = async () => {
      setContentLoading(true);
      try {
        const [content, productsData, pagesData] = await Promise.all([
          fetch('/api/content').then(res => res.json()),
          getProducts(),
          getAdminPages()
        ]);
        setSiteContent(content);
        setProducts(productsData);
        setPages(pagesData.filter(p => p.isPublished));
      } catch (err) {
        console.error("Failed to load site data", err);
      }
      setContentLoading(false);
    };
    fetchInitialData();
  }, []);

  React.useEffect(() => {
    if (!authLoading && isAdmin && !pathname.startsWith('/p/')) {
      router.push('/dashboard');
    }
  }, [authLoading, isAdmin, router, pathname]);

  if (authLoading || contentLoading || (isAdmin && !pathname.startsWith('/p/'))) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
       <Navbar 
        siteContent={siteContent!}
        products={products}
        pages={pages}
      />
      <main className="flex-1">{children}</main>
      <FooterContent siteContent={siteContent} contentLoading={contentLoading} />
    </div>
  );
}

const FooterContent = ({ siteContent, contentLoading }: { siteContent: SiteContent | null, contentLoading: boolean }) => {
    if (contentLoading || !siteContent) {
        return (
             <footer className="border-t bg-muted/40 py-6">
                <div className="container flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:px-6">
                    <Skeleton className="h-4 w-48" />
                    <div className="flex gap-4 sm:gap-6">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            </footer>
        )
    }
    return (
        <footer className="border-t bg-muted/40 py-6">
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
        </footer>
    )
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const isAdminPath = pathname.startsWith('/dashboard') ||
                      pathname.startsWith('/orders') ||
                      pathname.startsWith('/products') ||
                      pathname.startsWith('/customers') ||
                      pathname.startsWith('/coupons') ||
                      pathname.startsWith('/marketing') ||
                      pathname.startsWith('/content') ||
                      pathname.startsWith('/pages') ||
                      pathname.startsWith('/settings');

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isPublicPage = !isAdminPath && !isAuthPage;

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
              {isPublicPage ? <CustomerLayout>{children}</CustomerLayout> : children}
            </CartProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
