
import * as React from 'react';
import { CouponForm } from '../../coupon-form';
import { getAdminCoupon } from '@/lib/firestore-admin';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function EditCouponPage({
  params,
}: {
  params: { id: string };
}) {
  const coupon = await getAdminCoupon(params.id);

  if (!coupon) {
    notFound();
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
         <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/coupons">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">Edit Coupon</h2>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Edit Coupon Details</CardTitle>
                <CardDescription>Update the information for the coupon below.</CardDescription>
            </CardHeader>
            <CardContent>
                 <CouponForm coupon={coupon} />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
