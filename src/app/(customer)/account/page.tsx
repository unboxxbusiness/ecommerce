
'use client';

import { useAuth } from '@/hooks/use-auth';
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getCustomerOrders } from '@/lib/firestore';
import type { Order } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function AccountPage() {
  const { user } = useAuth();
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      getCustomerOrders(user.email)
        .then(orders => {
          setUserOrders(orders);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

   const getStatusVariant = (status: Order['status']) => {
        switch(status) {
            case 'Delivered':
                return 'default';
            case 'Shipped':
                return 'secondary';
            case 'Ready to Ship':
                return 'secondary';
             case 'Processing':
                return 'secondary';
            case 'Cancelled':
                return 'destructive';
            case 'Pending':
            default:
                return 'outline';
        }
    }
     const getStatusClass = (status: Order['status']) => {
        switch(status) {
            case 'Delivered':
                return 'bg-green-600 text-white';
            case 'Ready to Ship':
                return 'bg-blue-500 text-white';
            case 'Processing':
                return 'bg-purple-500 text-white';
            default:
                return '';
        }
    }
  

  return (
    <div className="space-y-4 p-4 pt-6 md:p-8">
      <h1 className="text-3xl font-bold">My Account</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user?.photoURL ?? 'https://placehold.co/100x100.png'}
                data-ai-hint="user avatar"
              />
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold">{user?.displayName ?? user?.email}</p>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button>Edit Profile</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>
            View your past orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {loading ? (
             <p>Loading orders...</p>
           ) : userOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                       <Badge
                        variant={getStatusVariant(order.status)}
                        className={getStatusClass(order.status)}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>You have no orders yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
