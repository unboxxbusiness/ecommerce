
import * as React from 'react';
import { getAdminCoupons } from '@/lib/firestore-admin';
import type { Coupon } from '@/lib/types';
import { CouponsClient } from './coupons-client';

export default async function CouponsPage() {
  const initialCoupons: Coupon[] = await getAdminCoupons();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <CouponsClient initialCoupons={initialCoupons} />
    </div>
  );
}
