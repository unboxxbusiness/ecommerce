
import * as React from 'react';
import { CouponForm } from '../coupon-form';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NewCouponPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Add New Coupon" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Card>
            <CardHeader>
                <CardTitle>Create a New Coupon</CardTitle>
                <CardDescription>Fill in the details below to add a new coupon.</CardDescription>
            </CardHeader>
            <CardContent>
                <CouponForm />
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
