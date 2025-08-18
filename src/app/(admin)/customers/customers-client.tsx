
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
import { PlusCircle, Download } from 'lucide-react';
import type { Customer } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Papa from 'papaparse';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [customers, setCustomers] = React.useState<Customer[]>(initialCustomers);
  const { toast } = useToast();

  React.useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  const handleExport = () => {
    const dataToExport = customers.map(customer => ({
        'Customer ID': customer.id,
        'Name': customer.name,
        'Email': customer.email,
        'Role': customer.role,
        'Status': customer.isActive ? 'Active' : 'Inactive',
        'Join Date': new Date(customer.joinDate).toLocaleDateString(),
        'Total Orders': customer.totalOrders,
        'Total Spent (INR)': customer.totalSpent.toFixed(2),
    }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: 'Export Complete', description: 'Your customers have been downloaded as a CSV file.' });
  };

  return (
    <>
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
                <Button size="sm" className="gap-1" asChild>
                    <Link href="/customers/new">
                        <PlusCircle className="h-4 w-4" />
                        Add Customer
                    </Link>
                </Button>
            </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Customer Profiles</CardTitle>
            <CardDescription>View and manage your customer data.</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
                columns={columns}
                data={customers}
                filterColumnId="name"
                filterPlaceholder="Filter by customer..."
            />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
