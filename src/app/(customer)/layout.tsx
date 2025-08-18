
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Gem, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Badge } from '@/components/ui/badge';
import { usePushNotifications } from '@/hooks/use-push-notifications';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  
  // Initialize push notifications for logged-in users
  usePushNotifications();

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
              {isAdmin && <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                Admin
              </Button>}
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
      </header>
      <main className="flex-1">{children}</main>
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
