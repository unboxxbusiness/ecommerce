
import * as React from 'react';
import { getAdminPages } from '@/lib/firestore-admin';
import type { Page } from '@/lib/types';
import { PagesClient } from './pages-client';

export default async function PagesListPage() {
  const initialPages: Page[] = await getAdminPages();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <PagesClient initialPages={initialPages} />
    </div>
  );
}
