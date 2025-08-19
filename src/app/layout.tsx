

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
import type { SiteContent, Product, Page } from '@/lib/types';
import { GoogleAnalytics } from '@/components/google-analytics';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { Footer } from '@/components/footer';

function CustomerLayout({
  children,
  siteContent,
  products,
  pages,
  contentLoading,
}: {
  children: React.ReactNode;
  siteContent: SiteContent | null;
  products: Product[];
  pages: Page[];
  contentLoading: boolean;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  usePushNotifications();

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
      <Navbar />
      <main className="flex-1">{children}</main>
      {siteContent && <Footer content={siteContent.global} />}
    </div>
  );
}


function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [siteContent, setSiteContent] = React.useState<SiteContent | null>(null);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [pages, setPages] = React.useState<Page[]>([]);
  const [contentLoading, setContentLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchInitialData = async () => {
      setContentLoading(true);
      try {
        const [content, productsData, pagesData] = await Promise.all([
          fetch('/api/content').then((res) => res.json()),
          getProducts(),
          fetch('/api/pages').then((res) => res.json()), // Fetch pages from an API route
        ]);
        setSiteContent(content);
        setProducts(productsData);
        setPages(pagesData);
      } catch (err) {
        console.error('Failed to load site data', err);
      }
      setContentLoading(false);
    };
    fetchInitialData();
  }, []);

  const isAdminPath =
    pathname.startsWith('/dashboard') ||
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
    <>
      <Suspense>
        <GoogleAnalytics />
      </Suspense>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <CartProvider>
            {isPublicPage ? (
              <CustomerLayout
                siteContent={siteContent}
                products={products}
                pages={pages}
                contentLoading={contentLoading}
              >
                {children}
              </CustomerLayout>
            ) : (
              children
            )}
          </CartProvider>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
