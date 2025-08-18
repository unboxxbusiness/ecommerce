
import * as React from 'react';
import { CouponForm } from '../../coupon-form';
import { Header } from '@/components/header';
import { getAdminCoupon } from '@/lib/firestore-admin';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      <Header title="Edit Coupon" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
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
