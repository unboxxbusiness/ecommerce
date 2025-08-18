
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
import { PlusCircle, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Table } from '@tanstack/react-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { deleteProduct } from '@/lib/firestore';
import { useRouter } from 'next/navigation';

const BulkDeleteButton = ({ table }: { table: Table<Product> }) => {
    const { toast } = useToast();
    const router = useRouter();
    
    const handleDelete = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        try {
            await Promise.all(selectedRows.map(row => deleteProduct(row.original.id)));
            toast({ title: `${selectedRows.length} Products Deleted`, description: 'The selected products have been removed.' });
            table.resetRowSelection();
            router.refresh();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete products.' });
        }
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 className="h-4 w-4" />
                Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the selected products.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
}

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
              bulkActions={(table) => <BulkDeleteButton table={table} />}
             />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
