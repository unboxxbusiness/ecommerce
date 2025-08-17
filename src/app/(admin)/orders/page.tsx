
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Header } from '@/components/header';
import { getAdminOrders } from '@/lib/firestore-admin';
import type { Order } from '@/lib/types';

export default async function OrdersPage() {
    const orders: Order[] = await getAdminOrders();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Orders" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>An overview of your most recent sales.</CardDescription>
          </CardHeader>
          <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>
                        <div className="font-medium">{order.customerName}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                            {order.customerEmail}
                        </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{new Date(order.date).toLocaleDateString()}</TableCell>
                        <TableCell className="hidden md:table-cell">
                        <Badge
                            variant={
                            order.status === 'Delivered'
                                ? 'default'
                                : order.status === 'Cancelled'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className={order.status === 'Delivered' ? 'bg-green-600 text-white' : ''}
                        >
                            {order.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            {order.items.reduce((acc, item) => acc + item.quantity, 0)}
                        </TableCell>
                        <TableCell className="text-right">
                        ${order.total.toFixed(2)}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
