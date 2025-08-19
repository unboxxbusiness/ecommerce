
'use client';

import * as React from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { GoogleAnalytics } from '@/components/google-analytics';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import type { SiteContent } from '@/lib/types';


function PublicLayout({ children }: { children: React.ReactNode }) {
  const [siteContent, setSiteContent] = React.useState<SiteContent | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  usePushNotifications();

   React.useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await fetch('/api/content').then((res) => res.json());
        setSiteContent(content);
      } catch (err) {
        console.error('Failed to load site content', err);
      }
      setLoading(false);
    };
    fetchContent();
  }, []);

  if (loading) {
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
      {siteContent && <Footer content={siteContent} />}
    </div>
  );
}


function LayoutWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

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
  
  const isCustomerPath = 
    pathname.startsWith('/cart') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/account');


  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isPublicPage = !isAdminPath && !isAuthPage && !isCustomerPath;

  return (
    <>
      <Suspense>
        <GoogleAnalytics />
      </Suspense>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <CartProvider>
            {isPublicPage ? (
              <PublicLayout>{children}</PublicLayout>
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
        <meta name="theme-color" content="#fca311" />
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
