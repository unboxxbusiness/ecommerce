
'use client';

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
import type { Order } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateOrderStatus } from '@/lib/firestore';
import { useRouter } from 'next/navigation';

export function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = React.useState<Order[]>(initialOrders);
    const { toast } = useToast();
    const router = useRouter();

    React.useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prevOrders => prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast({
                title: "Order Status Updated",
                description: `Order has been marked as ${newStatus}.`,
            });
             router.refresh();
        } catch (error) {
            console.error("Failed to update order status:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update order status. Please try again.",
            });
        }
    };
    
    const statusOptions: Order['status'][] = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <>
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
                        <TableHead>
                            <span className="sr-only">Actions</span>
                        </TableHead>
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
                            ₹{order.total.toFixed(2)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                        {statusOptions.map(status => (
                                            <DropdownMenuItem 
                                                key={status} 
                                                disabled={order.status === status}
                                                onClick={() => handleStatusUpdate(order.id, status)}
                                            >
                                                Mark as {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
            </CardContent>
            </Card>
        </main>
    </>
  );
}
