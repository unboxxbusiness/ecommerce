
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {useEffect} from 'react';
import { Sidebar } from './sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    // This check is now implicit through the server actions `verifyAdmin` function.
    // Client-side can't reliably check against a server-only env var.
    // If a non-admin gets here, the server actions will deny them.
    // A robust solution might involve a custom claim for roles.

  }, [loading, user, router]);

  if (loading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
