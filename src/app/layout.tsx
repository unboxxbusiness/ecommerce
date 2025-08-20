
'use client';

import * as React from 'react';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';
import { GoogleAnalytics } from '@/components/google-analytics';
import { usePushNotifications } from '@/hooks/use-push-notifications';

// Dedicated provider for push notifications
function NotificationProvider({ children }: { children: React.ReactNode }) {
  usePushNotifications();
  return <>{children}</>;
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <NotificationProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </NotificationProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
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
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
