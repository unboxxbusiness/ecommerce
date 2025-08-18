
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, Users, ShoppingCart, ArrowUpRight } from 'lucide-react';
import { DashboardCharts } from '@/components/dashboard-charts';
import { getAdminOrders, getAdminProducts, getAdminCustomers } from '@/lib/firestore-admin';
import type { Order, Product, Customer } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export default async function DashboardPage() {
  const orders: Order[] = await getAdminOrders();
  const products: Product[] = await getAdminProducts();
  const customers: Customer[] = await getAdminCustomers();
  
  const totalRevenue = orders
    .filter(order => order.status === 'Delivered')
    .reduce((sum, order) => sum + order.total, 0);
  
  const totalSales = orders
    .filter(order => order.status === 'Delivered')
    .length;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const lastMonthRevenue = orders
    .filter(o => o.status === 'Delivered' && new Date(o.date) > thirtyDaysAgo)
    .reduce((sum, o) => sum + o.total, 0);

  const prevMonthRevenue = orders
    .filter(o => {
        const orderDate = new Date(o.date);
        return o.status === 'Delivered' && orderDate < thirtyDaysAgo && orderDate > new Date(thirtyDaysAgo.getTime() - (30 * 24 * 60 * 60 * 1000));
    })
    .reduce((sum, o) => sum + o.total, 0);

  const revenueChange = prevMonthRevenue > 0 ? ((lastMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 100;
  
  const salesChange = 12; // Dummy data for sales change
  const newCustomersCount = customers.filter(c => new Date(c.joinDate) > thirtyDaysAgo).length;
  const activeNow = customers.filter(c => c.isActive).length;

  const recentSales = orders.slice(0, 5);
  const topCustomers = [...customers].sort((a,b) => b.totalSpent - a.totalSpent).slice(0, 5);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
                <DateRangePicker />
                <Button>Download</Button>
            </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {revenueChange.toFixed(2)}% from last month
                        </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">+{totalSales}</div>
                        <p className="text-xs text-muted-foreground">
                            +{salesChange}% from last month
                        </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">+{newCustomersCount}</div>
                        <p className="text-xs text-muted-foreground">in the last 30 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-2xl font-bold">{activeNow}</div>
                        <p className="text-xs text-muted-foreground">
                            Total active customers
                        </p>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                           <DashboardCharts orders={orders} products={products} />
                        </CardContent>
                    </Card>
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Recent Sales</CardTitle>
                            <CardDescription>You made {totalSales} sales this month.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-8">
                                {recentSales.map(order => (
                                    <div key={order.id} className="flex items-center">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src="/avatars/01.png" alt="Avatar" data-ai-hint="person avatar" />
                                            <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{order.customerName}</p>
                                            <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                                        </div>
                                        <div className="ml-auto font-medium">+₹{order.total.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
