
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import type { Page } from '@/lib/types';
import Link from 'next/link';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';

export function PagesClient({ initialPages }: { initialPages: Page[] }) {
  const [pages, setPages] = React.useState<Page[]>(initialPages);

  React.useEffect(() => {
    setPages(initialPages);
  }, [initialPages]);

  return (
    <>
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Pages</h2>
            <Button size="sm" className="gap-1" asChild>
                <Link href="/pages/new">
                    <PlusCircle className="h-4 w-4" />
                    Add Page
                </Link>
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Content Pages</CardTitle>
            <CardDescription>Manage your informational pages like About Us, Terms, etc.</CardDescription>
          </CardHeader>
          <CardContent>
             <DataTable 
                columns={columns}
                data={pages}
                filterColumnId="title"
                filterPlaceholder="Filter by title..."
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
