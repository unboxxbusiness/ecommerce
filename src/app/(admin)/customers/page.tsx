
import * as React from 'react';
import { getAdminCustomers } from '@/lib/firestore-admin';
import type { Customer } from '@/lib/types';
import { CustomersClient } from './customers-client';

export default async function CustomersPage() {
  const initialCustomers: Customer[] = await getAdminCustomers();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <CustomersClient initialCustomers={initialCustomers} />
    </div>
  );
}
