
'use client';

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
  revenue: {
    label: 'Revenue',
    color: 'hsl(var(--chart-1))',
  },
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-2))',
  },
};

type DashboardChartsProps = {
    orders: Order[];
    products: Product[];
};

export function DashboardCharts({ orders, products }: DashboardChartsProps) {
  const salesByMonth: { [key: string]: { revenue: number, sales: number } } = {};
  
  orders.forEach(order => {
      if(order.status === 'Delivered') {
        const date = new Date(order.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!salesByMonth[monthYear]) {
          salesByMonth[monthYear] = { revenue: 0, sales: 0 };
        }
        
        salesByMonth[monthYear].revenue += order.total;
        salesByMonth[monthYear].sales += 1;
      }
  });

  const salesData = Object.entries(salesByMonth).map(([monthYear, data]) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      revenue: data.revenue,
      sales: data.sales,
    };
  }).sort((a,b) => new Date(a.month + " 1, 2000").getTime() - new Date(b.month + " 1, 2000").getTime()); // simplistic sort
  
  return (
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={salesData} >
                <CartesianGrid vertical={false} />
                 <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis
                    yAxisId="left"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${new Intl.NumberFormat('en-IN').format(value)}`}
                />
                 <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                 />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} yAxisId="left" />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} yAxisId="right" />
            </BarChart>
        </ChartContainer>
  );
}
