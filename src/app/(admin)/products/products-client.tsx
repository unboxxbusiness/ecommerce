
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export function ProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);

  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  return (
    <>
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Products</h2>
            <Button size="sm" className="gap-1" asChild>
                <Link href="/products/new">
                    <PlusCircle className="h-4 w-4" />
                    Add Product
                </Link>
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>
              Manage your products and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              columns={columns} 
              data={products}
              filterColumnId="name"
              filterPlaceholder="Filter products..."
             />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
