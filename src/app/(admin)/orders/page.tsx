
import * as React from 'react';
import { getAdminOrders } from '@/lib/firestore-admin';
import type { Order } from '@/lib/types';
import { OrdersClient } from './orders-client';

export default async function OrdersPage() {
    const orders: Order[] = await getAdminOrders();

  return (
    <div className="flex min-h-screen w-full flex-col">
       <OrdersClient initialOrders={orders} />
    </div>
  );
}
