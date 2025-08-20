
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
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


// Dedicated provider for push notifications
function NotificationProvider({ children }: { children: React.ReactNode }) {
  usePushNotifications();
  return <>{children}</>;
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
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
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fca311" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#14213d" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
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
