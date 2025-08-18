
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = React.useState<Order[]>(initialOrders);
    const { toast } = useToast();

    React.useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);
    
    const handleExport = () => {
        const dataToExport = orders.map(order => ({
            'Order ID': order.id,
            'Customer Name': order.customerName,
            'Customer Email': order.customerEmail,
            'Date': new Date(order.date).toLocaleDateString(),
            'Status': order.status,
            'Total Items': order.items.reduce((acc, item) => acc + item.quantity, 0),
            'Total Amount': order.total.toFixed(2)
        }));

        const csv = Papa.unparse(dataToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({ title: 'Export Complete', description: 'Your orders have been downloaded as a CSV file.' });
    };

  return (
    <>
        <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
             <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                <Button size="sm" variant="outline" className="gap-1" onClick={handleExport}>
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>
            <Card>
            <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>An overview of your most recent sales.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={orders}
                    filterColumnId="customerName"
                    filterPlaceholder="Filter by customer..."
                />
            </CardContent>
            </Card>
        </main>
    </>
  );
}
