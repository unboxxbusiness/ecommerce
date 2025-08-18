
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import { DashboardCharts } from '@/components/dashboard-charts';
import { Header } from '@/components/header';
import { getAdminOrders, getAdminProducts, getAdminCustomers } from '@/lib/firestore-admin';
import type { Order, Product, Customer } from '@/lib/types';

export default async function DashboardPage() {
  const orders: Order[] = await getAdminOrders();
  const products: Product[] = await getAdminProducts();
  const customers: Customer[] = await getAdminCustomers();
  
  const totalRevenue = orders
    .filter(order => order.status === 'Delivered')
    .reduce((sum, order) => sum + order.total, 0);

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const newOrdersCount = orders.filter(
    (order) => new Date(order.date) > oneMonthAgo
  ).length;

  const newCustomersCount = customers.filter(
    (customer) => new Date(customer.joinDate) > oneMonthAgo
  ).length;

  const productsInStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockProducts = products.filter(product => product.stock > 0 && product.stock <= 10).length;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Dashboard" />
      <main className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                From completed orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{newOrdersCount}</div>
              <p className="text-xs text-muted-foreground">
                in the last 30 days
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
              <p className="text-xs text-muted-foreground">
                in the last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productsInStock}</div>
              <p className="text-xs text-muted-foreground">
                {lowStockProducts} {lowStockProducts === 1 ? 'product is' : 'products are'} low on stock
              </p>
            </CardContent>
          </Card>
        </div>
        <DashboardCharts orders={orders} products={products} />
      </main>
    </div>
  );
}
