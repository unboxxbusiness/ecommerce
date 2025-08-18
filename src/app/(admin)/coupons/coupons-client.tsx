
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
import type { Coupon } from '@/lib/types';
import Link from 'next/link';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

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
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
