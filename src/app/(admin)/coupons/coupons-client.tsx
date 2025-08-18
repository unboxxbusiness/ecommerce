
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
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Coupon } from '@/lib/types';
import Link from 'next/link';
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
import { deleteCoupon } from '@/lib/firestore';
import { useRouter } from 'next/navigation';

const BulkDeleteButton = ({ table }: { table: Table<Coupon> }) => {
    const { toast } = useToast();
    const router = useRouter();
    
    const handleDelete = async () => {
        const selectedRows = table.getFilteredSelectedRowModel().rows;
        try {
            await Promise.all(selectedRows.map(row => deleteCoupon(row.original.id)));
            toast({ title: `${selectedRows.length} Coupons Deleted`, description: 'The selected coupons have been removed.' });
            table.resetRowSelection();
            router.refresh();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete coupons.' });
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
                This action cannot be undone. This will permanently delete the selected coupons.
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

export function CouponsClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = React.useState<Coupon[]>(initialCoupons);

  React.useEffect(() => {
    setCoupons(initialCoupons);
  }, [initialCoupons]);

  return (
    <>
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Coupons</h2>
            <Button size="sm" className="gap-1" asChild>
                <Link href="/coupons/new">
                    <PlusCircle className="h-4 w-4" />
                    Add Coupon
                </Link>
            </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Promo Codes</CardTitle>
            <CardDescription>View and manage your promotional codes.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
                columns={columns}
                data={coupons}
                filterColumnId="code"
                filterPlaceholder="Filter by code..."
                bulkActions={(table) => <BulkDeleteButton table={table} />}
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
