
'use client';

import * as React from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import type { SiteContent } from '@/lib/types';

export default function CustomerPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siteContent, setSiteContent] = React.useState<SiteContent | null>(null);
  const [loading, setLoading] = React.useState(true);

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
      <main className="flex-1 pt-16">{children}</main>
      {siteContent && <Footer content={siteContent} />}
    </div>
  );
}
