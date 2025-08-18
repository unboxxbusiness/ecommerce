
import * as React from 'react';
import { getAdminProducts } from '@/lib/firestore-admin';
import type { Product } from '@/lib/types';
import { ProductsClient } from './products-client';

export default async function ProductsPage() {
  const initialProducts: Product[] = await getAdminProducts();

  return (
    <div className="flex min-h-screen w-full flex-col">
       <ProductsClient initialProducts={initialProducts} />
    </div>
  );
}
