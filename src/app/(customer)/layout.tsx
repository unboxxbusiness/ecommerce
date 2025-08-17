
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import LoginPage from '../login/page';
import { useEffect } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Gem } from 'lucide-react';
import Link from 'next/link';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

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
      <header className="flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6">
        <Link href="/account" className="flex items-center gap-2">
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
          <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
            Admin Dashboard
          </Button>
          <Button onClick={logout}>Logout</Button>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
