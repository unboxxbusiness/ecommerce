
'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import type { Order, Product } from '@/lib/types';

const chartConfig: ChartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
};

type DashboardChartsProps = {
    orders: Order[];
    products: Product[];
};

export function DashboardCharts({ orders, products }: DashboardChartsProps) {
  const salesByMonth: { [key: string]: number } = {};
  orders.forEach(order => {
      if(order.status === 'Delivered') {
        const month = new Date(order.date).toLocaleString('default', { month: 'long' });
        salesByMonth[month] = (salesByMonth[month] || 0) + order.total;
      }
  });

  const salesData = Object.entries(salesByMonth).map(([month, sales]) => ({ month, sales })).reverse();
  
  const productSales: { [key: string]: number } = {};
    orders.forEach(order => {
        if(order.status === 'Delivered') {
            order.items.forEach(item => {
                productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
            });
        }
    });

  const topProductsData = Object.entries(productSales)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 5)
    .map(([name, sales]) => ({ name, sales }));


  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Monthly sales performance for delivered orders</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <LineChart data={salesData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
               <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN').format(value)}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                dataKey="sales"
                type="monotone"
                stroke="var(--color-sales)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>Your best performers by quantity sold</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <BarChart data={topProductsData} layout="vertical" margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={80}
                tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
              />
              <XAxis dataKey="sales" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
