

'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import LoginPage from '@/app/login/page';
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
  
  usePushNotifications();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6">
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
          {isAdmin && <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Admin Dashboard
          </Button>}
          <Button onClick={logout}>Logout</Button>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
